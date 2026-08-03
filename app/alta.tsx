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
import { ArrowLeft, HeartHandshake, CheckCircle2, ShieldCheck } from 'lucide-react-native';
import { getPatientById } from '../data/patientsData';
import { getGenieHint, saveSessionPerformance } from '../utils/adaptiveEngine';
import PatientMonitorHeader from '../components/ui/PatientMonitorHeader';
import ClinicalFeedbackOverlay from '../components/ui/ClinicalFeedbackOverlay';
import NurseGenieAvatar from '../components/ui/NurseGenieAvatar';

export default function AltaScreen() {
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
    textoBotao?: string;
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
        titulo: 'Orientação de Alta Pendente',
        mensagem: 'Selecione a conduta de alta recomendada para o caso.',
        onConfirm: () => setOverlayConfig(prev => ({ ...prev, visible: false }))
      });
      return;
    }

    if (opcaoSelecionada === paciente.alta.correta) {
      try {
        const xpRaw = await AsyncStorage.getItem('xpEnfermeiro');
        const xpAtual = xpRaw ? parseInt(xpRaw, 10) : 0;
        await AsyncStorage.setItem('xpEnfermeiro', (xpAtual + 300).toString());
        
        await AsyncStorage.setItem(`venceu_mod6_paciente_${patientId}`, 'true');

        const tempoTotalSegundos = Math.round((Date.now() - tempoInicio) / 1000);
        const avaliacao = await saveSessionPerformance({
          patientId,
          moduloId: 'alta',
          totalPerguntas: 1,
          acertos: 1,
          erros,
          tempoTotalSegundos,
          dicasSolicitadas,
          timestamp: new Date().toISOString()
        });

        setOverlayConfig({
          visible: true,
          variant: 'completion',
          titulo: 'Prontuário Concluído com Sucesso! 🏆',
          mensagem: `Parabéns! Você conduziu todas as 6 etapas de ${paciente.nome}!\n\n${avaliacao.mensagemGenio}`,
          explicacaoMedica: paciente.alta.explicacao,
          xpGanhos: 300,
          textoBotao: 'Ver Recomendações de Estudo do Gênio',
          onConfirm: () => {
            setOverlayConfig(prev => ({ ...prev, visible: false }));
            router.push('/dashboard');
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
        titulo: 'Orientação de Alta Incompleta',
        mensagem: 'A orientação selecionada omite diretrizes essenciais de prevenção secundária.',
        explicacaoMedica: paciente.alta.explicacao,
        onConfirm: () => setOverlayConfig(prev => ({ ...prev, visible: false }))
      });
    }
  };

  const dicaGenioAtual = getGenieHint(patientId, 5, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <ArrowLeft color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Módulo 6: Alta ({paciente.nome})</Text>
        <View style={{ width: 40 }} />
      </View>

      <PatientMonitorHeader
        nomePaciente={paciente.nome}
        sinaisVitais={paciente.anamnese.sinaisVitais}
        estadoAlarme="estavel"
      />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.altaCard}>
          <View style={styles.altaHeaderRow}>
            <HeartHandshake color="#2DD4BF" size={22} />
            <Text style={styles.altaTitle}>Plano de Alta & Prevenção Secundária</Text>
          </View>
          
          {paciente.alta.orientacoes.map((ori, index) => (
            <View key={index} style={styles.oriRow}>
              <CheckCircle2 color="#2DD4BF" size={16} style={{ marginTop: 2 }} />
              <Text style={styles.oriText}>{ori}</Text>
            </View>
          ))}
        </View>

        <View style={styles.prescricaoCard}>
          <View style={styles.prescricaoHeader}>
            <ShieldCheck color="#14B8A6" size={16} />
            <Text style={styles.prescricaoTitle}>Prescrição Medicamentosa de Alta</Text>
          </View>
          {paciente.alta.prescricaoSecundaria.map((med, idx) => (
            <Text key={idx} style={styles.medItem}>• {med}</Text>
          ))}
        </View>

        <View style={styles.questionCard}>
          <Text style={styles.questionTitle}>Desafio Final de Educação em Saúde</Text>
          <Text style={styles.questionText}>{paciente.alta.pergunta}</Text>
        </View>

        <View style={styles.optionsContainer}>
          {paciente.alta.opcoes.map((opcao, index) => {
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
          <Text style={styles.confirmButtonText}>Finalizar e Assinar Prontuário</Text>
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
        textoBotao={overlayConfig.textoBotao}
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
  altaCard: {
    backgroundColor: '#1E293B',
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#0D9488',
    marginBottom: 16,
  },
  altaHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  altaTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2DD4BF',
    marginLeft: 8,
  },
  oriRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  oriText: {
    fontSize: 13,
    color: '#CCFBF1',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  prescricaoCard: {
    backgroundColor: '#1E293B',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#14B8A6',
    marginBottom: 20,
  },
  prescricaoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  prescricaoTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2DD4BF',
    marginLeft: 6,
  },
  medItem: {
    fontSize: 12,
    color: '#99F6E4',
    marginLeft: 6,
    marginBottom: 2,
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
    color: '#2DD4BF',
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
    backgroundColor: '#115E59',
    borderColor: '#14B8A6',
    borderWidth: 2,
  },
  optionText: {
    fontSize: 14,
    color: '#F8FAFC',
  },
  optionTextSelected: {
    color: '#CCFBF1',
    fontWeight: 'bold',
  },
  confirmButton: {
    height: 52,
    backgroundColor: '#14B8A6',
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
