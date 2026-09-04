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
  Hospital,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trash2,
  Filter
} from 'lucide-react-native';
import { 
  getAggregatedClinicalStats, 
  AggregatedClinicalStats,
  getDetailedQuestionErrors,
  clearQuestionErrorsHistory
} from '../utils/adaptiveEngine';
import { QuestionErrorRecord } from '../types/adaptive';

export default function EstatisticasScreen() {
  const [stats, setStats] = useState<AggregatedClinicalStats | null>(null);
  const [errosDetalhados, setErrosDetalhados] = useState<QuestionErrorRecord[]>([]);
  const [filtroPaciente, setFiltroPaciente] = useState<string>('todos');

  const carregarDados = async () => {
    const statsData = await getAggregatedClinicalStats();
    setStats(statsData);

    const errorsData = await getDetailedQuestionErrors();
    setErrosDetalhados(errorsData);
  };

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [])
  );

  const limparHistoricoErros = async () => {
    const executarLimpeza = async () => {
      await clearQuestionErrorsHistory();
      setErrosDetalhados([]);
    };

    if (Platform.OS === 'web') {
      const confirm = window.confirm('Deseja realmente limpar o histórico de erros de alternativas?');
      if (confirm) executarLimpeza();
    } else {
      Alert.alert(
        'Limpar Histórico de Erros?',
        'Isto irá zerar o registro de alternativas erradas nas estatísticas. Tem certeza?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Sim, Limpar', style: 'destructive', onPress: executarLimpeza },
        ]
      );
    }
  };

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

  // Filtragem de erros
  const errosFiltrados = filtroPaciente === 'todos' 
    ? errosDetalhados 
    : errosDetalhados.filter(e => e.patientId === filtroPaciente);

  const totalTentativasIncorretas = errosDetalhados.reduce((acc, curr) => acc + curr.quantidadeErros, 0);

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

        {/* SEÇÃO NOVA: Registro Detalhado de Erros por Alternativa */}
        <View style={styles.errorsSectionHeader}>
          <View style={styles.sectionTitleRow}>
            <AlertTriangle color="#EF4444" size={20} />
            <Text style={[styles.sectionTitle, { marginBottom: 0, marginLeft: 8 }]}>
              Desvios Clínicos & Erros por Alternativa
            </Text>
          </View>

          {errosDetalhados.length > 0 ? (
            <TouchableOpacity 
              activeOpacity={0.7} 
              onPress={limparHistoricoErros}
              style={styles.clearErrorsButton}
            >
              <Trash2 color="#94A3B8" size={14} />
              <Text style={styles.clearErrorsText}>Limpar</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Barra de Filtros de Pacientes para os Erros */}
        {errosDetalhados.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
            {[
              { id: 'todos', nome: 'Todos os Leitos' },
              { id: 'carlos', nome: 'Sr. Carlos' },
              { id: 'maria', nome: 'Dona Maria' },
              { id: 'roberto', nome: 'Sr. Roberto' },
              { id: 'antonio', nome: 'Sr. Antônio' },
              { id: 'elena', nome: 'Dra. Elena' },
            ].map(f => (
              <TouchableOpacity
                key={f.id}
                onPress={() => setFiltroPaciente(f.id)}
                style={[
                  styles.filterChip,
                  filtroPaciente === f.id && styles.filterChipActive
                ]}
              >
                <Text style={[
                  styles.filterChipText,
                  filtroPaciente === f.id && styles.filterChipTextActive
                ]}>
                  {f.nome}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : null}

        {/* Exibição dos Erros ou Estado Vazio */}
        {errosFiltrados.length === 0 ? (
          <View style={styles.emptyErrorsCard}>
            <CheckCircle2 color="#10B981" size={44} />
            <Text style={styles.emptyErrorsTitle}>
              {errosDetalhados.length === 0 
                ? 'Nenhum Desvio Clínico Registrado! 🏆' 
                : 'Nenhum erro para este leito selecionado!'}
            </Text>
            <Text style={styles.emptyErrorsDesc}>
              {errosDetalhados.length === 0 
                ? 'Suas condutas diagnósticas e terapêuticas foram 100% assertivas. Continue com esta excelência médica!' 
                : 'Selecione "Todos os Leitos" para visualizar outros registros.'}
            </Text>
          </View>
        ) : (
          <View style={styles.errorsList}>
            <View style={styles.summaryBar}>
              <Text style={styles.summaryText}>
                Total de <Text style={{ color: '#EF4444', fontWeight: 'bold' }}>{totalTentativasIncorretas}</Text> escolhas incorretas registradas em <Text style={{ color: '#F8FAFC', fontWeight: 'bold' }}>{errosDetalhados.length}</Text> alternativas.
              </Text>
            </View>

            {errosFiltrados.map((item) => (
              <View key={item.id} style={styles.errorCard}>
                {/* Header do Card de Erro */}
                <View style={styles.errorCardHeader}>
                  <View style={styles.errorPatientBadge}>
                    <Text style={styles.errorPatientText}>
                      {item.patientName} • {item.moduloNome}
                    </Text>
                  </View>

                  <View style={styles.errorCountBadge}>
                    <XCircle color="#EF4444" size={14} />
                    <Text style={styles.errorCountText}>
                      Errou {item.quantidadeErros} {item.quantidadeErros === 1 ? 'vez' : 'vezes'}
                    </Text>
                  </View>
                </View>

                {/* Enunciado da Pergunta */}
                <Text style={styles.errorQuestionTitle}>{item.perguntaTitulo}</Text>
                <Text style={styles.errorQuestionText}>{item.perguntaTexto}</Text>

                {/* Alternativa Incorreta Escolhida */}
                <View style={styles.chosenErrorBox}>
                  <View style={styles.boxHeaderRow}>
                    <XCircle color="#EF4444" size={16} />
                    <Text style={styles.chosenErrorLabel}>ALTERNATIVA INCORRETA ESCOLHIDA:</Text>
                  </View>
                  <Text style={styles.chosenErrorText}>{item.alternativaEscolhidaTexto}</Text>
                </View>

                {/* Alternativa Correta Esperada */}
                <View style={styles.correctAnswerBox}>
                  <View style={styles.boxHeaderRow}>
                    <CheckCircle2 color="#22C55E" size={16} />
                    <Text style={styles.correctAnswerLabel}>CONDUTA CORRETA RECOMENDADA:</Text>
                  </View>
                  <Text style={styles.correctAnswerText}>{item.alternativaCorretaTexto}</Text>
                </View>

                {/* Justificativa / Fundamentação Médica */}
                {item.explicacaoMedica ? (
                  <View style={styles.rationaleBox}>
                    <View style={styles.boxHeaderRow}>
                      <ShieldCheck color="#38BDF8" size={15} />
                      <Text style={styles.rationaleLabel}>Fundamentação Clínica:</Text>
                    </View>
                    <Text style={styles.rationaleText}>{item.explicacaoMedica}</Text>
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        )}

        {/* Status por Leito de Emergência */}
        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Status dos Leitos da Sala Vermelha</Text>
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
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  telemetryBanner: {
    backgroundColor: '#3B0764',
    borderRadius: 20,
    padding: 18,
    borderWidth: 2,
    borderColor: '#6D28D9',
    borderBottomWidth: 4,
    borderBottomColor: '#4C1D95',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
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
    backgroundColor: '#1E1B4B',
  },
  gaugePercent: {
    fontSize: 22,
    fontWeight: '900',
  },
  gaugeSub: {
    fontSize: 10,
    color: '#C4B5FD',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  telemetryInfo: {
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1.5,
    marginBottom: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  telemetryTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  telemetryDesc: {
    fontSize: 12,
    color: '#E9D5FF',
    marginTop: 2,
    lineHeight: 16,
    fontWeight: '500',
  },
  cardsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  metricCard: {
    backgroundColor: '#3B0764',
    borderRadius: 18,
    padding: 16,
    flex: 1,
    borderWidth: 2,
    borderBottomWidth: 4,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#C4B5FD',
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
    color: '#E9D5FF',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  radarCard: {
    backgroundColor: '#3B0764',
    borderRadius: 20,
    padding: 18,
    borderWidth: 2,
    borderColor: '#6D28D9',
    borderBottomWidth: 4,
    borderBottomColor: '#4C1D95',
    marginBottom: 20,
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
    fontWeight: '700',
    color: '#F3E8FF',
  },
  compPercent: {
    fontSize: 12,
    fontWeight: '900',
  },
  barTrack: {
    height: 10,
    backgroundColor: '#1E1B4B',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#4C1D95',
  },
  barFill: {
    height: '100%',
    borderRadius: 6,
  },
  errorsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  clearErrorsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1B4B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#581C87',
    borderBottomWidth: 3,
    borderBottomColor: '#0F172A',
  },
  clearErrorsText: {
    color: '#C4B5FD',
    fontSize: 11,
    fontWeight: '800',
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  filtersScroll: {
    marginBottom: 16,
  },
  filterChip: {
    backgroundColor: '#3B0764',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#581C87',
    borderBottomWidth: 3,
    borderBottomColor: '#1E1B4B',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#EF4444',
    borderColor: '#F87171',
    borderBottomColor: '#991B1B',
  },
  filterChipText: {
    color: '#C4B5FD',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  emptyErrorsCard: {
    backgroundColor: '#3B0764',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#10B981',
    borderBottomWidth: 4,
    borderBottomColor: '#047857',
    marginBottom: 20,
  },
  emptyErrorsTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 12,
    textAlign: 'center',
  },
  emptyErrorsDesc: {
    fontSize: 12,
    color: '#E9D5FF',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
    fontWeight: '500',
  },
  summaryBar: {
    backgroundColor: '#3B0764',
    padding: 12,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#6D28D9',
  },
  summaryText: {
    fontSize: 12,
    color: '#E9D5FF',
    textAlign: 'center',
    fontWeight: '600',
  },
  errorsList: {
    marginBottom: 20,
  },
  errorCard: {
    backgroundColor: '#3B0764',
    borderRadius: 20,
    padding: 16,
    borderWidth: 2,
    borderColor: '#DC2626',
    borderBottomWidth: 4,
    borderBottomColor: '#991B1B',
    marginBottom: 14,
  },
  errorCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  errorPatientBadge: {
    backgroundColor: '#1E1B4B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  errorPatientText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '800',
  },
  errorCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#450A0A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#DC2626',
  },
  errorCountText: {
    color: '#FCA5A5',
    fontSize: 11,
    fontWeight: '900',
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  errorQuestionTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  errorQuestionText: {
    fontSize: 12,
    color: '#E9D5FF',
    lineHeight: 18,
    marginBottom: 12,
    fontWeight: '500',
  },
  chosenErrorBox: {
    backgroundColor: '#450A0A',
    borderWidth: 1.5,
    borderColor: '#DC2626',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  boxHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  chosenErrorLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FCA5A5',
    letterSpacing: 0.5,
    marginLeft: 6,
  },
  chosenErrorText: {
    fontSize: 12,
    color: '#FECACA',
    lineHeight: 17,
    fontWeight: '600',
  },
  correctAnswerBox: {
    backgroundColor: '#052E16',
    borderWidth: 1.5,
    borderColor: '#16A34A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  correctAnswerLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#86EFAC',
    letterSpacing: 0.5,
    marginLeft: 6,
  },
  correctAnswerText: {
    fontSize: 12,
    color: '#DCFCE7',
    lineHeight: 17,
    fontWeight: '600',
  },
  rationaleBox: {
    backgroundColor: '#1E1B4B',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#4C1D95',
    marginTop: 4,
  },
  rationaleLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#38BDF8',
    marginLeft: 6,
    textTransform: 'uppercase',
  },
  rationaleText: {
    fontSize: 11,
    color: '#E9D5FF',
    lineHeight: 17,
    fontWeight: '500',
  },
  leitosCardContainer: {
    backgroundColor: '#3B0764',
    borderRadius: 20,
    padding: 12,
    borderWidth: 2,
    borderColor: '#6D28D9',
    borderBottomWidth: 4,
    borderBottomColor: '#4C1D95',
    marginBottom: 24,
  },
  leitoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#581C87',
  },
  leitoNumberBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#1E1B4B',
    borderWidth: 1.5,
    borderColor: '#6D28D9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  leitoNumberText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  leitoInfo: {
    flex: 1,
  },
  leitoNome: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  leitoStatus: {
    fontSize: 11,
    color: '#C4B5FD',
    marginTop: 2,
    fontWeight: '500',
  },
  leitoProgressBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leitoPercentText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#38BDF8',
    marginRight: 6,
  },
});
