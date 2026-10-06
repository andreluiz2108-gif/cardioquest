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

export default function AnamneseScreen() {
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

  const PERGUNTAS = paciente.anamnese.perguntas;

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
          
          await AsyncStorage.setItem(`venceu_mod2_paciente_${patientId}`, 'true');
          if (patientId === 'carlos') {
            await AsyncStorage.setItem('venceu_mod2', 'true');
          }

          const tempoTotalSegundos = Math.round((Date.now() - tempoInicio) / 1000);
          const avaliacao = await saveSessionPerformance({
            patientId,
            moduloId: 'anamnese',
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
            titulo: 'Anamnese e Sinais Vitais Confirmados!',
            mensagem: `Histórico clínico de ${paciente.nome} coletado com sucesso!\n\n${avaliacao.mensagemGenio}`,
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
        moduloId: 'anamnese',
        moduloNome: 'Módulo 2: Anamnese Direcionada',
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
        titulo: 'Atenção ao Diagnóstico',
        mensagem: 'A opção escolhida ignora fatores de risco vitais ou a apresentação atípica do paciente.',
        explicacaoMedica: pergunta.explicacao,
        onConfirm: () => {
          setOverlayConfig(prev => ({ ...prev, visible: false }));
        }
      });
    }
  };

  const pergunta = PERGUNTAS[perguntaAtual];
  const dicaGenioAtual = getGenieHint(patientId, 1, perguntaAtual);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <ArrowLeft color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>MÓDULO 2: ANAMNESE ({paciente.nome.toUpperCase()})</Text>
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
          {pergunta.opcoes.map((opcao, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.85}
              onPress={() => verificarResposta(index)}
              style={styles.optionButton3D}
            >
              <Text style={styles.optionText}>{opcao}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#3B0764',
    borderWidth: 1.5,
    borderColor: '#6D28D9',
    borderBottomWidth: 4,
    borderBottomColor: '#1E1B4B',
    marginBottom: 12,
    justifyContent: 'center',
  },
  optionText: {
    fontSize: 14,
    color: '#F8FAFC',
    fontWeight: '500',
    lineHeight: 20,
  },
});
