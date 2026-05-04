import React, { useState, useEffect, useCallback } from 'react';
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
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LogOut, PlusCircle, ClipboardList, PlayCircle, Trophy, ChevronRight } from 'lucide-react-native';

const NIVEIS = [
  { nome: 'Estudante Calouro', minXp: 0, cor: '#9CA3AF' }, // gray-400
  { nome: 'Interno de Enfermagem', minXp: 150, cor: '#3B82F6' }, // blue-500
  { nome: 'Enfermeiro Júnior', minXp: 300, cor: '#22C55E' }, // green-500
  { nome: 'Enfermeiro Pleno', minXp: 500, cor: '#A855F7' }, // purple-500
  { nome: 'Especialista em Cardio', minXp: 700, cor: '#EF4444' }, // red-500
  { nome: 'Mestre do Plantão', minXp: 850, cor: '#F97316' }, // orange-500
  { nome: 'Lenda da Enfermagem', minXp: 1000, cor: '#14B8A6' }, // teal-500
];

export default function DashboardScreen() {
  const [nomeEnfermeiro, setNomeEnfermeiro] = useState('');
  const [avatar, setAvatar] = useState('👨‍⚕️');
  const [xpAtual, setXpAtual] = useState(0);

  const carregarDados = async () => {
    try {
      const nome = await AsyncStorage.getItem('nomeEnfermeiro');
      const avt = await AsyncStorage.getItem('avatarEnfermeiro');
      const xp = await AsyncStorage.getItem('xpEnfermeiro');
      
      if (nome) setNomeEnfermeiro(nome);
      if (avt) setAvatar(avt);
      if (xp) setXpAtual(parseInt(xp, 10));
    } catch (e) {
      console.error(e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [])
  );

  const obterNivelAtual = () => {
    let nivelAtual = NIVEIS[0];
    for (let nivel of NIVEIS) {
      if (xpAtual >= nivel.minXp) {
        nivelAtual = nivel;
      } else {
        break;
      }
    }
    return nivelAtual;
  };

  const obterProximoXp = () => {
    for (let nivel of NIVEIS) {
      if (xpAtual < nivel.minXp) {
        return nivel.minXp;
      }
    }
    return xpAtual;
  };

  const ganharXpTeste = async () => {
    const novoXp = xpAtual + 250;
    setXpAtual(novoXp);
    await AsyncStorage.setItem('xpEnfermeiro', novoXp.toString());
  };

  const sairEResetar = async () => {
    const performReset = async () => {
      await AsyncStorage.clear();
      router.replace('/');
    };

    if (Platform.OS === 'web') {
      const confirm = window.confirm('Isto irá apagar todo o seu progresso, XP, cadeados e medalhas. Tem a certeza de que quer começar de novo?');
      if (confirm) performReset();
    } else {
      Alert.alert(
        'Reiniciar Jogo?',
        'Isto irá apagar todo o seu progresso, XP, cadeados e medalhas. Tem a certeza de que quer começar de novo?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Sim, Reiniciar', style: 'destructive', onPress: performReset },
        ]
      );
    }
  };

  const nivelAtual = obterNivelAtual();
  const proximoXp = obterProximoXp();

  let progresso = 1.0;
  if (proximoXp > nivelAtual.minXp) {
    progresso = (xpAtual - nivelAtual.minXp) / (proximoXp - nivelAtual.minXp);
  }

  // Helper para converter hex color para rgb e adicionar opacidade (cor de fundo do badge)
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>Sala de Plantão</Text>
        <View style={styles.appBarActions}>
          <TouchableOpacity onPress={sairEResetar} style={styles.iconButton}>
            <LogOut color="#FFFFFF" size={24} />
          </TouchableOpacity>
          <TouchableOpacity onPress={ganharXpTeste} style={styles.iconButton}>
            <PlusCircle color="#FFFFFF" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Card do Usuário */}
        <View style={styles.userCard}>
          <View style={styles.avatarBox}>
            <Text style={styles.avatarEmoji}>{avatar}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{nomeEnfermeiro}</Text>
            <View style={{ alignItems: 'flex-start', marginTop: 4 }}>
              <View style={[styles.badge, { backgroundColor: hexToRgba(nivelAtual.cor, 0.2) }]}>
                <Text style={[styles.badgeText, { color: nivelAtual.cor }]}>{nivelAtual.nome}</Text>
              </View>
            </View>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${progresso * 100}%` }]} />
              </View>
            </View>
            <Text style={styles.xpText}>{xpAtual} / {proximoXp} XP</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Acesso Rápido</Text>

        {/* Prontuário Card */}
        <TouchableOpacity 
          activeOpacity={0.8} 
          style={styles.prontuarioCard}
          onPress={() => router.push('/prontuario')}
        >
          <ClipboardList color="#FFFFFF" size={40} />
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Prontuário: Sr. Carlos</Text>
            <Text style={styles.cardSubtitle}>Paciente com dor torácica aguda.</Text>
          </View>
          <PlayCircle color="#FFFFFF" size={32} />
        </TouchableOpacity>

        {/* Troféus Card */}
        <TouchableOpacity 
          activeOpacity={0.8} 
          style={styles.trofeusCard}
          onPress={() => router.push('/trofeus')}
        >
          <Trophy color="#F59E0B" size={40} />
          <View style={styles.cardTextContainer}>
            <Text style={[styles.cardTitle, { color: '#1F2937' }]}>Sala de Troféus</Text>
            <Text style={[styles.cardSubtitle, { color: '#6B7280' }]}>Veja as suas conquistas clínicas.</Text>
          </View>
          <ChevronRight color="#F59E0B" size={32} />
        </TouchableOpacity>

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
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 24 : 0, // safe area hack se n tiver safeareaview real
  },
  appBarTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  appBarActions: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  container: {
    padding: 24,
  },
  userCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#9CA3AF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 40,
  },
  avatarBox: {
    width: 70,
    height: 70,
    backgroundColor: '#EFF6FF', // blue-50
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 40,
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressContainer: {
    marginTop: 8,
    marginBottom: 4,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#E5E7EB', // gray-200
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#F59E0B', // amber-500
  },
  xpText: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  prontuarioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB', // approx linear gradient
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  trofeusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FCD34D', // amber-300
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTextContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginTop: 4,
  },
});
