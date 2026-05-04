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
import { ArrowLeft, CheckCircle } from 'lucide-react-native';

const PERGUNTAS = [
  {
    titulo: 'Passo 1: Classificação',
    texto: 'Paciente relata dor no peito (nível 9/10) tipo aperto, que começou há 40 minutos. A dor sobe para o pescoço e desce pelo braço esquerdo. Pálido e a suar frio.\n\nQual a classificação de risco (Manchester)?',
    opcoes: ['Emergência (0 min) - Vermelho', 'Muito Urgente (10 min) - Laranja', 'Urgente (60 min) - Amarelo', 'Pouco Urgente (120 min) - Verde', 'Não Urgente (240 min) - Azul'],
    correta: 0,
    usarCores: true,
  },
  {
    titulo: 'Passo 2: Conduta Imediata',
    texto: 'Classificação Vermelha confirmada!\n\nQual deve ser a sua PRIMEIRA ação de enfermagem?',
    opcoes: [
      'Pedir ao paciente para aguardar sentado na receção.',
      'Encaminhar para a sala de emergência e solicitar ECG em até 10 minutos.',
      'Aferir apenas a temperatura e dar um analgésico simples.',
      'Preencher o registo de admissão completo antes de chamar o médico.'
    ],
    correta: 1,
    usarCores: false,
  },
  {
    titulo: 'Passo 3: Monitorização',
    texto: 'O paciente está na sala de emergência a aguardar o ECG.\n\nAlém do eletrocardiograma, qual a monitorização inicial prioritária?',
    opcoes: [
      'Apenas frequência cardíaca.',
      'Medição da glicemia capilar isolada.',
      'Monitorização contínua (Sinais Vitais, Oximetria e Acesso Venoso).',
      'Apenas a pressão arterial a cada 30 minutos.'
    ],
    correta: 2,
    usarCores: false,
  }
];

const CORES_MANCHESTER = ['#EF4444', '#F97316', '#F59E0B', '#22C55E', '#3B82F6'];

export default function TriagemScreen() {
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
        if (Platform.OS === 'web') {
          // Toast opcional na web, mas podemos so avancar
        } else {
          // Em react native poderiamos usar Toast, simulado por alert simple
        }
        setPerguntaAtual(perguntaAtual + 1);
      } else {
        // Acertou a ultima
        try {
          const xpRaw = await AsyncStorage.getItem('xpEnfermeiro');
          const xpAtual = xpRaw ? parseInt(xpRaw, 10) : 0;
          await AsyncStorage.setItem('xpEnfermeiro', (xpAtual + 150).toString());
          await AsyncStorage.setItem('venceu_mod1', 'true');

          showAlert('Triagem Concluída!', 'Excelente raciocínio clínico em todas as etapas! O paciente foi classificado e monitorizado corretamente a tempo.\n\nGanhou +150 XP!', () => {
            router.back();
          });
        } catch (e) {
          console.error(e);
        }
      }
    } else {
      showAlert('Atenção', 'Conduta incorreta. Reveja os protocolos de Síndrome Coronariana Aguda e tente novamente.');
    }
  };

  const pergunta = PERGUNTAS[perguntaAtual];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <ArrowLeft color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Módulo 1: Triagem</Text>
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
          {pergunta.opcoes.map((opcao, index) => {
            const bgColor = pergunta.usarCores ? CORES_MANCHESTER[index] : '#FFFFFF';
            const textColor = pergunta.usarCores ? '#FFFFFF' : '#1F2937';
            const borderColor = pergunta.usarCores ? 'transparent' : '#D1D5DB';

            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                onPress={() => verificarResposta(index)}
                style={[
                  styles.optionButton,
                  { backgroundColor: bgColor, borderColor: borderColor, justifyContent: pergunta.usarCores ? 'center' : 'flex-start' }
                ]}
              >
                <Text style={[
                  styles.optionText,
                  { color: textColor, textAlign: pergunta.usarCores ? 'center' : 'left', fontWeight: pergunta.usarCores ? 'bold' : 'normal' }
                ]}>
                  {opcao}
                </Text>
              </TouchableOpacity>
            );
          })}
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
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#DBEAFE', // blue-100
    shadowColor: '#3B82F6', // blue-500
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
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
    textAlign: 'center',
    color: '#1F2937',
    lineHeight: 24,
  },
  optionsContainer: {
    flex: 1,
  },
  optionButton: {
    minHeight: 60,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 15,
  },
});
