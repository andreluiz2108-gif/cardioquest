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
import { getGenieHint, saveSessionPerformance, recordQuestionError } from '../utils/adaptiveEngine';
import { checkAndUnlockNewAchievements, MedalhaData } from '../services/achievementService';
import PatientMonitorHeader from '../components/ui/PatientMonitorHeader';
import ClinicalFeedbackOverlay from '../components/ui/ClinicalFeedbackOverlay';
import NurseGenieAvatar from '../components/ui/NurseGenieAvatar';
import AchievementUnlockModal from '../components/ui/AchievementUnlockModal';

export default function ProtocoloScreen() {
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

        // Checar conquistas desbloqueadas
        const conquistas = await checkAndUnlockNewAchievements();
        if (conquistas.length > 0) {
          setNovasConquistas(conquistas);
        }

        setOverlayConfig({
          visible: true,
          variant: 'success',
          titulo: 'Prescrição Farmacológica Aprovada!',
          mensagem: `Conduta imediata executada com perfeição para ${paciente.nome}.\n\n${avaliacao.mensagemGenio}`,
          explicacaoMedica: paciente.protocolo.explicacao,
          xpGanhos: 250,
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
        moduloId: 'protocolo',
        moduloNome: 'Módulo 4: Farmacologia & Reperfusão',
        perguntaIndex: 0,
        perguntaTitulo: paciente.protocolo.titulo,
        perguntaTexto: paciente.protocolo.pergunta,
        alternativaEscolhidaTexto: paciente.protocolo.opcoes[opcaoSelecionada],
        alternativaEscolhidaIndex: opcaoSelecionada,
        alternativaCorretaTexto: paciente.protocolo.opcoes[paciente.protocolo.correta],
        explicacaoMedica: paciente.protocolo.explicacao,
      });

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
          <Text style={styles.confirmButtonText}>PRESCREVER E ENVIAR AO PLANTÃO</Text>
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
  protocoloCard: {
    backgroundColor: '#3B0764',
    padding: 18,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#8B5CF6',
    borderBottomWidth: 4,
    borderBottomColor: '#6D28D9',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  protocoloHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  protocoloTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#C084FC',
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  protocoloCenario: {
    fontSize: 13,
    color: '#F3E8FF',
    lineHeight: 20,
    fontWeight: '500',
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#451A03',
    padding: 10,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1.5,
    borderColor: '#F59E0B',
  },
  alertBoxText: {
    fontSize: 11,
    color: '#FDE047',
    marginLeft: 6,
    fontWeight: '800',
    textTransform: 'uppercase',
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
    backgroundColor: '#4C1D95',
    borderColor: '#A855F7',
    borderBottomColor: '#3B0764',
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
    color: '#F3E8FF',
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
