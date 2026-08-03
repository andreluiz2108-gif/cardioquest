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
import { getGenieHint, saveSessionPerformance } from '../utils/adaptiveEngine';
import PatientMonitorHeader from '../components/ui/PatientMonitorHeader';
import ClinicalFeedbackOverlay from '../components/ui/ClinicalFeedbackOverlay';
import NurseGenieAvatar from '../components/ui/NurseGenieAvatar';

export default function EnzimasScreen() {
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

        setOverlayConfig({
          visible: true,
          variant: 'success',
          titulo: 'Laudo de Biomarcadores Aprovado!',
          mensagem: `Excelente análise da curva enzimática de ${paciente.nome}!\n\n${avaliacao.mensagemGenio}`,
          explicacaoMedica: paciente.enzimas.explicacao,
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
          <Text style={styles.confirmButtonText}>Validar Laudo Laboratorial</Text>
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
  labCard: {
    backgroundColor: '#1E293B',
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#6366F1',
    marginBottom: 20,
  },
  labHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  labTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#818CF8',
    marginLeft: 8,
  },
  labItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  labItemText: {
    fontSize: 13,
    color: '#C7D2FE',
    marginLeft: 8,
    flex: 1,
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
    color: '#818CF8',
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
    backgroundColor: '#312E81',
    borderColor: '#6366F1',
    borderWidth: 2,
  },
  optionText: {
    fontSize: 14,
    color: '#F8FAFC',
  },
  optionTextSelected: {
    color: '#C7D2FE',
    fontWeight: 'bold',
  },
  confirmButton: {
    height: 52,
    backgroundColor: '#4F46E5',
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
