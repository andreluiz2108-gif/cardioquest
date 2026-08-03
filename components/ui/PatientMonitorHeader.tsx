import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { HeartPulse, Activity, AlertTriangle, ShieldCheck } from 'lucide-react-native';

interface PatientMonitorHeaderProps {
  nomePaciente: string;
  leitoNumero?: string;
  sinaisVitais?: {
    pa?: string;
    fc?: string;
    spo2?: string;
    tax?: string;
  };
  estadoAlarme?: 'estavel' | 'atencao' | 'critico';
}

export default function PatientMonitorHeader({
  nomePaciente,
  leitoNumero = '01',
  sinaisVitais = { pa: '120/80', fc: '75 bpm', spo2: '97%', tax: '36.5 °C' },
  estadoAlarme = 'estavel'
}: PatientMonitorHeaderProps) {
  // Animação da luz de pulso do monitor
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const duration = estadoAlarme === 'critico' ? 400 : estadoAlarme === 'atencao' ? 700 : 1000;
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: duration,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [estadoAlarme, pulseAnim]);

  const getCorAlarme = () => {
    switch (estadoAlarme) {
      case 'critico':
        return '#EF4444'; // Red
      case 'atencao':
        return '#F59E0B'; // Amber
      default:
        return '#10B981'; // Emerald
    }
  };

  const getLabelAlarme = () => {
    switch (estadoAlarme) {
      case 'critico':
        return 'ALERTA CRÍTICO';
      case 'atencao':
        return 'MONITORAR ISQUEMIA';
      default:
        return 'SINAIS ESTÁVEIS';
    }
  };

  const corAlarme = getCorAlarme();

  return (
    <View style={styles.monitorContainer}>
      {/* Top Bar do Monitor */}
      <View style={styles.topBar}>
        <View style={styles.leitoBadge}>
          <Text style={styles.leitoBadgeText}>LEITO {leitoNumero}</Text>
        </View>
        <Text style={styles.patientName} numberOfLines={1}>
          {nomePaciente}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: `${corAlarme}20`, borderColor: corAlarme }]}>
          <Animated.View style={[styles.pulseDot, { backgroundColor: corAlarme, opacity: pulseAnim }]} />
          <Text style={[styles.statusBadgeText, { color: corAlarme }]}>{getLabelAlarme()}</Text>
        </View>
      </View>

      {/* Grid de Métricas Digitais do Monitor */}
      <View style={styles.metricsGrid}>
        {/* Frequência Cardíaca */}
        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <HeartPulse color={corAlarme} size={14} />
            <Text style={styles.metricLabel}>FC (BPM)</Text>
          </View>
          <Text style={[styles.metricValue, { color: corAlarme }]}>
            {sinaisVitais.fc ? sinaisVitais.fc.replace(' bpm', '') : '75'}
          </Text>
        </View>

        {/* Pressão Arterial */}
        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <Activity color="#3B82F6" size={14} />
            <Text style={styles.metricLabel}>PA (mmHg)</Text>
          </View>
          <Text style={[styles.metricValue, { color: '#60A5FA' }]}>
            {sinaisVitais.pa || '120/80'}
          </Text>
        </View>

        {/* Saturação de O2 */}
        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <ShieldCheck color="#10B981" size={14} />
            <Text style={styles.metricLabel}>SpO2 (%)</Text>
          </View>
          <Text style={[styles.metricValue, { color: '#34D399' }]}>
            {sinaisVitais.spo2 || '97%'}
          </Text>
        </View>
      </View>

      {/* Simulação Visual da Linha de Onda de ECG */}
      <View style={styles.ecgWaveContainer}>
        <View style={[styles.ecgWaveLine, { borderColor: `${corAlarme}80` }]} />
        <Text style={styles.ecgLeadText}>Derivação II • 25mm/s • 10mm/mV</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  monitorContainer: {
    backgroundColor: '#0F172A', // Dark Navy de Monitor Médico
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: '#1E293B',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  leitoBadge: {
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  leitoBadgeText: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  patientName: {
    color: '#F1F5F9',
    fontSize: 15,
    fontWeight: 'bold',
    flex: 1,
    marginHorizontal: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metricCard: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 0.31,
    borderWidth: 1,
    borderColor: '#334155',
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  metricLabel: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  ecgWaveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  ecgWaveLine: {
    flex: 1,
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    marginRight: 10,
  },
  ecgLeadText: {
    color: '#64748B',
    fontSize: 9,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});
