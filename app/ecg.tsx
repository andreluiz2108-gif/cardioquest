import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  Platform,
  Alert,
  Dimensions
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowLeft, TriangleAlert } from 'lucide-react-native';
import Svg, { Path, Line } from 'react-native-svg';

const PERGUNTAS = [
  {
    titulo: 'Treino: Leitura 1',
    texto: 'Antes de avaliar o Sr. Carlos, o preceptor pede para você identificar este traçado de um monitor de rotina:',
    opcoes: [
      'Ritmo Sinusal Normal',
      'Fibrilação Ventricular',
      'Assistolia'
    ],
    correta: 0,
    tipoTracado: 1,
    alerta: 'HR: 75',
    corAlerta: '#69F0AE', // greenAccent
  },
  {
    titulo: 'Treino: Leitura 2',
    texto: 'O alarme de emergência soou no leito ao lado! Identifique este ritmo caótico de parada cardiorrespiratória:',
    opcoes: [
      'Bradicardia Sinusal',
      'Fibrilação Ventricular',
      'Bloqueio Atrioventricular'
    ],
    correta: 1,
    tipoTracado: 2,
    alerta: 'HR: ---',
    corAlerta: '#FF5252', // redAccent
  },
  {
    titulo: 'ECG do Sr. Carlos',
    texto: 'Foco total no nosso paciente. Derivação V2. A dor torácica continua intensa. Qual é o diagnóstico exato?',
    opcoes: [
      'Ritmo Sinusal Normal',
      'Fibrilação Ventricular',
      'IAM com Supra de ST',
      'Taquicardia Ventricular'
    ],
    correta: 2,
    tipoTracado: 3,
    alerta: 'HR: 110',
    corAlerta: '#FF5252',
  }
];

export default function EcgScreen() {
  const [perguntaAtual, setPerguntaAtual] = useState(0);

  const showAlert = (title: string, message: string, onSuccess?: () => void) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${message}`);
      if (onSuccess) onSuccess();
    } else {
      Alert.alert(title, message, [{ text: 'Continuar', onPress: onSuccess }]);
    }
  };

  const verificarDiagnostico = async (indiceEscolhido: number) => {
    if (indiceEscolhido === PERGUNTAS[perguntaAtual].correta) {
      if (perguntaAtual < PERGUNTAS.length - 1) {
        setPerguntaAtual(perguntaAtual + 1);
      } else {
        try {
          const xpRaw = await AsyncStorage.getItem('xpEnfermeiro');
          const xpAtual = xpRaw ? parseInt(xpRaw, 10) : 0;
          await AsyncStorage.setItem('xpEnfermeiro', (xpAtual + 200).toString());
          await AsyncStorage.setItem('venceu_mod3', 'true');

          showAlert('Águia do ECG!', 'Você demonstrou excelente competência na leitura de monitores cardíacos e diagnosticou a isquemia aguda do paciente.\n\nGanhou +200 XP!', () => {
            router.back();
          });
        } catch (e) {
          console.error(e);
        }
      }
    } else {
      showAlert('Atenção', 'Diagnóstico Incorreto. Analise o formato das ondas e o segmento ST com atenção.');
    }
  };

  const pergunta = PERGUNTAS[perguntaAtual];

  // Configurações do SVG
  // Subtraindo 48 (padding horizontal 24*2) e 8 das bordas
  const screenWidth = Dimensions.get('window').width;
  const svgWidth = Platform.OS === 'web' ? Math.min(screenWidth - 48, 800) : screenWidth - 48; 
  const svgHeight = 200;
  const yBase = svgHeight * 0.6;
  const startX = svgWidth * 0.1;

  // Grid background
  const renderGrid = () => {
    const lines = [];
    for (let i = 0; i < svgWidth; i += 20) {
      lines.push(<Line key={`v-${i}`} x1={i} y1={0} x2={i} y2={svgHeight} stroke="rgba(76, 175, 80, 0.2)" strokeWidth={1} />);
    }
    for (let i = 0; i < svgHeight; i += 20) {
      lines.push(<Line key={`h-${i}`} x1={0} y1={i} x2={svgWidth} y2={i} stroke="rgba(76, 175, 80, 0.2)" strokeWidth={1} />);
    }
    return lines;
  };

  // Traçados ECG
  const getEcgPath = (tipo: number) => {
    switch(tipo) {
      case 1: // Normal
        return `M 0 ${yBase} L ${startX} ${yBase} Q ${startX + 10} ${yBase - 10}, ${startX + 20} ${yBase} L ${startX + 30} ${yBase} L ${startX + 35} ${yBase + 10} L ${startX + 45} ${yBase - 80} L ${startX + 55} ${yBase + 20} L ${startX + 60} ${yBase} Q ${startX + 80} ${yBase - 20}, ${startX + 100} ${yBase} L ${svgWidth} ${yBase}`;
      case 2: // FV
        return `M 0 ${yBase} Q 20 ${yBase - 40}, 40 ${yBase + 10} Q 60 ${yBase + 50}, 80 ${yBase - 20} Q 100 ${yBase - 60}, 120 ${yBase + 30} Q 140 ${yBase + 40}, 160 ${yBase - 10} Q 180 ${yBase - 50}, 200 ${yBase + 20} Q 220 ${yBase + 30}, 240 ${yBase - 30} Q 260 ${yBase - 20}, 280 ${yBase + 40} Q 300 ${yBase + 20}, 320 ${yBase - 40} L ${svgWidth} ${yBase}`;
      case 3: // Supra ST
        const stElevation = yBase - 35;
        return `M 0 ${yBase} L ${startX} ${yBase} Q ${startX + 10} ${yBase - 10}, ${startX + 20} ${yBase} L ${startX + 30} ${yBase} L ${startX + 35} ${yBase + 10} L ${startX + 45} ${yBase - 80} L ${startX + 55} ${yBase + 20} L ${startX + 65} ${stElevation} Q ${startX + 90} ${stElevation - 20}, ${startX + 110} ${yBase} L ${svgWidth} ${yBase}`;
      default:
        return `M 0 ${yBase} L ${svgWidth} ${yBase}`;
    }
  };

  const getEcgColor = (tipo: number) => {
    return tipo === 2 ? '#FF5252' : '#69F0AE';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <ArrowLeft color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Módulo 3: ECG</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.progressText}>
          Etapa {perguntaAtual + 1} de {PERGUNTAS.length}
        </Text>

        <Text style={styles.questionTitle}>{pergunta.titulo}</Text>
        <Text style={styles.questionText}>{pergunta.texto}</Text>

        <View style={styles.ecgMonitorContainer}>
          <Svg width={svgWidth} height={svgHeight}>
            {renderGrid()}
            <Path 
              d={getEcgPath(pergunta.tipoTracado)} 
              stroke={getEcgColor(pergunta.tipoTracado)} 
              strokeWidth={3} 
              fill="none" 
              strokeLinejoin="round" 
            />
          </Svg>
          <View style={styles.alertBox}>
            <TriangleAlert color={pergunta.corAlerta} size={16} />
            <Text style={[styles.alertText, { color: pergunta.corAlerta }]}>{pergunta.alerta}</Text>
          </View>
        </View>

        <View style={styles.optionsContainer}>
          {pergunta.opcoes.map((opcao, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              onPress={() => verificarDiagnostico(index)}
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
  questionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 8,
    textAlign: 'center',
  },
  questionText: {
    fontSize: 14,
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 24,
  },
  ecgMonitorContainer: {
    height: 200,
    width: '100%',
    backgroundColor: '#000000',
    borderRadius: 16,
    borderWidth: 4,
    borderColor: '#9CA3AF',
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 32,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
  },
  alertBox: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertText: {
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginLeft: 4,
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
    alignItems: 'center',
    elevation: 1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },
});
