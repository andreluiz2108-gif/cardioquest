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
import { ArrowLeft, HeartPulse, ShieldAlert } from 'lucide-react-native';
import { getPatientById } from '../data/patientsData';
import { getGenieHint, saveSessionPerformance } from '../utils/adaptiveEngine';
import PatientMonitorHeader from '../components/ui/PatientMonitorHeader';
import ClinicalFeedbackOverlay from '../components/ui/ClinicalFeedbackOverlay';
import NurseGenieAvatar from '../components/ui/NurseGenieAvatar';

export default function ECGScreen() {
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
        titulo: 'Laudo Pendente',
        mensagem: 'Por favor, selecione uma hipótese eletrocardiográfica antes de confirmar o laudo.',
        onConfirm: () => setOverlayConfig(prev => ({ ...prev, visible: false }))
      });
      return;
    }

    if (opcaoSelecionada === paciente.ecg.correta) {
      try {
        const xpRaw = await AsyncStorage.getItem('xpEnfermeiro');
        const xpAtual = xpRaw ? parseInt(xpRaw, 10) : 0;
        await AsyncStorage.setItem('xpEnfermeiro', (xpAtual + 200).toString());
        
        await AsyncStorage.setItem(`venceu_mod3_paciente_${patientId}`, 'true');
        if (patientId === 'carlos') {
          await AsyncStorage.setItem('venceu_mod3', 'true');
        }

        const tempoTotalSegundos = Math.round((Date.now() - tempoInicio) / 1000);
        const avaliacao = await saveSessionPerformance({
          patientId,
          moduloId: 'ecg',
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
          titulo: 'Laudo ECG Confirmado com Sucesso!',
          mensagem: `Diagnóstico de ECG correto!\n• Achado: ${paciente.ecg.achadoPrincipal}\n\n${avaliacao.mensagemGenio}`,
          explicacaoMedica: paciente.ecg.explicacao,
          xpGanhos: 200,
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
        titulo: 'Erro na Interpretação do ECG',
        mensagem: 'A opção escolhida não é compatível com o vetor elétrico de repolarização.',
        explicacaoMedica: paciente.ecg.explicacao,
        onConfirm: () => setOverlayConfig(prev => ({ ...prev, visible: false }))
      });
    }
  };

  const dicaGenioAtual = getGenieHint(patientId, 2, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <ArrowLeft color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Módulo 3: ECG ({paciente.nome})</Text>
        <View style={{ width: 40 }} />
      </View>

      <PatientMonitorHeader
        nomePaciente={paciente.nome}
        sinaisVitais={paciente.anamnese.sinaisVitais}
        estadoAlarme={paciente.complexidade >= 4 ? 'critico' : 'atencao'}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.ecgCard}>
          <View style={styles.ecgHeaderRow}>
            <HeartPulse color="#34D399" size={22} />
            <Text style={styles.ecgTitle}>Monitor & Traçado Eletrocardiográfico</Text>
          </View>
          <Text style={styles.ecgDesc}>
            {paciente.ecg.descricaoCompleta}
          </Text>

          <View style={styles.infoBadge}>
            <ShieldAlert color="#38BDF8" size={14} />
            <Text style={styles.infoBadgeText}>
              Parede Suspeita: <Text style={{ fontWeight: 'bold', color: '#F8FAFC' }}>{paciente.ecg.paredeAtingida}</Text>
            </Text>
          </View>
        </View>

        <View style={styles.questionCard}>
          <Text style={styles.questionTitle}>Desafio de Interpretação Eletrocardiográfica</Text>
          <Text style={styles.questionText}>{paciente.ecg.pergunta}</Text>
        </View>

        <View style={styles.optionsContainer}>
          {paciente.ecg.opcoes.map((opcao, index) => {
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
          <Text style={styles.confirmButtonText}>Assinar Laudo do ECG</Text>
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
  ecgCard: {
    backgroundColor: '#1E293B',
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#059669',
    marginBottom: 20,
  },
  ecgHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ecgTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#34D399',
    marginLeft: 8,
  },
  ecgDesc: {
    fontSize: 13,
    color: '#A7F3D0',
    lineHeight: 19,
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  infoBadgeText: {
    fontSize: 12,
    color: '#94A3B8',
    marginLeft: 6,
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
    color: '#34D399',
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
    backgroundColor: '#064E3B',
    borderColor: '#10B981',
    borderWidth: 2,
  },
  optionText: {
    fontSize: 14,
    color: '#F8FAFC',
  },
  optionTextSelected: {
    color: '#A7F3D0',
    fontWeight: 'bold',
  },
  confirmButton: {
    height: 52,
    backgroundColor: '#10B981',
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
