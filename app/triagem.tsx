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
import { ArrowLeft } from 'lucide-react-native';
import { getPatientById } from '../data/patientsData';
import { getGenieHint, saveSessionPerformance, recordQuestionError } from '../utils/adaptiveEngine';
import { checkAndUnlockNewAchievements, MedalhaData } from '../services/achievementService';
import PatientMonitorHeader from '../components/ui/PatientMonitorHeader';
import ClinicalFeedbackOverlay from '../components/ui/ClinicalFeedbackOverlay';
import NurseGenieAvatar from '../components/ui/NurseGenieAvatar';
import AchievementUnlockModal from '../components/ui/AchievementUnlockModal';

function getManchesterStyle(opcaoTexto: string, usarCores: boolean) {
  if (!usarCores) {
    return {
      bgColor: '#3B0764',
      borderColor: '#6D28D9',
      borderBottomColor: '#1E1B4B',
      textColor: '#F8FAFC',
      tag: null as string | null,
      tagBg: '#581C87',
      tagColor: '#DDD6FE'
    };
  }

  const lower = opcaoTexto.toLowerCase();

  if (lower.includes('vermelho')) {
    return {
      bgColor: '#DC2626',
      borderColor: '#EF4444',
      borderBottomColor: '#991B1B',
      textColor: '#FFFFFF',
      tag: 'EMERGÊNCIA (Atendimento Imediato • 0 min)',
      tagBg: '#7F1D1D',
      tagColor: '#FECACA'
    };
  }
  if (lower.includes('laranja')) {
    return {
      bgColor: '#EA580C',
      borderColor: '#F97316',
      borderBottomColor: '#9A3412',
      textColor: '#FFFFFF',
      tag: 'MUITO URGENTE (Atendimento em até 10 min)',
      tagBg: '#7C2D12',
      tagColor: '#FFEDD5'
    };
  }
  if (lower.includes('amarelo')) {
    return {
      bgColor: '#D97706',
      borderColor: '#F59E0B',
      borderBottomColor: '#92400E',
      textColor: '#FFFFFF',
      tag: 'URGENTE (Atendimento em até 60 min)',
      tagBg: '#78350F',
      tagColor: '#FEF3C7'
    };
  }
  if (lower.includes('verde')) {
    return {
      bgColor: '#16A34A',
      borderColor: '#22C55E',
      borderBottomColor: '#14532D',
      textColor: '#FFFFFF',
      tag: 'POUCO URGENTE (Atendimento em até 120 min)',
      tagBg: '#14532D',
      tagColor: '#DCFCE7'
    };
  }
  if (lower.includes('azul')) {
    return {
      bgColor: '#2563EB',
      borderColor: '#3B82F6',
      borderBottomColor: '#1E40AF',
      textColor: '#FFFFFF',
      tag: 'NÃO URGENTE (Atendimento em até 240 min)',
      tagBg: '#1E3A8A',
      tagColor: '#DBEAFE'
    };
  }

  return {
    bgColor: '#3B0764',
    borderColor: '#6D28D9',
    borderBottomColor: '#1E1B4B',
    textColor: '#F8FAFC',
    tag: null as string | null,
    tagBg: '#581C87',
    tagColor: '#DDD6FE'
  };
}

export default function TriagemScreen() {
  const params = useLocalSearchParams<{ patientId?: string }>();
  const patientId = params.patientId || 'carlos';
  const paciente = getPatientById(patientId);

  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);
  const [dicasSolicitadas, setDicasSolicitadas] = useState(0);
  const [tempoInicio] = useState<number>(Date.now());

  const [novasConquistas, setNovasConquistas] = useState<MedalhaData[]>([]);
  const [showAchievementModal, setShowAchievementModal] = useState(false);

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

          const conquistas = await checkAndUnlockNewAchievements();
          if (conquistas.length > 0) {
            setNovasConquistas(conquistas);
          }

          setOverlayConfig({
            visible: true,
            variant: 'success',
            titulo: 'Triagem Impecável Concluída!',
            mensagem: `Excelente raciocínio clínico! O(a) paciente ${paciente.nome} foi triado(a) corretamente.\n\n${avaliacao.mensagemGenio}`,
            explicacaoMedica: pergunta.explicacao,
            xpGanhos: 150,
            onConfirm: () => {
              setOverlayConfig(prev => ({ ...prev, visible: false }));
              if (conquistas.length > 0) {
                setShowAchievementModal(true);
              } else {
                router.back();
              }
            }
          });
        } catch (e) {
          console.error(e);
        }
      }
    } else {
      setErros(erros + 1);

      await recordQuestionError({
        patientId,
        patientName: paciente.nome,
        moduloId: 'triagem',
        moduloNome: 'Módulo 1: Triagem Manchester',
        perguntaIndex: perguntaAtual,
        perguntaTitulo: pergunta.titulo,
        perguntaTexto: pergunta.texto,
        alternativaEscolhidaTexto: pergunta.opcoes[indiceEscolhido],
        alternativaEscolhidaIndex: indiceEscolhido,
        alternativaCorretaTexto: pergunta.opcoes[pergunta.correta],
        explicacaoMedica: pergunta.explicacao,
      });

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
        <Text style={styles.appBarTitle}>MÓDULO 1: TRIAGEM ({paciente.nome.toUpperCase()})</Text>
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
            const mStyle = getManchesterStyle(opcao, pergunta.usarCores);

            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.85}
                onPress={() => verificarResposta(index)}
                style={[
                  styles.optionButton3D,
                  { 
                    backgroundColor: mStyle.bgColor, 
                    borderColor: mStyle.borderColor,
                    borderBottomColor: mStyle.borderBottomColor,
                  }
                ]}
              >
                <Text style={[
                  styles.optionText,
                  { 
                    color: mStyle.textColor, 
                    fontWeight: pergunta.usarCores ? 'bold' : '600' 
                  }
                ]}>
                  {opcao}
                </Text>

                {mStyle.tag ? (
                  <View style={[styles.manchesterTag, { backgroundColor: mStyle.tagBg }]}>
                    <Text style={[styles.manchesterTagText, { color: mStyle.tagColor }]}>
                      {mStyle.tag}
                    </Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Companion Gênio Enfermeiro */}
      <NurseGenieAvatar
        dicaTexto={dicaGenioAtual}
        onDicaSolicitada={() => setDicasSolicitadas(dicasSolicitadas + 1)}
      />

      {/* Feedback Overlay */}
      <ClinicalFeedbackOverlay
        visible={overlayConfig.visible}
        variant={overlayConfig.variant}
        titulo={overlayConfig.titulo}
        mensagem={overlayConfig.mensagem}
        explicacaoMedica={overlayConfig.explicacaoMedica}
        xpGanhos={overlayConfig.xpGanhos}
        onConfirm={overlayConfig.onConfirm}
      />

      {/* Modal de Conquista */}
      <AchievementUnlockModal
        visible={showAchievementModal}
        conquistas={novasConquistas}
        onClose={() => {
          setShowAchievementModal(false);
          router.back();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#2E1065',
  },
  appBar: {
    height: 56,
    backgroundColor: '#3B0764',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: '#581C87',
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  iconButton: {
    padding: 12,
  },
  appBarTitle: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  container: {
    padding: 20,
    paddingBottom: 90,
  },
  progressText: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '900',
    color: '#C4B5FD',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  questionCard: {
    backgroundColor: '#3B0764',
    padding: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#6D28D9',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#38BDF8',
    marginBottom: 10,
    textAlign: 'center',
  },
  questionText: {
    fontSize: 14,
    color: '#F8FAFC',
    textAlign: 'center',
    lineHeight: 22,
  },
  optionsContainer: {
    flex: 1,
  },
  optionButton3D: {
    minHeight: 58,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderBottomWidth: 4,
    marginBottom: 12,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  optionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  manchesterTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 6,
  },
  manchesterTagText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
