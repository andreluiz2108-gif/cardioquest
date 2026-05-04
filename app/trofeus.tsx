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
  ArrowLeft, 
  Trophy, 
  Hospital, 
  ClipboardType, 
  HeartPulse, 
  Pill, 
  FlaskConical, 
  HeartHandshake, 
  Lock 
} from 'lucide-react-native';

export default function TrofeusScreen() {
  const [temMedalha1, setTemMedalha1] = useState(false);
  const [temMedalha2, setTemMedalha2] = useState(false);
  const [temMedalha3, setTemMedalha3] = useState(false);
  const [temMedalha4, setTemMedalha4] = useState(false);
  const [temMedalha5, setTemMedalha5] = useState(false);
  const [temMedalha6, setTemMedalha6] = useState(false);

  const carregarMedalhas = async () => {
    try {
      const m1 = await AsyncStorage.getItem('venceu_mod1');
      const m2 = await AsyncStorage.getItem('venceu_mod2');
      const m3 = await AsyncStorage.getItem('venceu_mod3');
      const m4 = await AsyncStorage.getItem('venceu_mod4');
      const m5 = await AsyncStorage.getItem('venceu_mod5');

      setTemMedalha1(m1 === 'true');
      setTemMedalha2(m2 === 'true');
      setTemMedalha3(m3 === 'true');
      setTemMedalha4(m4 === 'true');
      setTemMedalha5(m5 === 'true');
      setTemMedalha6(m5 === 'true'); // Se passou do mod 5 e foi pra alta, ganha a 6 quando a alta termina. 
      // Na verdade a lógica original marcava venceu_mod5 no final da Alta tbm, 
      // mas vamos deixar como estava.
    } catch (e) {
      console.error(e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarMedalhas();
    }, [])
  );

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const MedalhaCard = ({ titulo, subtitulo, Icone, corBase, desbloqueada }: any) => {
    return (
      <View style={[
        styles.medalhaCard,
        {
          backgroundColor: desbloqueada ? '#FFFFFF' : '#E5E7EB',
          borderColor: desbloqueada ? hexToRgba(corBase, 0.5) : 'transparent',
          borderWidth: 2,
          elevation: desbloqueada ? 2 : 0,
          shadowColor: desbloqueada ? corBase : 'transparent'
        }
      ]}>
        <View style={[
          styles.iconCircle,
          { backgroundColor: desbloqueada ? hexToRgba(corBase, 0.1) : '#D1D5DB' }
        ]}>
          {desbloqueada ? (
            <Icone color={corBase} size={32} />
          ) : (
            <Lock color="#6B7280" size={32} />
          )}
        </View>
        <Text style={[styles.titulo, { color: desbloqueada ? '#1F2937' : '#4B5563' }]}>{titulo}</Text>
        <Text style={[styles.subtitulo, { color: desbloqueada ? '#374151' : '#6B7280' }]}>{subtitulo}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <ArrowLeft color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Sala de Troféus</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <Trophy color="#F59E0B" size={36} />
          <Text style={styles.headerText}>As Suas Conquistas</Text>
        </View>
        <Text style={styles.descText}>
          Complete os desafios clínicos com perfeição para colecionar as medalhas de mérito.
        </Text>

        <View style={styles.gridContainer}>
          <MedalhaCard 
            titulo="Olho Clínico" 
            subtitulo="Triagem de Risco" 
            Icone={Hospital} 
            corBase="#F97316" 
            desbloqueada={temMedalha1} 
          />
          <MedalhaCard 
            titulo="Detetive" 
            subtitulo="Anamnese Correta" 
            Icone={ClipboardType} 
            corBase="#3B82F6" 
            desbloqueada={temMedalha2} 
          />
          <MedalhaCard 
            titulo="Águia do ECG" 
            subtitulo="Diagnóstico de Supra" 
            Icone={HeartPulse} 
            corBase="#22C55E" 
            desbloqueada={temMedalha3} 
          />
          <MedalhaCard 
            titulo="Rei do Protocolo" 
            subtitulo="Prescrição MONA" 
            Icone={Pill} 
            corBase="#A855F7" 
            desbloqueada={temMedalha4} 
          />
          <MedalhaCard 
            titulo="Mestre do Lab" 
            subtitulo="Padrão-Ouro" 
            Icone={FlaskConical} 
            corBase="#4F46E5" 
            desbloqueada={temMedalha5} 
          />
          <MedalhaCard 
            titulo="Alta Segura" 
            subtitulo="Educação em Saúde" 
            Icone={HeartHandshake} 
            corBase="#14B8A6" 
            desbloqueada={temMedalha6} 
          />
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginLeft: 12,
  },
  descText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 32,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  medalhaCard: {
    width: '48%', // approx half width with spacing
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  iconCircle: {
    padding: 16,
    borderRadius: 50,
    marginBottom: 12,
  },
  titulo: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 12,
    textAlign: 'center',
  },
});
