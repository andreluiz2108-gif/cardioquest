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
import { ArrowLeft, FlaskConical, TestTube } from 'lucide-react-native';
import { getPatientById } from '../data/patientsData';
import { getGenieHint, saveSessionPerformance, recordQuestionError } from '../utils/adaptiveEngine';
import { checkAndUnlockNewAchievements, MedalhaData } from '../services/achievementService';
import PatientMonitorHeader from '../components/ui/PatientMonitorHeader';
import ClinicalFeedbackOverlay from '../components/ui/ClinicalFeedbackOverlay';
import NurseGenieAvatar from '../components/ui/NurseGenieAvatar';
import AchievementUnlockModal from '../components/ui/AchievementUnlockModal';

export default function EnzimasScreen() {
  const params = useLocalSearchParams<{ patientId?: string }>();
  const patientId = params.patientId || 'carlos';
  const paciente = getPatientById(patientId);

  const [opcaoSelecionada, setOpcaoSelecionada] = useState<number | null>(null);
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

  const verificarResposta = async () => {
    if (opcaoSelecionada === null) {
      setOverlayConfig({
        visible: true,
        variant: 'warning',
        titulo: 'Análise Pendente',
        mensagem: 'Selecione uma interpretação clínica dos exames laboratoriais.',
        onConfirm: () => setOverlayConfig(prev => ({ ...prev, visible: false }))
      });
      return;
    }

    if (opcaoSelecionada === paciente.enzimas.correta) {
      try {
        const xpRaw = await AsyncStorage.getItem('xpEnfermeiro');
        const xpAtual = xpRaw ? parseInt(xpRaw, 10) : 0;
        await AsyncStorage.setItem('xpEnfermeiro', (xpAtual + 200).toString());
        
        await AsyncStorage.setItem(`venceu_mod5_paciente_${patientId}`, 'true');
        if (patientId === 'carlos') {
          await AsyncStorage.setItem('venceu_mod5', 'true');
        }

        const tempoTotalSegundos = Math.round((Date.now() - tempoInicio) / 1000);
        const avaliacao = await saveSessionPerformance({
          patientId,
          moduloId: 'enzimas',
          totalPerguntas: 1,
          acertos: 1,
          erros,
          tempoTotalSegundos,
          dicasSolicitadas,
          timestamp: new Date().toISOString()
        });

        // Checar conquistas desbloqueadas
        const conquistas = await checkAndUnlockNewAchievements();
        if (conquistas.length > 0) {
          setNovasConquistas(conquistas);
        }

        setOverlayConfig({
          visible: true,
          variant: 'success',
          titulo: 'Laudo de Biomarcadores Aprovado!',
          mensagem: `Excelente análise da curva enzimática de ${paciente.nome}!\n\n${avaliacao.mensagemGenio}`,
          explicacaoMedica: paciente.enzimas.explicacao,
          xpGanhos: 200,
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
    } else {
      setErros(erros + 1);

      // Registrar erro de alternativa
      await recordQuestionError({
        patientId,
        patientName: paciente.nome,
        moduloId: 'enzimas',
        moduloNome: 'Módulo 5: Biomarcadores & Curva de Troponina',
        perguntaIndex: 0,
        perguntaTitulo: 'Cinética e Laudo de Biomarcadores',
        perguntaTexto: paciente.enzimas.pergunta,
        alternativaEscolhidaTexto: paciente.enzimas.opcoes[opcaoSelecionada],
        alternativaEscolhidaIndex: opcaoSelecionada,
        alternativaCorretaTexto: paciente.enzimas.opcoes[paciente.enzimas.correta],
        explicacaoMedica: paciente.enzimas.explicacao,
      });

      setOverlayConfig({
        visible: true,
        variant: 'warning',
        titulo: 'Laudo Laboratorial Incorreto',
        mensagem: 'A interpretação selecionada desconsidera a cinética de biomarcadores ou o diagnóstico diferencial.',
        explicacaoMedica: paciente.enzimas.explicacao,
        onConfirm: () => setOverlayConfig(prev => ({ ...prev, visible: false }))
      });
    }
  };

  const dicaGenioAtual = getGenieHint(patientId, 4, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <ArrowLeft color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Módulo 5: Biomarcadores ({paciente.nome})</Text>
        <View style={{ width: 40 }} />
      </View>

      <PatientMonitorHeader
        nomePaciente={paciente.nome}
        sinaisVitais={paciente.anamnese.sinaisVitais}
        estadoAlarme={paciente.complexidade >= 4 ? 'critico' : 'atencao'}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.labCard}>
          <View style={styles.labHeaderRow}>
            <FlaskConical color="#818CF8" size={22} />
            <Text style={styles.labTitle}>Resultado dos Biomarcadores & Laboratório</Text>
          </View>
          <View style={styles.labItem}>
            <TestTube color="#818CF8" size={16} />
            <Text style={styles.labItemText}><Text style={{ fontWeight: 'bold', color: '#F8FAFC' }}>Troponina: </Text>{paciente.enzimas.curvaTroponina}</Text>
          </View>
          <View style={styles.labItem}>
            <TestTube color="#818CF8" size={16} />
            <Text style={styles.labItemText}><Text style={{ fontWeight: 'bold', color: '#F8FAFC' }}>CK-MB: </Text>{paciente.enzimas.ckmb}</Text>
          </View>
          <View style={styles.labItem}>
            <TestTube color="#818CF8" size={16} />
            <Text style={styles.labItemText}><Text style={{ fontWeight: 'bold', color: '#F8FAFC' }}>Outros Achados: </Text>{paciente.enzimas.outrosExames}</Text>
          </View>
        </View>

        <View style={styles.questionCard}>
          <Text style={styles.questionTitle}>Interpretação do Laboratório</Text>
          <Text style={styles.questionText}>{paciente.enzimas.pergunta}</Text>
        </View>

        <View style={styles.optionsContainer}>
          {paciente.enzimas.opcoes.map((opcao, index) => {
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
          <Text style={styles.confirmButtonText}>VALIDAR LAUDO LABORATORIAL</Text>
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

      {/* Modal de Conquista Desbloqueada */}
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
    borderBottomWidth: 1,
    borderBottomColor: '#581C87',
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  iconButton: {
    padding: 12,
  },
  appBarTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  container: {
    padding: 16,
    paddingBottom: 90,
  },
  labCard: {
    backgroundColor: '#3B0764',
    padding: 18,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#818CF8',
    borderBottomWidth: 4,
    borderBottomColor: '#4338CA',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  labHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  labTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#818CF8',
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  labItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#1E1B4B',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4338CA',
  },
  labItemText: {
    fontSize: 13,
    color: '#E0E7FF',
    marginLeft: 8,
    flex: 1,
    fontWeight: '500',
  },
  questionCard: {
    backgroundColor: '#3B0764',
    padding: 18,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#6D28D9',
    borderBottomWidth: 4,
    borderBottomColor: '#4C1D95',
    marginBottom: 16,
  },
  questionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#A78BFA',
    marginBottom: 8,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  questionText: {
    fontSize: 15,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: 'bold',
  },
  optionsContainer: {
    marginBottom: 20,
    gap: 10,
  },
  optionButton: {
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#3B0764',
    borderWidth: 2,
    borderColor: '#581C87',
    borderBottomWidth: 4,
    borderBottomColor: '#1E1B4B',
    justifyContent: 'center',
  },
  optionButtonSelected: {
    backgroundColor: '#312E81',
    borderColor: '#818CF8',
    borderBottomColor: '#1E1B4B',
    borderWidth: 2,
    borderBottomWidth: 4,
  },
  optionText: {
    fontSize: 14,
    color: '#E9D5FF',
    fontWeight: '700',
    lineHeight: 20,
  },
  optionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  confirmButton: {
    height: 56,
    backgroundColor: '#10B981',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#34D399',
    borderBottomWidth: 5,
    borderBottomColor: '#047857',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
