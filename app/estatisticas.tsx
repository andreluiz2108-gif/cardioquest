import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  Platform
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Clock, Target, Activity, Award } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Estado inicial das estatísticas (zeradas)
const MODULOS_STATS = [
  { id: 'prontuario', nome: 'Prontuário', tempoMin: 0, acertos: 0, cor: '#3B82F6' },
  { id: 'triagem', nome: 'Triagem', tempoMin: 0, acertos: 0, cor: '#8B5CF6' },
  { id: 'ecg', nome: 'ECG', tempoMin: 0, acertos: 0, cor: '#EF4444' },
  { id: 'enzimas', nome: 'Enzimas', tempoMin: 0, acertos: 0, cor: '#F59E0B' },
  { id: 'protocolo', nome: 'Protocolo', tempoMin: 0, acertos: 0, cor: '#10B981' },
  { id: 'alta', nome: 'Alta', tempoMin: 0, acertos: 0, cor: '#14B8A6' },
];

export default function EstatisticasScreen() {
  const [stats, setStats] = useState(MODULOS_STATS);
  const [xpTotal, setXpTotal] = useState(0);

  useEffect(() => {
    // Tenta buscar métricas reais, senão usa o mock
    const loadStats = async () => {
      try {
        const xp = await AsyncStorage.getItem('xpEnfermeiro');
        if (xp) setXpTotal(parseInt(xp, 10));

        const savedStats = await AsyncStorage.getItem('estatisticasJogo');
        if (savedStats) {
          setStats(JSON.parse(savedStats));
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadStats();
  }, []);

  const totalTime = stats.reduce((acc, curr) => acc + curr.tempoMin, 0);
  const averageAccuracy = Math.round(stats.reduce((acc, curr) => acc + curr.acertos, 0) / stats.length);
  const maxTime = Math.max(...stats.map(s => s.tempoMin));

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Métricas de Desempenho</Text>
        <View style={{ width: 24, paddingHorizontal: 16 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Resumo Geral */}
        <View style={styles.summaryContainer}>
          <View style={[styles.summaryCard, { backgroundColor: '#EFF6FF' }]}>
            <View style={styles.summaryIconBox}>
              <Target color="#3B82F6" size={24} />
            </View>
            <Text style={styles.summaryValue}>{averageAccuracy}%</Text>
            <Text style={styles.summaryLabel}>Acerto Global</Text>
          </View>
          
          <View style={[styles.summaryCard, { backgroundColor: '#FEF2F2' }]}>
            <View style={[styles.summaryIconBox, { backgroundColor: '#FEE2E2' }]}>
              <Clock color="#EF4444" size={24} />
            </View>
            <Text style={[styles.summaryValue, { color: '#B91C1C' }]}>{totalTime}m</Text>
            <Text style={styles.summaryLabel}>Tempo Total</Text>
          </View>
        </View>

        <View style={[styles.summaryCardRow, { backgroundColor: '#F0FDF4' }]}>
          <View style={[styles.summaryIconBox, { backgroundColor: '#DCFCE7' }]}>
             <Award color="#16A34A" size={24} />
          </View>
          <View style={{ flex: 1, marginLeft: 16 }}>
            <Text style={styles.summaryLabel}>Experiência (XP)</Text>
            <Text style={[styles.summaryValue, { color: '#15803D' }]}>{xpTotal} XP Acumulados</Text>
          </View>
        </View>

        {/* Métricas de Acerto */}
        <Text style={styles.sectionTitle}>Assertividade por Módulo</Text>
        <View style={styles.card}>
          {stats.map((modulo, index) => (
            <View key={`acerto-${modulo.id}`} style={[styles.statRow, index === stats.length - 1 && { borderBottomWidth: 0 }]}>
              <View style={styles.statInfo}>
                <Text style={styles.statName}>{modulo.nome}</Text>
                <Text style={styles.statValue}>{modulo.acertos}%</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBarFill, { width: `${modulo.acertos}%`, backgroundColor: modulo.cor }]} />
              </View>
            </View>
          ))}
        </View>

        {/* Tempo Gasto */}
        <Text style={styles.sectionTitle}>Tempo Gasto (minutos)</Text>
        <View style={styles.card}>
          {stats.map((modulo, index) => {
            const timePercentage = maxTime > 0 ? (modulo.tempoMin / maxTime) * 100 : 0;
            return (
              <View key={`tempo-${modulo.id}`} style={[styles.statRow, index === stats.length - 1 && { borderBottomWidth: 0 }]}>
                <View style={styles.statInfo}>
                  <Text style={styles.statName}>{modulo.nome}</Text>
                  <Text style={styles.statValue}>{modulo.tempoMin} min</Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBarFill, { width: `${timePercentage}%`, backgroundColor: '#9CA3AF' }]} />
                </View>
              </View>
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
  backButton: {
    padding: 16,
  },
  appBarTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    padding: 24,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    flexDirection: 'column',
    shadowColor: '#9CA3AF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryCardRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#9CA3AF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryIconBox: {
    width: 48,
    height: 48,
    backgroundColor: '#DBEAFE',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    marginTop: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#9CA3AF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  statInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
});
