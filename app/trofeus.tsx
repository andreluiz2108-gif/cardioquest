import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  Modal,
  Platform
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  ArrowLeft, 
  Trophy, 
  Lock,
  Sparkles,
  X
} from 'lucide-react-native';
import { getAllAchievementsWithStatus, MedalhaData } from '../services/achievementService';

export default function TrofeusScreen() {
  const [abaAtiva, setAbaAtiva] = useState<'credenciais' | 'autonomia' | 'vidas'>('credenciais');
  const [medalhas, setMedalhas] = useState<MedalhaData[]>([]);
  const [medalhaSelecionada, setMedalhaSelecionada] = useState<MedalhaData | null>(null);

  const carregarProgressoEMedalhas = async () => {
    try {
      const listaMedalhas = await getAllAchievementsWithStatus();
      setMedalhas(listaMedalhas);
    } catch (e) {
      console.error(e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarProgressoEMedalhas();
    }, [])
  );

  const medalhasFiltradas = medalhas.filter(m => m.categoria === abaAtiva);
  const totalDesbloqueadas = medalhas.filter(m => m.desbloqueada).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <ArrowLeft color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>GALERIA DE HONRA MÉDICA</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Banner do Total de Conquistas */}
        <View style={styles.collectionBanner}>
          <View style={styles.collectionTextGroup}>
            <Text style={styles.collectionTitle}>Sala de Troféus & Credenciais</Text>
            <Text style={styles.collectionSubtitle}>
              {totalDesbloqueadas} de {medalhas.length} Medalhas de Honra Desbloqueadas
            </Text>
          </View>
          <View style={styles.collectionBadge}>
            <Trophy color="#F59E0B" size={28} />
          </View>
        </View>

        {/* Barra de Seleção de Abas UI+ */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setAbaAtiva('credenciais')}
            style={[styles.tabButton, abaAtiva === 'credenciais' && styles.tabButtonActive]}
          >
            <Text style={[styles.tabText, abaAtiva === 'credenciais' && styles.tabTextActive]}>
              Credenciais
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setAbaAtiva('autonomia')}
            style={[styles.tabButton, abaAtiva === 'autonomia' && styles.tabButtonActive]}
          >
            <Text style={[styles.tabText, abaAtiva === 'autonomia' && styles.tabTextActive]}>
              Autonomia
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setAbaAtiva('vidas')}
            style={[styles.tabButton, abaAtiva === 'vidas' && styles.tabButtonActive]}
          >
            <Text style={[styles.tabText, abaAtiva === 'vidas' && styles.tabTextActive]}>
              Vidas Salvas
            </Text>
          </TouchableOpacity>
        </View>

        {/* Grid de Medalhas UI+ */}
        <View style={styles.gridContainer}>
          {medalhasFiltradas.map(m => {
            const IconComponent = m.Icone;
            return (
              <TouchableOpacity
                key={m.id}
                activeOpacity={0.85}
                onPress={() => setMedalhaSelecionada(m)}
                style={[
                  styles.medalCard,
                  {
                    backgroundColor: m.desbloqueada ? '#1E293B' : '#0F172A',
                    borderColor: m.desbloqueada ? m.corBase : '#334155',
                    shadowColor: m.desbloqueada ? m.corBase : 'transparent',
                  }
                ]}
              >
                <View style={[
                  styles.iconCircle,
                  {
                    backgroundColor: m.desbloqueada ? `${m.corBase}20` : '#1E293B',
                    borderColor: m.desbloqueada ? m.corBase : '#334155'
                  }
                ]}>
                  {m.desbloqueada ? (
                    <IconComponent color={m.corBase} size={30} />
                  ) : (
                    <Lock color="#64748B" size={28} />
                  )}
                </View>

                <Text style={[
                  styles.medalTitle,
                  { color: m.desbloqueada ? '#F8FAFC' : '#64748B' }
                ]} numberOfLines={1}>
                  {m.titulo}
                </Text>

                <Text style={styles.medalSub} numberOfLines={1}>
                  {m.subtitulo}
                </Text>

                <View style={[
                  styles.statusTag,
                  { backgroundColor: m.desbloqueada ? `${m.corBase}25` : '#1E293B' }
                ]}>
                  <Text style={[
                    styles.statusTagText,
                    { color: m.desbloqueada ? m.corBase : '#64748B' }
                  ]}>
                    {m.desbloqueada ? 'CONQUISTADO' : 'BLOQUEADO'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Modal de Detalhes da Medalha */}
      {medalhaSelecionada ? (
        <Modal
          transparent
          visible={!!medalhaSelecionada}
          animationType="fade"
          onRequestClose={() => setMedalhaSelecionada(null)}
        >
          <View style={styles.modalBackdrop}>
            <View style={[styles.modalCard, { borderTopColor: medalhaSelecionada.corBase }]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderTitle}>DETALHES DA CONQUISTA</Text>
                <TouchableOpacity onPress={() => setMedalhaSelecionada(null)}>
                  <X size={20} color="#94A3B8" />
                </TouchableOpacity>
              </View>

              <View style={[styles.modalIconCircle, { backgroundColor: `${medalhaSelecionada.corBase}20` }]}>
                {medalhaSelecionada.desbloqueada ? (
                  <medalhaSelecionada.Icone size={48} color={medalhaSelecionada.corBase} />
                ) : (
                  <Lock size={48} color="#64748B" />
                )}
              </View>

              <Text style={styles.modalTitle}>{medalhaSelecionada.titulo}</Text>
              <Text style={styles.modalSub}>{medalhaSelecionada.subtitulo}</Text>

              <View style={styles.criterioCard}>
                <Text style={styles.criterioLabel}>CRITÉRIO MÉDICO DE DESBLOQUEIO:</Text>
                <Text style={styles.criterioText}>{medalhaSelecionada.criterio}</Text>
              </View>

              <View style={styles.xpRewardBox}>
                <Sparkles size={16} color="#EAB308" />
                <Text style={styles.xpRewardText}>Recompensa: +{medalhaSelecionada.xpBonus} XP</Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setMedalhaSelecionada(null)}
                style={[styles.closeModalButton, { backgroundColor: medalhaSelecionada.corBase }]}
              >
                <Text style={styles.closeModalButtonText}>FECHAR DETALHES</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#2E1065',
  },
  appBar: {
    height: 56,
    backgroundColor: '#3B0764',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#581C87',
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  iconButton: {
    padding: 12,
  },
  appBarTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  collectionBanner: {
    backgroundColor: '#3B0764',
    padding: 18,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#6D28D9',
    borderBottomWidth: 4,
    borderBottomColor: '#4C1D95',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  collectionTextGroup: {
    flex: 1,
  },
  collectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  collectionSubtitle: {
    fontSize: 12,
    color: '#E9D5FF',
    marginTop: 4,
    fontWeight: '600',
  },
  collectionBadge: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#FEF3C7',
    borderWidth: 2,
    borderColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#3B0764',
    borderRadius: 16,
    padding: 6,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#581C87',
    gap: 6,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  tabButtonActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#A78BFA',
    borderBottomWidth: 3,
    borderBottomColor: '#4C1D95',
  },
  tabText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#C4B5FD',
    textTransform: 'uppercase',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  medalCard: {
    width: '48%',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 2,
    borderBottomWidth: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  medalTitle: {
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  medalSub: {
    fontSize: 11,
    color: '#C4B5FD',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '500',
  },
  statusTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusTagText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#3B0764',
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    padding: 20,
    borderWidth: 2,
    borderColor: '#6D28D9',
    borderTopWidth: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalHeaderTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#C4B5FD',
    letterSpacing: 0.8,
  },
  modalIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#6D28D9',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  modalSub: {
    fontSize: 13,
    color: '#E9D5FF',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
  criterioCard: {
    backgroundColor: '#1E1B4B',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#4C1D95',
    marginBottom: 14,
  },
  criterioLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#A78BFA',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  criterioText: {
    fontSize: 12,
    color: '#F3E8FF',
    lineHeight: 18,
    fontWeight: '500',
  },
  xpRewardBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF3C7',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    marginBottom: 16,
  },
  xpRewardText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#854D0E',
    marginLeft: 6,
  },
  closeModalButton: {
    height: 52,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeModalButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
