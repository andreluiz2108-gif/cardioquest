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
import { getGenieHint, saveSessionPerformance, recordQuestionError } from '../utils/adaptiveEngine';
import { checkAndUnlockNewAchievements, MedalhaData } from '../services/achievementService';
import PatientMonitorHeader from '../components/ui/PatientMonitorHeader';
import ClinicalFeedbackOverlay from '../components/ui/ClinicalFeedbackOverlay';
import NurseGenieAvatar from '../components/ui/NurseGenieAvatar';
import AchievementUnlockModal from '../components/ui/AchievementUnlockModal';

export default function AltaScreen() {
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

        // Checar conquistas desbloqueadas
        const conquistas = await checkAndUnlockNewAchievements();
        if (conquistas.length > 0) {
          setNovasConquistas(conquistas);
        }

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
            if (conquistas.length > 0) {
              setShowAchievementModal(true);
            } else {
              router.push('/dashboard');
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
        moduloId: 'alta',
        moduloNome: 'Módulo 6: Alta & Prevenção Secundária',
        perguntaIndex: 0,
        perguntaTitulo: 'Educação em Saúde e Alta',
        perguntaTexto: paciente.alta.pergunta,
        alternativaEscolhidaTexto: paciente.alta.opcoes[opcaoSelecionada],
        alternativaEscolhidaIndex: opcaoSelecionada,
        alternativaCorretaTexto: paciente.alta.opcoes[paciente.alta.correta],
        explicacaoMedica: paciente.alta.explicacao,
      });

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
          <Text style={styles.confirmButtonText}>FINALIZAR E ASSINAR PRONTUÁRIO</Text>
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

      {/* Modal de Conquista Desbloqueada */}
      <AchievementUnlockModal
        visible={showAchievementModal}
        conquistas={novasConquistas}
        onClose={() => {
          setShowAchievementModal(false);
          router.push('/dashboard');
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
  altaCard: {
    backgroundColor: '#3B0764',
    padding: 18,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#2DD4BF',
    borderBottomWidth: 4,
    borderBottomColor: '#0F766E',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  altaHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  altaTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#2DD4BF',
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
    fontWeight: '500',
  },
  prescricaoCard: {
    backgroundColor: '#1E1B4B',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#0D9488',
    marginBottom: 16,
  },
  prescricaoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  prescricaoTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#2DD4BF',
    marginLeft: 6,
    textTransform: 'uppercase',
  },
  medItem: {
    fontSize: 12,
    color: '#99F6E4',
    marginLeft: 6,
    marginBottom: 4,
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
    backgroundColor: '#042F2E',
    borderColor: '#2DD4BF',
    borderBottomColor: '#0F766E',
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
    color: '#5EEAD4',
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
