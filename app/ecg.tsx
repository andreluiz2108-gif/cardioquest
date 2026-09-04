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
import { getGenieHint, saveSessionPerformance, recordQuestionError } from '../utils/adaptiveEngine';
import { checkAndUnlockNewAchievements, MedalhaData } from '../services/achievementService';
import PatientMonitorHeader from '../components/ui/PatientMonitorHeader';
import ClinicalFeedbackOverlay from '../components/ui/ClinicalFeedbackOverlay';
import NurseGenieAvatar from '../components/ui/NurseGenieAvatar';
import AchievementUnlockModal from '../components/ui/AchievementUnlockModal';

export default function ECGScreen() {
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

        // Checar conquistas desbloqueadas
        const conquistas = await checkAndUnlockNewAchievements();
        if (conquistas.length > 0) {
          setNovasConquistas(conquistas);
        }

        setOverlayConfig({
          visible: true,
          variant: 'success',
          titulo: 'Laudo ECG Confirmado com Sucesso!',
          mensagem: `Diagnóstico de ECG correto!\n• Achado: ${paciente.ecg.achadoPrincipal}\n\n${avaliacao.mensagemGenio}`,
          explicacaoMedica: paciente.ecg.explicacao,
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
        moduloId: 'ecg',
        moduloNome: 'Módulo 3: Eletrocardiograma (ECG)',
        perguntaIndex: 0,
        perguntaTitulo: 'Laudo Eletrocardiográfico',
        perguntaTexto: paciente.ecg.pergunta,
        alternativaEscolhidaTexto: paciente.ecg.opcoes[opcaoSelecionada],
        alternativaEscolhidaIndex: opcaoSelecionada,
        alternativaCorretaTexto: paciente.ecg.opcoes[paciente.ecg.correta],
        explicacaoMedica: paciente.ecg.explicacao,
      });

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
          <Text style={styles.confirmButtonText}>ASSINAR LAUDO DO ECG</Text>
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
  ecgCard: {
    backgroundColor: '#3B0764',
    padding: 18,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#10B981',
    borderBottomWidth: 4,
    borderBottomColor: '#047857',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  ecgHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ecgTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#34D399',
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ecgDesc: {
    fontSize: 13,
    color: '#F3E8FF',
    lineHeight: 20,
    fontWeight: '500',
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1B4B',
    padding: 10,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1.5,
    borderColor: '#38BDF8',
  },
  infoBadgeText: {
    fontSize: 12,
    color: '#E0E7FF',
    marginLeft: 6,
    fontWeight: '600',
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
    backgroundColor: '#064E3B',
    borderColor: '#10B981',
    borderBottomColor: '#047857',
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
    color: '#6EE7B7',
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
