import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  Platform,
  Alert
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowLeft } from 'lucide-react-native';

const PERGUNTAS = [
  {
    titulo: 'Passo 1: Caracterização da Dor',
    texto: 'Considerando o relato inicial do Sr. Carlos, qual característica da dor é o indicativo mais clássico de uma síndrome isquêmica miocárdica aguda?',
    opcoes: [
      'A) Dor em pontada que piora ao inspirar fundo.',
      'B) Dor precordial opressiva (em aperto) irradiada para o membro superior esquerdo.',
      'C) Dor em queimação na boca do estômago que melhora com alimentação.',
      'D) Dor lombar com irradiação para a face posterior das pernas.'
    ],
    correta: 1,
  },
  {
    titulo: 'Passo 2: Fatores de Risco',
    texto: 'A dor é típica de infarto. Durante a coleta rápida da história (Sinais e Sintomas), quais fatores de risco são cruciais investigar para o Sr. Carlos agora?',
    opcoes: [
      'A) Histórico de asma crônica e alergias alimentares.',
      'B) Frequência de viagens recentes ou contato com doenças infecciosas.',
      'C) Hipertensão, Diabetes, Tabagismo prévio e histórico familiar de cardiopatia.',
      'D) Prática de desportos radicais ou lesões ortopédicas recentes.'
    ],
    correta: 2,
  },
  {
    titulo: 'Passo 3: Alergias (Segurança)',
    texto: 'Você está prestes a avançar para os exames e a medicação.\n\nQual informação da anamnese é absolutamente VITAL confirmar agora para evitar um evento adverso grave nos próximos minutos?',
    opcoes: [
      'A) O tipo sanguíneo e fator Rh do paciente.',
      'B) A última vez que o paciente urinou.',
      'C) O estado de vacinação anual contra a gripe.',
      'D) Histórico de alergias a medicamentos (especialmente AAS ou Iodo).'
    ],
    correta: 3,
  }
];

export default function AnamneseScreen() {
  const [perguntaAtual, setPerguntaAtual] = useState(0);

  const showAlert = (title: string, message: string, onSuccess?: () => void) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${message}`);
      if (onSuccess) onSuccess();
    } else {
      Alert.alert(title, message, [{ text: 'Continuar', onPress: onSuccess }]);
    }
  };

  const verificarResposta = async (indiceEscolhido: number) => {
    if (indiceEscolhido === PERGUNTAS[perguntaAtual].correta) {
      if (perguntaAtual < PERGUNTAS.length - 1) {
        setPerguntaAtual(perguntaAtual + 1);
      } else {
        try {
          const xpRaw = await AsyncStorage.getItem('xpEnfermeiro');
          const xpAtual = xpRaw ? parseInt(xpRaw, 10) : 0;
          await AsyncStorage.setItem('xpEnfermeiro', (xpAtual + 150).toString());
          await AsyncStorage.setItem('venceu_mod2', 'true');

          showAlert('Anamnese Impecável!', 'Você coletou os dados vitais, confirmou os fatores de risco e garantiu a segurança medicamentosa do paciente.\n\nVocê ganhou +150 XP!', () => {
            router.back();
          });
        } catch (e) {
          console.error(e);
        }
      }
    } else {
      showAlert('Atenção!', 'Reveja os dados clínicos e as prioridades do atendimento de emergência.');
    }
  };

  const pergunta = PERGUNTAS[perguntaAtual];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <ArrowLeft color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Módulo 2: Anamnese</Text>
        <View style={{ width: 40 }} />
      </View>

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
              activeOpacity={0.8}
              onPress={() => verificarResposta(index)}
              style={styles.optionButton}
            >
              <Text style={styles.optionText}>{opcao}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  appBar: {
    height: 56,
    backgroundColor: '#1E3A8A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  iconButton: {
    padding: 16,
  },
  appBarTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  container: {
    padding: 24,
  },
  progressText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#9CA3AF',
    marginBottom: 8,
  },
  questionCard: {
    backgroundColor: '#EFF6FF', // blue-50
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#BFDBFE', // blue-200
    shadowColor: '#3B82F6', // blue-500
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 32,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 16,
    textAlign: 'center',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    lineHeight: 24,
  },
  optionsContainer: {
    flex: 1,
  },
  optionButton: {
    minHeight: 60,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginBottom: 12,
    justifyContent: 'center',
    elevation: 2,
  },
  optionText: {
    fontSize: 15,
    color: '#1F2937',
  },
});
