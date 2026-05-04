import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  Platform,
  Alert
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowLeft, HeartHandshake, Ban, CheckCircle2 } from 'lucide-react-native';

const HABITOS = [
  { texto: "Caminhada leve (30 min/dia) após liberação médica", bom: true },
  { texto: "Substituir o cigarro tradicional por Vape (Cigarro Eletrônico)", bom: false },
  { texto: "Dieta rica em embutidos para repor energia", bom: false },
  { texto: "Uso rigoroso e contínuo das medicações prescritas", bom: true },
];

export default function AltaScreen() {
  const [indiceAtual, setIndiceAtual] = useState(0);

  const showAlert = (title: string, message: string, onSuccess?: () => void) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${message}`);
      if (onSuccess) onSuccess();
    } else {
      Alert.alert(title, message, [{ text: 'Continuar', onPress: onSuccess }]);
    }
  };

  const julgarHabito = async (recomendou: boolean) => {
    const habitoRealmenteBom = HABITOS[indiceAtual].bom;

    if (recomendou === habitoRealmenteBom) {
      if (indiceAtual < HABITOS.length - 1) {
        setIndiceAtual(indiceAtual + 1);
      } else {
        try {
          const xpRaw = await AsyncStorage.getItem('xpEnfermeiro');
          const xpAtual = xpRaw ? parseInt(xpRaw, 10) : 0;
          await AsyncStorage.setItem('xpEnfermeiro', (xpAtual + 200).toString());
          
          showAlert('Alta Segura!', 'Parabéns! Você orientou o Sr. Carlos perfeitamente. A educação em saúde é fundamental para evitar um reinfarto. O paciente recebeu alta com segurança!\n\nVocê ganhou +200 XP!', () => {
            router.back();
          });
        } catch (e) {
          console.error(e);
        }
      }
    } else {
      showAlert('Atenção', 'Orientação perigosa! Revise as diretrizes de prevenção secundária e tente novamente.', () => {
        setIndiceAtual(0);
      });
    }
  };

  const habito = HABITOS[indiceAtual];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <ArrowLeft color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Módulo 6: Alta Médica</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.container}>
        <View style={styles.headerRow}>
          <HeartHandshake color="#14B8A6" size={30} />
          <Text style={styles.headerText}>Educação em Saúde</Text>
        </View>

        <Text style={styles.instructionText}>
          O paciente está de alta. Avalie o hábito abaixo e decida se deve orientá-lo a EVITAR ou RECOMENDAR:
        </Text>

        <View style={styles.card}>
          <Text style={styles.progressText}>
            Hábito {indiceAtual + 1} de {HABITOS.length}
          </Text>
          <Text style={styles.habitoText}>{habito.texto}</Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#DC2626' }]}
            activeOpacity={0.8}
            onPress={() => julgarHabito(false)}
          >
            <Ban color="#FFFFFF" size={24} />
            <Text style={styles.actionButtonText}>EVITAR</Text>
          </TouchableOpacity>
          <View style={{ width: 16 }} />
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#0D9488' }]}
            activeOpacity={0.8}
            onPress={() => julgarHabito(true)}
          >
            <CheckCircle2 color="#FFFFFF" size={24} />
            <Text style={styles.actionButtonText}>RECOMENDAR</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    flex: 1,
    padding: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginLeft: 10,
  },
  instructionText: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 32,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#99F6E4', // teal-200
    shadowColor: '#14B8A6', // teal-500
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
    marginBottom: 40,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9CA3AF',
    marginBottom: 16,
  },
  habitoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3A8A',
    textAlign: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    height: 60,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8,
  },
});
