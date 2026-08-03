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
import { 
  ArrowLeft, 
  Clock, 
  Target, 
  Activity, 
  Award, 
  ShieldCheck, 
  Sparkles,
  Zap,
  ChevronRight,
  Hospital
} from 'lucide-react-native';
import { getAggregatedClinicalStats, AggregatedClinicalStats } from '../utils/adaptiveEngine';

export default function EstatisticasScreen() {
  const [stats, setStats] = useState<AggregatedClinicalStats | null>(null);

  const carregarStats = async () => {
    const data = await getAggregatedClinicalStats();
    setStats(data);
  };

  useFocusEffect(
    useCallback(() => {
      carregarStats();
    }, [])
  );

  if (!stats) return <View style={styles.safeArea} />;

  const minEcg = Math.floor(stats.tempoMedioPortaEcgSegundos / 60);
  const secEcg = stats.tempoMedioPortaEcgSegundos % 60;
  const tempoEcgFormatado = `${minEcg}m ${secEcg}s`;

  const getStatusAcuracia = () => {
    if (stats.acuraciaGlobal >= 85) return { label: 'Nível Especialista', cor: '#10B981' };
    if (stats.acuraciaGlobal >= 65) return { label: 'Nível Pleno', cor: '#3B82F6' };
    return { label: 'Em Treinamento', cor: '#F59E0B' };
  };

  const statusAcc = getStatusAcuracia();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <ArrowLeft color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>PAINEL TELEMÉTRICO DE ASSERTIVIDADE</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Banner de Sinais de Plantão */}
        <View style={styles.telemetryBanner}>
          <View style={styles.gaugeContainer}>
            <View style={[styles.gaugeCircle, { borderColor: statusAcc.cor }]}>
              <Text style={[styles.gaugePercent, { color: statusAcc.cor }]}>
                {stats.acuraciaGlobal}%
              </Text>
              <Text style={styles.gaugeSub}>Acurácia</Text>
            </View>
          </View>

          <View style={styles.telemetryInfo}>
            <View style={[styles.statusBadge, { backgroundColor: `${statusAcc.cor}20`, borderColor: statusAcc.cor }]}>
              <ShieldCheck size={14} color={statusAcc.cor} />
              <Text style={[styles.statusBadgeText, { color: statusAcc.cor }]}>{statusAcc.label}</Text>
            </View>
            <Text style={styles.telemetryTitle}>Telemetria de Atendimento</Text>
            <Text style={styles.telemetryDesc}>
              {stats.sessoesConcluidas} Etapas executadas com autonomia de {stats.taxaAutonomia}%.
            </Text>
          </View>
        </View>

        {/* Indicadores Principais em Cards Neon */}
        <View style={styles.cardsGrid}>
          {/* Card Tempo Porta-ECG */}
          <View style={[styles.metricCard, { borderColor: '#38BDF8' }]}>
            <View style={styles.metricHeader}>
              <Clock color="#38BDF8" size={18} />
              <Text style={styles.metricLabel}>TEMPO PORTA-ECG</Text>
            </View>
            <Text style={[styles.metricValue, { color: '#38BDF8' }]}>{tempoEcgFormatado}</Text>
            <Text style={styles.metricMeta}>Meta SBC: &lt; 10 min</Text>
          </View>

          {/* Card Autonomia Clinica */}
          <View style={[styles.metricCard, { borderColor: '#A855F7' }]}>
            <View style={styles.metricHeader}>
              <Zap color="#C084FC" size={18} />
              <Text style={styles.metricLabel}>AUTONOMIA</Text>
            </View>
            <Text style={[styles.metricValue, { color: '#C084FC' }]}>{stats.taxaAutonomia}%</Text>
            <Text style={styles.metricMeta}>Sem Dicas do Gênio</Text>
          </View>
        </View>

        {/* Radar de Competências Clínicas */}
        <Text style={styles.sectionTitle}>Radar de Competências Clínicas</Text>
        <View style={styles.radarCard}>
          <CompetenciaBar
            titulo="Raciocínio Diagnóstico (Triagem & Anamnese)"
            porcentagem={stats.competencias.raciocinioDiagnostico}
            cor="#3B82F6"
          />
          <CompetenciaBar
            titulo="Precisão Eletrocardiográfica (ECG)"
            porcentagem={stats.competencias.precisaoEcg}
            cor="#22C55E"
          />
          <CompetenciaBar
            titulo="Segurança Farmacológica (Protocolo MONABESH)"
            porcentagem={stats.competencias.segurancaFarmacologica}
            cor="#A855F7"
          />
          <CompetenciaBar
            titulo="Visão Longitudinal & Prevenção (Biomarcadores & Alta)"
            porcentagem={stats.competencias.visaoPrevensao}
            cor="#14B8A6"
          />
        </View>

        {/* Status por Leito de Emergência */}
        <Text style={styles.sectionTitle}>Status dos Leitos da Sala Vermelha</Text>
        <View style={styles.leitosCardContainer}>
          {stats.pacientesProgresso.map((p, idx) => (
            <TouchableOpacity
              key={p.patientId}
              activeOpacity={0.85}
              onPress={() => router.push(`/prontuario?patientId=${p.patientId}`)}
              style={styles.leitoRow}
            >
              <View style={styles.leitoNumberBadge}>
                <Text style={styles.leitoNumberText}>0{idx + 1}</Text>
              </View>
              <View style={styles.leitoInfo}>
                <Text style={styles.leitoNome}>{p.nome}</Text>
                <Text style={styles.leitoStatus}>{p.status}</Text>
              </View>
              <View style={styles.leitoProgressBox}>
                <Text style={styles.leitoPercentText}>{p.progresso}%</Text>
                <ChevronRight color="#94A3B8" size={20} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const CompetenciaBar = ({ titulo, porcentagem, cor }: { titulo: string; porcentagem: number; cor: string }) => (
  <View style={styles.compContainer}>
    <View style={styles.compHeader}>
      <Text style={styles.compTitle}>{titulo}</Text>
      <Text style={[styles.compPercent, { color: cor }]}>{porcentagem}%</Text>
    </View>
    <View style={styles.barTrack}>
      <View style={[styles.barFill, { width: `${porcentagem}%`, backgroundColor: cor }]} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  appBar: {
    height: 56,
    backgroundColor: '#1E293B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  iconButton: {
    padding: 12,
  },
  appBarTitle: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  container: {
    padding: 20,
  },
  telemetryBanner: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  gaugeContainer: {
    marginRight: 16,
  },
  gaugeCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F172A',
  },
  gaugePercent: {
    fontSize: 22,
    fontWeight: '900',
  },
  gaugeSub: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: 'bold',
  },
  telemetryInfo: {
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  telemetryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  telemetryDesc: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
    lineHeight: 16,
  },
  cardsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    flex: 0.48,
    borderWidth: 1.5,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#94A3B8',
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  metricMeta: {
    fontSize: 11,
    color: '#64748B',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#F8FAFC',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  radarCard: {
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 24,
  },
  compContainer: {
    marginBottom: 14,
  },
  compHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  compTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  compPercent: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  barTrack: {
    height: 8,
    backgroundColor: '#0F172A',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  leitosCardContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 24,
  },
  leitoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  leitoNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  leitoNumberText: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: 'bold',
  },
  leitoInfo: {
    flex: 1,
  },
  leitoNome: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  leitoStatus: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  leitoProgressBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leitoPercentText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#38BDF8',
    marginRight: 6,
  },
});
