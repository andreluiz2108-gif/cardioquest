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
  Hospital, 
  ClipboardType, 
  HeartPulse, 
  Pill, 
  FlaskConical, 
  HeartHandshake, 
  Lock,
  Sparkles,
  Zap,
  ShieldCheck,
  Award,
  X,
  CheckCircle2
} from 'lucide-react-native';

interface MedalhaData {
  id: string;
  categoria: 'credenciais' | 'autonomia' | 'vidas';
  titulo: string;
  subtitulo: string;
  criterio: string;
  xpBonus: number;
  Icone: any;
  corBase: string;
  desbloqueada: boolean;
  progressoTexto: string;
}

export default function TrofeusScreen() {
  const [abaAtiva, setAbaAtiva] = useState<'credenciais' | 'autonomia' | 'vidas'>('credenciais');
  const [medalhas, setMedalhas] = useState<MedalhaData[]>([]);
  const [medalhaSelecionada, setMedalhaSelecionada] = useState<MedalhaData | null>(null);

  const carregarProgressoEMedalhas = async () => {
    try {
      // Checar módulos concluídos
      const m1 = await AsyncStorage.getItem('venceu_mod1');
      const m2 = await AsyncStorage.getItem('venceu_mod2');
      const m3 = await AsyncStorage.getItem('venceu_mod3');
      const m4 = await AsyncStorage.getItem('venceu_mod4');
      const m5 = await AsyncStorage.getItem('venceu_mod5');
      const xpRaw = await AsyncStorage.getItem('xpEnfermeiro');
      const xp = xpRaw ? parseInt(xpRaw, 10) : 0;

      // Checar prontuários zerados
      let pacientesZerados = 0;
      const ids = ['carlos', 'maria', 'roberto', 'antonio', 'elena'];
      for (const id of ids) {
        const m6 = await AsyncStorage.getItem(`venceu_mod6_paciente_${id}`);
        if (m6 === 'true') pacientesZerados++;
      }

      // Checar histórico adaptativo
      const historyRaw = await AsyncStorage.getItem('desempenho_adaptativo_historico');
      const history = historyRaw ? JSON.parse(historyRaw) : [];
      const semDicas = history.some((h: any) => h.dicasSolicitadas === 0);
      const tempoRapido = history.some((h: any) => h.tempoTotalSegundos > 0 && h.tempoTotalSegundos < 180);
      const assertividadePerfeita = history.some((h: any) => h.acertos === h.totalPerguntas && h.totalPerguntas > 0);

      const listaMedalhas: MedalhaData[] = [
        // Aba 1: Credenciais Clínicas
        {
          id: 'triagem',
          categoria: 'credenciais',
          titulo: 'Guardião da Sala Vermelha',
          subtitulo: 'Priorização de Risco',
          criterio: 'Conclua a Triagem Manchester identificando a prioridade de atendimento imediato.',
          xpBonus: 150,
          Icone: Hospital,
          corBase: '#F97316',
          desbloqueada: m1 === 'true' || pacientesZerados > 0,
          progressoTexto: m1 === 'true' || pacientesZerados > 0 ? 'Concluído' : '0/1 Concluído'
        },
        {
          id: 'anamnese',
          categoria: 'credenciais',
          titulo: 'Detetive da Anamnese',
          subtitulo: 'Sinais Vitais e Risco',
          criterio: 'Mapeie os fatores de risco coronariano e equivalente isquêmico na admissão.',
          xpBonus: 150,
          Icone: ClipboardType,
          corBase: '#3B82F6',
          desbloqueada: m2 === 'true' || pacientesZerados > 0,
          progressoTexto: m2 === 'true' || pacientesZerados > 0 ? 'Concluído' : '0/1 Concluído'
        },
        {
          id: 'ecg',
          categoria: 'credenciais',
          titulo: 'Águia do Eletrocardiograma',
          subtitulo: 'Laudo de Supra de ST',
          criterio: 'Interprete o vetor isquêmico do ECG e identifique a parede coronariana atingida.',
          xpBonus: 200,
          Icone: HeartPulse,
          corBase: '#22C55E',
          desbloqueada: m3 === 'true' || pacientesZerados > 0,
          progressoTexto: m3 === 'true' || pacientesZerados > 0 ? 'Concluído' : '0/1 Concluído'
        },
        {
          id: 'protocolo',
          categoria: 'credenciais',
          titulo: 'Especialista em Reperfusão',
          subtitulo: 'Prescrição MONABESH',
          criterio: 'Administre o protocolo farmacológico correto e respeite as contraindicações específicas.',
          xpBonus: 250,
          Icone: Pill,
          corBase: '#A855F7',
          desbloqueada: m4 === 'true' || pacientesZerados > 0,
          progressoTexto: m4 === 'true' || pacientesZerados > 0 ? 'Concluído' : '0/1 Concluído'
        },
        {
          id: 'enzimas',
          categoria: 'credenciais',
          titulo: 'Cientista dos Biomarcadores',
          subtitulo: 'Curva de Troponina',
          criterio: 'Avalie a cinética enzimática de Troponina ultrassensível para laudo confirmatório.',
          xpBonus: 200,
          Icone: FlaskConical,
          corBase: '#4F46E5',
          desbloqueada: m5 === 'true' || pacientesZerados > 0,
          progressoTexto: m5 === 'true' || pacientesZerados > 0 ? 'Concluído' : '0/1 Concluído'
        },
        {
          id: 'alta',
          categoria: 'credenciais',
          titulo: 'Excelência em Prevenção',
          subtitulo: 'Alta e Educação em Saúde',
          criterio: 'Prescreva a terapia de prevenção secundária completa na alta do leito.',
          xpBonus: 300,
          Icone: HeartHandshake,
          corBase: '#14B8A6',
          desbloqueada: pacientesZerados > 0,
          progressoTexto: pacientesZerados > 0 ? 'Concluído' : '0/1 Concluído'
        },

        // Aba 2: Autonomia & Agilidade
        {
          id: 'porta_ecg',
          categoria: 'autonomia',
          titulo: 'Porta-ECG Recorde (< 5 min)',
          subtitulo: 'Agilidade de Emergência',
          criterio: 'Conclua a triagem e interpretação inicial de emergência em ritmo ágil.',
          xpBonus: 250,
          Icone: Zap,
          corBase: '#EAB308',
          desbloqueada: tempoRapido || pacientesZerados >= 1,
          progressoTexto: tempoRapido || pacientesZerados >= 1 ? 'Concluído' : 'Aguardando Atendimento Ágil'
        },
        {
          id: 'autonomia',
          categoria: 'autonomia',
          titulo: 'Autonomia Absoluta',
          subtitulo: '0 Dicas Solicitadas',
          criterio: 'Conclua um atendimento de leito completo sem solicitar dicas do Gênio Enfermeiro.',
          xpBonus: 300,
          Icone: ShieldCheck,
          corBase: '#38BDF8',
          desbloqueada: semDicas || pacientesZerados >= 1,
          progressoTexto: semDicas || pacientesZerados >= 1 ? 'Concluído' : 'Pendente'
        },
        {
          id: 'assertividade',
          categoria: 'autonomia',
          titulo: 'Mestre da Assertividade',
          subtitulo: '100% de Acertos',
          criterio: 'Acerte todas as condutas clínicas do prontuário no primeiro intento.',
          xpBonus: 350,
          Icone: Award,
          corBase: '#EC4899',
          desbloqueada: assertividadePerfeita || pacientesZerados >= 1,
          progressoTexto: assertividadePerfeita || pacientesZerados >= 1 ? 'Concluído' : 'Pendente'
        },

        // Aba 3: Vidas Salvas & Plantão
        {
          id: 'leitos_zerados',
          categoria: 'vidas',
          titulo: 'Leitos do CTI Zerados (5/5)',
          subtitulo: 'Coleção de Prontuários',
          criterio: 'Conclua com excelência os 5 prontuários de infarto da Sala Vermelha.',
          xpBonus: 500,
          Icone: Trophy,
          corBase: '#F59E0B',
          desbloqueada: pacientesZerados >= 5,
          progressoTexto: `${pacientesZerados} / 5 Prontuários Zerados`
        },
        {
          id: 'plantonista_inabalavel',
          categoria: 'vidas',
          titulo: 'Plantonista Inabalável',
          subtitulo: 'Especialista em Cardio',
          criterio: 'Acumule mais de 500 XP em condutas clínicas de urgência.',
          xpBonus: 400,
          Icone: Sparkles,
          corBase: '#A855F7',
          desbloqueada: xp >= 500,
          progressoTexto: `${xp} / 500 XP Acumulados`
        },
        {
          id: 'lenda_cardio',
          categoria: 'vidas',
          titulo: 'Lenda do Centro Cardiológico',
          subtitulo: 'Mestre Supremo',
          criterio: 'Acumule mais de 1000 XP e torne-se referência no atendimento coronariano.',
          xpBonus: 600,
          Icone: Trophy,
          corBase: '#10B981',
          desbloqueada: xp >= 1000,
          progressoTexto: `${xp} / 1000 XP Acumulados`
        }
      ];

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
                <Text style={styles.closeModalButtonText}>Fechar Detalhes</Text>
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
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  container: {
    padding: 20,
  },
  collectionBanner: {
    backgroundColor: '#1E293B',
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#334155',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  collectionTextGroup: {
    flex: 1,
  },
  collectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  collectionSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
  collectionBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: '#2563EB',
  },
  tabText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#94A3B8',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  medalCard: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  medalTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
  },
  medalSub: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 10,
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
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
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 20,
    borderTopWidth: 6,
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
    color: '#64748B',
    letterSpacing: 0.8,
  },
  modalIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
  },
  modalSub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
  },
  criterioCard: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  criterioLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#1E3A8A',
    marginBottom: 4,
  },
  criterioText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
  },
  xpRewardBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF9C3',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FDE047',
    marginBottom: 16,
  },
  xpRewardText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#854D0E',
    marginLeft: 6,
  },
  closeModalButton: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeModalButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
