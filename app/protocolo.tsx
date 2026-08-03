import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  Platform
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowLeft, Pill, AlertTriangle } from 'lucide-react-native';
import { getPatientById } from '../data/patientsData';
import { getGenieHint, saveSessionPerformance } from '../utils/adaptiveEngine';
import PatientMonitorHeader from '../components/ui/PatientMonitorHeader';
import ClinicalFeedbackOverlay from '../components/ui/ClinicalFeedbackOverlay';
import NurseGenieAvatar from '../components/ui/NurseGenieAvatar';

export default function ProtocoloScreen() {
  const params = useLocalSearchParams<{ patientId?: string }>();
  const patientId = params.patientId || 'carlos';
  const paciente = getPatientById(patientId);

  const [opcaoSelecionada, setOpcaoSelecionada] = useState<number | null>(null);
  const [erros, setErros] = useState(0);
  const [dicasSolicitadas, setDicasSolicitadas] = useState(0);
  const [tempoInicio] = useState<number>(Date.now());

  const [overlayConfig, setOverlayConfig] = useState<{
    visible: boolean;
    variant: 'success' | 'warning' | 'completion';
    titulo: string;
    mensagem: string;
    explicacaoMedica?: string;
    xpGanhos?: number;
    onConfirm: () => void;
  }>({
    visible: false,
    variant: 'success',
    titulo: '',
    mensagem: '',
    onConfirm: () => {},
  });

  const verificarResposta = async () => {
    if (opcaoSelecionada === null) {
      setOverlayConfig({
        visible: true,
        variant: 'warning',
        titulo: 'Prescrição Pendente',
        mensagem: 'Selecione uma conduta terapêutica antes de enviar ao centro cirúrgico.',
        onConfirm: () => setOverlayConfig(prev => ({ ...prev, visible: false }))
      });
      return;
    }

    if (opcaoSelecionada === paciente.protocolo.correta) {
      try {
        const xpRaw = await AsyncStorage.getItem('xpEnfermeiro');
        const xpAtual = xpRaw ? parseInt(xpRaw, 10) : 0;
        await AsyncStorage.setItem('xpEnfermeiro', (xpAtual + 250).toString());
        
        await AsyncStorage.setItem(`venceu_mod4_paciente_${patientId}`, 'true');
        if (patientId === 'carlos') {
          await AsyncStorage.setItem('venceu_mod4', 'true');
        }

        const tempoTotalSegundos = Math.round((Date.now() - tempoInicio) / 1000);
        const avaliacao = await saveSessionPerformance({
          patientId,
          moduloId: 'protocolo',
          totalPerguntas: 1,
          acertos: 1,
          erros,
          tempoTotalSegundos,
          dicasSolicitadas,
          timestamp: new Date().toISOString()
        });

        setOverlayConfig({
          visible: true,
          variant: 'success',
          titulo: 'Prescrição Farmacológica Aprovada!',
          mensagem: `Conduta imediata executada com perfeição para ${paciente.nome}.\n\n${avaliacao.mensagemGenio}`,
          explicacaoMedica: paciente.protocolo.explicacao,
          xpGanhos: 250,
          onConfirm: () => {
            setOverlayConfig(prev => ({ ...prev, visible: false }));
            router.back();
          }
        });
      } catch (e) {
        console.error(e);
      }
    } else {
      setErros(erros + 1);
      setOverlayConfig({
        visible: true,
        variant: 'warning',
        titulo: 'Risco de Complicação Medicamentosa!',
        mensagem: 'A conduta prescrita possui contraindicação importante ou não traz benefício ao paciente neste estado.',
        explicacaoMedica: paciente.protocolo.explicacao,
        onConfirm: () => setOverlayConfig(prev => ({ ...prev, visible: false }))
      });
    }
  };

  const dicaGenioAtual = getGenieHint(patientId, 3, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <ArrowLeft color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Módulo 4: Farmacologia ({paciente.nome})</Text>
        <View style={{ width: 40 }} />
      </View>

      <PatientMonitorHeader
        nomePaciente={paciente.nome}
        sinaisVitais={paciente.anamnese.sinaisVitais}
        estadoAlarme={paciente.complexidade >= 4 ? 'critico' : 'atencao'}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.protocoloCard}>
          <View style={styles.protocoloHeaderRow}>
            <Pill color="#C084FC" size={22} />
            <Text style={styles.protocoloTitle}>{paciente.protocolo.titulo}</Text>
          </View>
          <Text style={styles.protocoloCenario}>
            <Text style={{ fontWeight: 'bold', color: '#F8FAFC' }}>Cenário Clínico: </Text>
            {paciente.protocolo.cenario}
          </Text>

          {paciente.protocolo.contraindicacoesEspecificas ? (
            <View style={styles.alertBox}>
              <AlertTriangle color="#F59E0B" size={16} />
              <Text style={styles.alertBoxText}>
                ATENÇÃO ÀS CONTRAINDICAÇÕES ESPECÍFICAS DESTE PACIENTE!
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.questionCard}>
          <Text style={styles.questionTitle}>Decisão Terapêutica</Text>
          <Text style={styles.questionText}>{paciente.protocolo.pergunta}</Text>
        </View>

        <View style={styles.optionsContainer}>
          {paciente.protocolo.opcoes.map((opcao, index) => {
            const isSelected = opcaoSelecionada === index;
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.85}
                onPress={() => setOpcaoSelecionada(index)}
                style={[
                  styles.optionButton,
                  isSelected && styles.optionButtonSelected
                ]}
              >
                <Text style={[
                  styles.optionText,
                  isSelected && styles.optionTextSelected
                ]}>
                  {opcao}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={verificarResposta}
          style={styles.confirmButton}
        >
          <Text style={styles.confirmButtonText}>Prescrever e Enviar ao Plantão</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Companion Gênio Enfermeiro */}
      <NurseGenieAvatar
        dicaTexto={dicaGenioAtual}
        onDicaSolicitada={() => setDicasSolicitadas(dicasSolicitadas + 1)}
      />

      <ClinicalFeedbackOverlay
        visible={overlayConfig.visible}
        variant={overlayConfig.variant}
        titulo={overlayConfig.titulo}
        mensagem={overlayConfig.mensagem}
        explicacaoMedica={overlayConfig.explicacaoMedica}
        xpGanhos={overlayConfig.xpGanhos}
        onConfirm={overlayConfig.onConfirm}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  appBar: {
    height: 56,
    backgroundColor: '#1E293B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  iconButton: {
    padding: 12,
  },
  appBarTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '900',
  },
  container: {
    padding: 20,
    paddingBottom: 90,
  },
  protocoloCard: {
    backgroundColor: '#1E293B',
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#A855F7',
    marginBottom: 20,
  },
  protocoloHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  protocoloTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#C084FC',
    marginLeft: 8,
  },
  protocoloCenario: {
    fontSize: 13,
    color: '#E9D5FF',
    lineHeight: 19,
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#451A03',
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#78350F',
  },
  alertBoxText: {
    fontSize: 11,
    color: '#FDE047',
    marginLeft: 6,
    fontWeight: '800',
  },
  questionCard: {
    backgroundColor: '#1E293B',
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  questionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#C084FC',
    marginBottom: 8,
    textAlign: 'center',
  },
  questionText: {
    fontSize: 14,
    color: '#F8FAFC',
    textAlign: 'center',
    lineHeight: 20,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    minHeight: 54,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 10,
    justifyContent: 'center',
  },
  optionButtonSelected: {
    backgroundColor: '#581C87',
    borderColor: '#A855F7',
    borderWidth: 2,
  },
  optionText: {
    fontSize: 14,
    color: '#F8FAFC',
  },
  optionTextSelected: {
    color: '#E9D5FF',
    fontWeight: 'bold',
  },
  confirmButton: {
    height: 52,
    backgroundColor: '#A855F7',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
