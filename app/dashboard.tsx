import React, { useState, useCallback } from 'react';
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
import { 
  LogOut, 
  PlusCircle, 
  PlayCircle, 
  Trophy, 
  ChevronRight, 
  Activity,
  Hospital,
  Flame,
  Stethoscope
} from 'lucide-react-native';
import HospitalBadgeCard from '../components/ui/HospitalBadgeCard';
import AdaptiveRecommendationCard from '../components/ui/AdaptiveRecommendationCard';

const NIVEIS = [
  { nome: 'Estudante Calouro', minXp: 0, cor: '#9CA3AF' },
  { nome: 'Interno de Enfermagem', minXp: 150, cor: '#38BDF8' },
  { nome: 'Enfermeiro Júnior', minXp: 300, cor: '#10B981' },
  { nome: 'Enfermeiro Pleno', minXp: 500, cor: '#A855F7' },
  { nome: 'Especialista em Cardio', minXp: 700, cor: '#EF4444' },
  { nome: 'Mestre do Plantão', minXp: 850, cor: '#F97316' },
  { nome: 'Lenda da Enfermagem', minXp: 1000, cor: '#14B8A6' },
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
      const confirm = window.confirm('Isto irá apagar o seu progresso de plantão. Tem certeza de que quer reiniciar o plantão?');
      if (confirm) performReset();
    } else {
      Alert.alert(
        'Reiniciar Plantão?',
        'Isto irá apagar o seu progresso de plantão. Tem certeza?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Sim, Reiniciar', style: 'destructive', onPress: performReset },
        ]
      );
    }
  };

  const nivelAtual = obterNivelAtual();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* AppBar do Centro Médico */}
      <View style={styles.appBar}>
        <View style={styles.appBarTitleGroup}>
          <Hospital color="#FFFFFF" size={22} />
          <Text style={styles.appBarTitle}>CENTRAL DO PLANTÃO MÉDICO</Text>
        </View>
        <View style={styles.appBarActions}>
          <TouchableOpacity onPress={sairEResetar} style={styles.iconButton}>
            <LogOut color="#DDD6FE" size={20} />
          </TouchableOpacity>
          <TouchableOpacity onPress={ganharXpTeste} style={styles.iconButton}>
            <PlusCircle color="#10B981" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Crachá Digital de Identificação */}
        <HospitalBadgeCard
          nome={nomeEnfermeiro || 'Profissional de Plantão'}
          cargo={nivelAtual.nome}
          avatarEmoji={avatar}
          xpTotal={xpAtual}
          corCargo={nivelAtual.cor}
        />

        {/* Card de Recomendação Adaptativa do Gênio */}
        <AdaptiveRecommendationCard />

        {/* Banner de Status da Sala de Emergência */}
        <View style={styles.emergencyStatusBanner}>
          <View style={styles.statusRow}>
            <Flame size={20} color="#F97316" />
            <Text style={styles.statusTitle}>Sala Vermelha / CTI em Atendimento</Text>
          </View>
          <Text style={styles.statusDesc}>
            5 Prontuários ativos no leito de emergência com diversas complexidades clínicas.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Comandos de Emergência</Text>

        {/* Prontuários Card 3D Gamificado */}
        <TouchableOpacity 
          activeOpacity={0.85} 
          style={styles.prontuarioCard3D}
          onPress={() => router.push('/prontuarios')}
        >
          <View style={styles.cardIconBox}>
            <Stethoscope color="#FFFFFF" size={30} />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Galeria de Prontuários de Leito</Text>
            <Text style={styles.cardSubtitle}>Atenda os 5 leitos de emergência e aplique as 6 condutas.</Text>
          </View>
          <PlayCircle color="#FFFFFF" size={32} />
        </TouchableOpacity>

        {/* Troféus Card 3D Gamificado */}
        <TouchableOpacity 
          activeOpacity={0.85} 
          style={styles.trofeusCard3D}
          onPress={() => router.push('/trofeus')}
        >
          <View style={[styles.cardIconBox, { backgroundColor: '#581C87' }]}>
            <Trophy color="#F59E0B" size={28} />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Sala de Conquistas & Medalhas</Text>
            <Text style={styles.cardSubtitleViolet}>Conquistas médicas e credenciais de especialização.</Text>
          </View>
          <ChevronRight color="#F59E0B" size={28} />
        </TouchableOpacity>

        {/* Estatísticas Card 3D Gamificado */}
        <TouchableOpacity 
          activeOpacity={0.85} 
          style={styles.estatisticasCard3D}
          onPress={() => router.push('/estatisticas')}
        >
          <View style={[styles.cardIconBox, { backgroundColor: '#4C1D95' }]}>
            <Activity color="#38BDF8" size={28} />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Métricas de Assertividade</Text>
            <Text style={styles.cardSubtitleViolet}>Tempo de resposta e precisão dos diagnósticos.</Text>
          </View>
          <ChevronRight color="#38BDF8" size={28} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#2E1065', // Deep Gamified Royal Purple
  },
  appBar: {
    height: 56,
    backgroundColor: '#3B0764',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1.5,
    borderBottomColor: '#581C87',
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  appBarTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appBarTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginLeft: 8,
  },
  appBarActions: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
    marginLeft: 4,
  },
  container: {
    padding: 20,
  },
  emergencyStatusBanner: {
    backgroundColor: '#3B0764',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#6D28D9',
    marginBottom: 24,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  statusTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  statusDesc: {
    color: '#DDD6FE',
    fontSize: 12,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#F8FAFC',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  prontuarioCard3D: {
    backgroundColor: '#10B981', // Mint Green 3D
    padding: 18,
    borderRadius: 20,
    borderBottomWidth: 5,
    borderBottomColor: '#047857',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  trofeusCard3D: {
    backgroundColor: '#3B0764',
    padding: 18,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#6D28D9',
    borderBottomWidth: 5,
    borderBottomColor: '#1E1B4B',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  estatisticasCard3D: {
    backgroundColor: '#3B0764',
    padding: 18,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#6D28D9',
    borderBottomWidth: 5,
    borderBottomColor: '#1E1B4B',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTextContainer: {
    flex: 1,
    marginLeft: 14,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#ECFDF5',
    lineHeight: 16,
  },
  cardSubtitleViolet: {
    fontSize: 12,
    color: '#C4B5FD',
    lineHeight: 16,
  },
});
