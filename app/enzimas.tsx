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
    titulo: 'Passo 1: O Padrão-Ouro',
    texto: 'O Sr. Carlos está estabilizado. Qual é o biomarcador considerado o "padrão-ouro" atual (mais sensível e específico) para confirmar a necrose miocárdica?',
    opcoes: [
      'A) Mioglobina',
      'B) CK-MB',
      'C) Troponina',
      'D) Desidrogenase Lática (LDH)'
    ],
    correta: 2,
  },
  {
    titulo: 'Passo 2: O Tempo da Curva',
    texto: 'Você realizou a colheita de sangue para a Troponina. Sobre a curva enzimática deste marcador, quando costuma ocorrer a sua elevação inicial no sangue após o início da isquemia?',
    opcoes: [
      'A) Imediatamente (nos primeiros 15 minutos).',
      'B) Em poucas horas (geralmente entre 3h a 6h).',
      'C) Apenas após 24 horas completas do início da dor.',
      'D) Após 48 horas do evento isquêmico.'
    ],
    correta: 1,
  },
  {
    titulo: 'Passo 3: Risco de Reinfarto',
    texto: 'No 4º dia de internamento, o paciente volta a ter dor no peito. A Troponina dele ainda está alta devido ao primeiro infarto (demora até 14 dias a normalizar).\n\nQue outro marcador seria mais útil solicitar AGORA para detetar um possível novo infarto?',
    opcoes: [
      'A) Nova dosagem de Troponina.',
      'B) Peptídeo Natriurético B (BNP).',
      'C) D-Dímero.',
      'D) CK-MB (pois normaliza rapidamente em 48-72h).'
    ],
    correta: 3,
  }
];

export default function EnzimasScreen() {
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
          await AsyncStorage.setItem('venceu_mod5', 'true');

          showAlert('Mestre do Laboratório!', 'Excelente domínio da curva enzimática! Você sabe identificar a lesão inicial e monitorizar o risco de reinfarto.\n\nGanhou +150 XP!', () => {
            router.back();
          });
        } catch (e) {
          console.error(e);
        }
      }
    } else {
      showAlert('Atenção', 'Análise Incorreta. Reveja as diretrizes sobre os tempos de elevação e queda dos biomarcadores.');
    }
  };

  const pergunta = PERGUNTAS[perguntaAtual];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <ArrowLeft color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Módulo 5: Laboratório</Text>
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
    backgroundColor: '#EEF2FF', // indigo-50
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#C7D2FE', // indigo-200
    shadowColor: '#4F46E5', // indigo-500
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
    borderWidth: 2,
    borderColor: '#E0E7FF', // indigo-100
    marginBottom: 12,
    justifyContent: 'center',
    elevation: 1,
  },
  optionText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#312E81', // indigo-900
  },
});
