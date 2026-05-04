import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  Platform
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  Hospital, 
  ClipboardType, 
  HeartPulse, 
  Pill, 
  FlaskConical, 
  HeartHandshake, 
  Lock, 
  PlayCircle,
  ArrowLeft
} from 'lucide-react-native';

export default function ProntuarioScreen() {
  const [mod2Liberado, setMod2Liberado] = useState(false);
  const [mod3Liberado, setMod3Liberado] = useState(false);
  const [mod4Liberado, setMod4Liberado] = useState(false);
  const [mod5Liberado, setMod5Liberado] = useState(false);
  const [mod6Liberado, setMod6Liberado] = useState(false);

  const carregarProgresso = async () => {
    try {
      const m2 = await AsyncStorage.getItem('venceu_mod1');
      const m3 = await AsyncStorage.getItem('venceu_mod2');
      const m4 = await AsyncStorage.getItem('venceu_mod3');
      const m5 = await AsyncStorage.getItem('venceu_mod4');
      const m6 = await AsyncStorage.getItem('venceu_mod5');

      setMod2Liberado(m2 === 'true');
      setMod3Liberado(m3 === 'true');
      setMod4Liberado(m4 === 'true');
      setMod5Liberado(m5 === 'true');
      setMod6Liberado(m6 === 'true');
    } catch (e) {
      console.error(e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarProgresso();
    }, [])
  );

  // Helper para hex -> rgba
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const ModuloDesafio = ({ titulo, descricao, Icone, cor, isLocked, rota }: any) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => { if (!isLocked) router.push(rota); }}
        style={[
          styles.moduloCard,
          {
            backgroundColor: isLocked ? '#F3F4F6' : '#FFFFFF',
            borderColor: isLocked ? 'transparent' : hexToRgba(cor, 0.5),
            shadowColor: isLocked ? 'transparent' : cor,
            elevation: isLocked ? 0 : 2,
          }
        ]}
      >
        <View style={[
          styles.iconCircle,
          { backgroundColor: isLocked ? '#E5E7EB' : hexToRgba(cor, 0.2) }
        ]}>
          {isLocked ? (
            <Lock color="#6B7280" size={24} />
          ) : (
            <Icone color={cor} size={24} />
          )}
        </View>
        <View style={styles.moduloTextContainer}>
          <Text style={[
            styles.moduloTitle,
            { color: isLocked ? '#4B5563' : '#1F2937' }
          ]}>
            {titulo}
          </Text>
          <Text style={[
            styles.moduloDesc,
            { color: isLocked ? '#6B7280' : '#374151' }
          ]}>
            {descricao}
          </Text>
        </View>
        {!isLocked && <PlayCircle color={cor} size={28} />}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <ArrowLeft color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Prontuário: Sr. Carlos</Text>
        <View style={{ width: 40 }} /> {/* balancear o header */}
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Ficha de Admissão */}
        <View style={styles.admissaoCard}>
          <View style={styles.admissaoHeaderRow}>
            <Text style={styles.admissaoLabel}>ADMISSÃO</Text>
            <Text style={styles.admissaoTime}>19:00</Text>
          </View>
          <Text style={styles.admissaoName}>Sr. Carlos Mendes, 62 anos</Text>
          <Text style={styles.admissaoDesc}>
            Motivo: Dor torácica opressiva (9/10) irradiada para membro superior esquerdo, iniciada há 40 minutos.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Evolução Clínica</Text>

        <ModuloDesafio
          titulo="1. Triagem (Manchester)"
          descricao="Classifique o risco deste paciente rapidamente."
          Icone={Hospital}
          cor="#F97316" // orange
          isLocked={false}
          rota="/triagem"
        />

        <ModuloDesafio
          titulo="2. Anamnese Direcionada"
          descricao="Colete sinais vitais e histórico médico."
          Icone={ClipboardType}
          cor="#3B82F6" // blue
          isLocked={!mod2Liberado}
          rota="/anamnese"
        />

        <ModuloDesafio
          titulo="3. Eletrocardiograma (ECG)"
          descricao="Identifique possíveis alterações isquêmicas."
          Icone={HeartPulse}
          cor="#22C55E" // green
          isLocked={!mod3Liberado}
          rota="/ecg"
        />

        <ModuloDesafio
          titulo="4. Intervenção Farmacológica"
          descricao="Prescreva as medicações do protocolo inicial."
          Icone={Pill}
          cor="#A855F7" // purple
          isLocked={!mod4Liberado}
          rota="/protocolo"
        />

        <ModuloDesafio
          titulo="5. Laboratório (Biomarcadores)"
          descricao="Avalie a curva enzimática do paciente."
          Icone={FlaskConical}
          cor="#4F46E5" // indigo
          isLocked={!mod5Liberado}
          rota="/enzimas"
        />

        <ModuloDesafio
          titulo="6. Alta e Orientações"
          descricao="Educação em saúde para prevenção secundária."
          Icone={HeartHandshake}
          cor="#14B8A6" // teal
          isLocked={!mod6Liberado}
          rota="/alta"
        />
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
  admissaoCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 6,
    borderLeftColor: '#EF4444',
    shadowColor: '#9CA3AF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 32,
  },
  admissaoHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  admissaoLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9CA3AF',
  },
  admissaoTime: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#EF4444',
  },
  admissaoName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 8,
  },
  admissaoDesc: {
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  moduloCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  iconCircle: {
    padding: 12,
    borderRadius: 50,
  },
  moduloTextContainer: {
    flex: 1,
    marginLeft: 16,
    marginRight: 8,
  },
  moduloTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  moduloDesc: {
    fontSize: 12,
  },
});
