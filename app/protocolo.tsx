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
import { ArrowLeft, Pill, Bandage } from 'lucide-react-native';

const MEDICAMENTOS = [
  "Aspirina (AAS)",
  "Adrenalina",
  "Oxigênio",
  "Furosemida",
  "Morfina",
  "Dipirona",
  "Nitrato",
  "Amoxicilina"
];

const GABARITO_MONA = [
  "Morfina",
  "Oxigênio",
  "Nitrato",
  "Aspirina (AAS)"
];

export default function ProtocoloScreen() {
  const [selecionados, setSelecionados] = useState<string[]>([]);

  const showAlert = (title: string, message: string, onSuccess?: () => void) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${message}`);
      if (onSuccess) onSuccess();
    } else {
      Alert.alert(title, message, [{ text: 'Continuar', onPress: onSuccess }]);
    }
  };

  const alternarMedicamento = (remedio: string) => {
    if (selecionados.includes(remedio)) {
      setSelecionados(prev => prev.filter(r => r !== remedio));
    } else {
      if (selecionados.length < 4) {
        setSelecionados(prev => [...prev, remedio]);
      } else {
        if (Platform.OS === 'web') {
          // Toast opcional na web
        } else {
          // Toast em mobile
        }
      }
    }
  };

  const confirmarProtocolo = async () => {
    const acertouTudo = selecionados.length === 4 && selecionados.every(remedio => GABARITO_MONA.includes(remedio));

    if (acertouTudo) {
      try {
        const xpRaw = await AsyncStorage.getItem('xpEnfermeiro');
        const xpAtual = xpRaw ? parseInt(xpRaw, 10) : 0;
        await AsyncStorage.setItem('xpEnfermeiro', (xpAtual + 250).toString());
        await AsyncStorage.setItem('venceu_mod4', 'true');

        showAlert('Protocolo MONA!', 'Excelente atuação! Você administrou a medicação correta (Morfina, Oxigênio, Nitrato e AAS). A dor do paciente diminuiu e a isquemia está sendo combatida.\n\nVocê ganhou +250 XP!', () => {
          router.back();
        });
      } catch (e) {
        console.error(e);
      }
    } else {
      showAlert('Atenção', 'Conduta perigosa! Revise as medicações do protocolo inicial de Síndrome Coronariana Aguda.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <ArrowLeft color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Módulo 4: Medicação</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Pill color="#A855F7" size={30} />
          <Text style={styles.headerText}>Prescrição de Emergência</Text>
        </View>

        <Text style={styles.instructionText}>
          Selecione EXATAMENTE as 4 intervenções do protocolo inicial para o infarto (MONA):
        </Text>

        <View style={styles.gridContainer}>
          {MEDICAMENTOS.map((remedio, index) => {
            const isSelecionado = selecionados.includes(remedio);
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                onPress={() => alternarMedicamento(remedio)}
                style={[
                  styles.medButton,
                  {
                    backgroundColor: isSelecionado ? '#F3E8FF' : '#FFFFFF',
                    borderColor: isSelecionado ? '#A855F7' : '#D1D5DB',
                    borderWidth: isSelecionado ? 2 : 1,
                    elevation: isSelecionado ? 0 : 2,
                  }
                ]}
              >
                <Text style={[
                  styles.medButtonText,
                  {
                    color: isSelecionado ? '#581C87' : '#1F2937',
                    fontWeight: isSelecionado ? 'bold' : 'normal',
                  }
                ]}>
                  {remedio}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity 
          style={[styles.confirmButton, selecionados.length !== 4 && styles.confirmButtonDisabled]}
          activeOpacity={0.8}
          onPress={confirmarProtocolo}
          disabled={selecionados.length !== 4}
        >
          <Text style={styles.confirmButtonText}>Confirmar Protocolo</Text>
        </TouchableOpacity>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginLeft: 10,
  },
  instructionText: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 24,
  },
  gridContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  medButton: {
    width: '48%', // Approx 2 per row with spacing
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  medButtonText: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  confirmButton: {
    height: 56,
    backgroundColor: '#A855F7',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  confirmButtonDisabled: {
    backgroundColor: '#D1D5DB', // gray-300
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
