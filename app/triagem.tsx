import React, { useState, useEffect } from 'react';
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
import { ArrowLeft } from 'lucide-react-native';
import { getPatientById } from '../data/patientsData';
import { getGenieHint, saveSessionPerformance } from '../utils/adaptiveEngine';
import PatientMonitorHeader from '../components/ui/PatientMonitorHeader';
import ClinicalFeedbackOverlay from '../components/ui/ClinicalFeedbackOverlay';
import NurseGenieAvatar from '../components/ui/NurseGenieAvatar';

const CORES_MANCHESTER = ['#EF4444', '#F97316', '#F59E0B', '#22C55E', '#3B82F6'];

export default function TriagemScreen() {
  const params = useLocalSearchParams<{ patientId?: string }>();
  const patientId = params.patientId || 'carlos';
  const paciente = getPatientById(patientId);

  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [acertos, setAcertos] = useState(0);
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

  const PERGUNTAS = [
    {
      titulo: `Passo 1: Triagem do Paciente ${paciente.nome}`,
      texto: `Paciente ${paciente.nome} (${paciente.idade}a): ${paciente.triagem.pergunta}`,
      opcoes: paciente.triagem.opcoes,
      correta: paciente.triagem.correta,
      usarCores: true,
      explicacao: paciente.triagem.explicacao
    },
    {
      titulo: 'Passo 2: Conduta Imediata de Enfermagem',
      texto: `Triagem confirmada como prioritária (${paciente.triagem.classificacaoEsperada})!\n\nQual deve ser a sua PRIMEIRA ação de atendimento imediato?`,
      opcoes: [
        'Pedir ao paciente para aguardar sentado na recepção geral.',
        'Encaminhar à Sala Vermelha/Emergência e solicitar ECG em até 10 minutos (Porta-ECG).',
        'Aferir apenas a temperatura e oferecer analgésico comum.',
        'Preencher o registro cadastral completo antes de chamar o médico.'
      ],
      correta: 1,
      usarCores: false,
      explicacao: 'ECG em até 10 minutos (Porta-ECG) com transferência imediata para sala de emergência equipada é a meta recomendada pelas diretrizes.'
    },
    {
      titulo: 'Passo 3: Monitorização Inicial Integrada',
      texto: 'O paciente encontra-se na sala de emergência sob cuidados iniciais.\n\nAlém do eletrocardiograma, qual a monitorização imediata obrigatória?',
      opcoes: [
        'Apenas frequência cardíaca.',
        'Medição de glicemia capilar isolada.',
        'Monitorização contínua de Sinais Vitais, Oximetria de pulso e Acesso Venoso Calibroso.',
        'Apenas pressão arterial a cada 60 minutos.'
      ],
      correta: 2,
      usarCores: false,
      explicacao: 'A monitorização multiparamétrica contínua garante detecção imediata de arritmias letais ou descompensação hemodinâmica.'
    }
  ];

  const verificarResposta = async (indiceEscolhido: number) => {
    const pergunta = PERGUNTAS[perguntaAtual];
    const acertou = indiceEscolhido === pergunta.correta;

    if (acertou) {
      const novosAcertos = acertos + 1;
      setAcertos(novosAcertos);

      if (perguntaAtual < PERGUNTAS.length - 1) {
        setPerguntaAtual(perguntaAtual + 1);
      } else {
        try {
          const xpRaw = await AsyncStorage.getItem('xpEnfermeiro');
          const xpAtual = xpRaw ? parseInt(xpRaw, 10) : 0;
          await AsyncStorage.setItem('xpEnfermeiro', (xpAtual + 150).toString());
          
          await AsyncStorage.setItem(`venceu_mod1_paciente_${patientId}`, 'true');
          if (patientId === 'carlos') {
            await AsyncStorage.setItem('venceu_mod1', 'true');
          }

          // Avaliação pelo Motor Adaptativo
          const tempoTotalSegundos = Math.round((Date.now() - tempoInicio) / 1000);
          const avaliacao = await saveSessionPerformance({
            patientId,
            moduloId: 'triagem',
            totalPerguntas: PERGUNTAS.length,
            acertos: novosAcertos,
            erros,
            tempoTotalSegundos,
            dicasSolicitadas,
            timestamp: new Date().toISOString()
          });

          setOverlayConfig({
            visible: true,
            variant: 'success',
            titulo: 'Triagem Impecável Concluída!',
            mensagem: `Excelente raciocínio clínico! O(a) paciente ${paciente.nome} foi triado(a) corretamente.\n\n${avaliacao.mensagemGenio}`,
            explicacaoMedica: pergunta.explicacao,
            xpGanhos: 150,
            onConfirm: () => {
              setOverlayConfig(prev => ({ ...prev, visible: false }));
              router.back();
            }
          });
        } catch (e) {
          console.error(e);
        }
      }
    } else {
      setErros(erros + 1);
      setOverlayConfig({
        visible: true,
        variant: 'warning',
        titulo: 'Alerta de Protocolo Clínico',
        mensagem: 'A conduta selecionada não respeita o protocolo de prioridade de emergência.',
        explicacaoMedica: pergunta.explicacao,
        onConfirm: () => {
          setOverlayConfig(prev => ({ ...prev, visible: false }));
        }
      });
    }
  };

  const pergunta = PERGUNTAS[perguntaAtual];
  const dicaGenioAtual = getGenieHint(patientId, 0, perguntaAtual);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <ArrowLeft color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Módulo 1: Triagem ({paciente.nome})</Text>
        <View style={{ width: 40 }} />
      </View>

      <PatientMonitorHeader
        nomePaciente={paciente.nome}
        sinaisVitais={paciente.anamnese.sinaisVitais}
        estadoAlarme={paciente.complexidade >= 4 ? 'critico' : 'atencao'}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.progressText}>
          Etapa {perguntaAtual + 1} de {PERGUNTAS.length}
        </Text>

        <View style={styles.questionCard}>
          <Text style={styles.questionTitle}>{pergunta.titulo}</Text>
          <Text style={styles.questionText}>{pergunta.texto}</Text>
        </View>

        <View style={styles.optionsContainer}>
          {pergunta.opcoes.map((opcao, index) => {
            const bgColor = pergunta.usarCores ? CORES_MANCHESTER[index] : '#FFFFFF';
            const textColor = pergunta.usarCores ? '#FFFFFF' : '#1F2937';
            const borderColor = pergunta.usarCores ? 'transparent' : '#CBD5E1';

            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.85}
                onPress={() => verificarResposta(index)}
                style={[
                  styles.optionButton,
                  { backgroundColor: bgColor, borderColor: borderColor, justifyContent: pergunta.usarCores ? 'center' : 'flex-start' }
                ]}
              >
                <Text style={[
                  styles.optionText,
                  { color: textColor, textAlign: pergunta.usarCores ? 'center' : 'left', fontWeight: pergunta.usarCores ? 'bold' : '500' }
                ]}>
                  {opcao}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Companion Gênio Enfermeiro da Lâmpada no Canto Inferior Direito */}
      <NurseGenieAvatar
        dicaTexto={dicaGenioAtual}
        onDicaSolicitada={() => setDicasSolicitadas(dicasSolicitadas + 1)}
      />

      {/* Overlay de Feedback UI+ */}
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
    paddingBottom: 90, // Espaço para não cobrir pelo Gênio
  },
  progressText: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: 'bold',
    color: '#94A3B8',
    marginBottom: 12,
  },
  questionCard: {
    backgroundColor: '#1E293B',
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 20,
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#38BDF8',
    marginBottom: 12,
    textAlign: 'center',
  },
  questionText: {
    fontSize: 14,
    color: '#F1F5F9',
    textAlign: 'center',
    lineHeight: 22,
  },
  optionsContainer: {
    flex: 1,
  },
  optionButton: {
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 14,
  },
});
