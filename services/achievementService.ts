import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  Hospital, 
  ClipboardType, 
  HeartPulse, 
  Pill, 
  FlaskConical, 
  HeartHandshake, 
  Zap, 
  ShieldCheck, 
  Award, 
  Trophy, 
  Sparkles 
} from 'lucide-react-native';

export interface MedalhaData {
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

export const MEDALHAS_BASE_CONFIG = [
  // Aba 1: Credenciais Clínicas
  {
    id: 'triagem',
    categoria: 'credenciais' as const,
    titulo: 'Guardião da Sala Vermelha',
    subtitulo: 'Priorização de Risco Manchester',
    criterio: 'Conclua a Triagem Manchester identificando a prioridade de atendimento imediato.',
    xpBonus: 150,
    Icone: Hospital,
    corBase: '#F97316',
  },
  {
    id: 'anamnese',
    categoria: 'credenciais' as const,
    titulo: 'Detetive da Anamnese',
    subtitulo: 'Sinais Vitais e Risco',
    criterio: 'Mapeie os fatores de risco coronariano e equivalente isquêmico na admissão.',
    xpBonus: 150,
    Icone: ClipboardType,
    corBase: '#3B82F6',
  },
  {
    id: 'ecg',
    categoria: 'credenciais' as const,
    titulo: 'Águia do Eletrocardiograma',
    subtitulo: 'Laudo de Supra de ST',
    criterio: 'Interprete o vetor isquêmico do ECG e identifique a parede coronariana atingida.',
    xpBonus: 200,
    Icone: HeartPulse,
    corBase: '#22C55E',
  },
  {
    id: 'protocolo',
    categoria: 'credenciais' as const,
    titulo: 'Especialista em Reperfusão',
    subtitulo: 'Prescrição MONABESH',
    criterio: 'Administre o protocolo farmacológico correto e respeite as contraindicações específicas.',
    xpBonus: 250,
    Icone: Pill,
    corBase: '#A855F7',
  },
  {
    id: 'enzimas',
    categoria: 'credenciais' as const,
    titulo: 'Cientista dos Biomarcadores',
    subtitulo: 'Curva de Troponina',
    criterio: 'Avalie a cinética enzimática de Troponina ultrassensível para laudo confirmatório.',
    xpBonus: 200,
    Icone: FlaskConical,
    corBase: '#4F46E5',
  },
  {
    id: 'alta',
    categoria: 'credenciais' as const,
    titulo: 'Excelência em Prevenção',
    subtitulo: 'Alta e Educação em Saúde',
    criterio: 'Prescreva a terapia de prevenção secundária completa na alta do leito.',
    xpBonus: 300,
    Icone: HeartHandshake,
    corBase: '#14B8A6',
  },

  // Aba 2: Autonomia & Agilidade
  {
    id: 'porta_ecg',
    categoria: 'autonomia' as const,
    titulo: 'Porta-ECG Recorde (< 5 min)',
    subtitulo: 'Agilidade de Emergência',
    criterio: 'Conclua a triagem e interpretação inicial de emergência em ritmo ágil.',
    xpBonus: 250,
    Icone: Zap,
    corBase: '#EAB308',
  },
  {
    id: 'autonomia',
    categoria: 'autonomia' as const,
    titulo: 'Autonomia Absoluta',
    subtitulo: '0 Dicas Solicitadas',
    criterio: 'Conclua um atendimento de leito completo sem solicitar dicas do Gênio Enfermeiro.',
    xpBonus: 300,
    Icone: ShieldCheck,
    corBase: '#38BDF8',
  },
  {
    id: 'assertividade',
    categoria: 'autonomia' as const,
    titulo: 'Mestre da Assertividade',
    subtitulo: '100% de Acertos',
    criterio: 'Acerte todas as condutas clínicas do prontuário no primeiro intento.',
    xpBonus: 350,
    Icone: Award,
    corBase: '#EC4899',
  },

  // Aba 3: Vidas Salvas & Plantão
  {
    id: 'leitos_zerados',
    categoria: 'vidas' as const,
    titulo: 'Leitos do CTI Zerados (5/5)',
    subtitulo: 'Coleção de Prontuários',
    criterio: 'Conclua com excelência os 5 prontuários de infarto da Sala Vermelha.',
    xpBonus: 500,
    Icone: Trophy,
    corBase: '#F59E0B',
  },
  {
    id: 'plantonista_inabalavel',
    categoria: 'vidas' as const,
    titulo: 'Plantonista Inabalável',
    subtitulo: 'Especialista em Cardio',
    criterio: 'Acumule mais de 500 XP em condutas clínicas de urgência.',
    xpBonus: 400,
    Icone: Sparkles,
    corBase: '#A855F7',
  },
  {
    id: 'lenda_cardio',
    categoria: 'vidas' as const,
    titulo: 'Lenda do Centro Cardiológico',
    subtitulo: 'Mestre Supremo',
    criterio: 'Acumule mais de 1000 XP e torne-se referência no atendimento coronariano.',
    xpBonus: 600,
    Icone: Trophy,
    corBase: '#10B981',
  }
];

const NOTIFIED_ACHIEVEMENTS_KEY = 'conquistas_desbloqueadas_notificadas';

/**
 * Avalia o estado atual de todas as conquistas a partir do AsyncStorage
 */
export async function getAllAchievementsWithStatus(): Promise<MedalhaData[]> {
  try {
    const m1 = await AsyncStorage.getItem('venceu_mod1');
    const m2 = await AsyncStorage.getItem('venceu_mod2');
    const m3 = await AsyncStorage.getItem('venceu_mod3');
    const m4 = await AsyncStorage.getItem('venceu_mod4');
    const m5 = await AsyncStorage.getItem('venceu_mod5');
    const xpRaw = await AsyncStorage.getItem('xpEnfermeiro');
    const xp = xpRaw ? parseInt(xpRaw, 10) : 0;

    let pacientesZerados = 0;
    const ids = ['carlos', 'maria', 'roberto', 'antonio', 'elena'];
    for (const id of ids) {
      const m6 = await AsyncStorage.getItem(`venceu_mod6_paciente_${id}`);
      if (m6 === 'true') pacientesZerados++;
    }

    // Checagem de qualquer módulo concluído por paciente
    let algumMod1 = m1 === 'true';
    let algumMod2 = m2 === 'true';
    let algumMod3 = m3 === 'true';
    let algumMod4 = m4 === 'true';
    let algumMod5 = m5 === 'true';

    for (const id of ids) {
      const c1 = await AsyncStorage.getItem(`venceu_mod1_paciente_${id}`);
      const c2 = await AsyncStorage.getItem(`venceu_mod2_paciente_${id}`);
      const c3 = await AsyncStorage.getItem(`venceu_mod3_paciente_${id}`);
      const c4 = await AsyncStorage.getItem(`venceu_mod4_paciente_${id}`);
      const c5 = await AsyncStorage.getItem(`venceu_mod5_paciente_${id}`);
      if (c1 === 'true') algumMod1 = true;
      if (c2 === 'true') algumMod2 = true;
      if (c3 === 'true') algumMod3 = true;
      if (c4 === 'true') algumMod4 = true;
      if (c5 === 'true') algumMod5 = true;
    }

    const historyRaw = await AsyncStorage.getItem('desempenho_adaptativo_historico');
    const history = historyRaw ? JSON.parse(historyRaw) : [];
    const semDicas = history.some((h: any) => h.dicasSolicitadas === 0);
    const tempoRapido = history.some((h: any) => h.tempoTotalSegundos > 0 && h.tempoTotalSegundos < 180);
    const assertividadePerfeita = history.some((h: any) => h.acertos === h.totalPerguntas && h.totalPerguntas > 0);

    return MEDALHAS_BASE_CONFIG.map(base => {
      let desbloqueada = false;
      let progressoTexto = 'Pendente';

      switch (base.id) {
        case 'triagem':
          desbloqueada = algumMod1 || pacientesZerados > 0;
          progressoTexto = desbloqueada ? 'Concluído' : '0/1 Concluído';
          break;
        case 'anamnese':
          desbloqueada = algumMod2 || pacientesZerados > 0;
          progressoTexto = desbloqueada ? 'Concluído' : '0/1 Concluído';
          break;
        case 'ecg':
          desbloqueada = algumMod3 || pacientesZerados > 0;
          progressoTexto = desbloqueada ? 'Concluído' : '0/1 Concluído';
          break;
        case 'protocolo':
          desbloqueada = algumMod4 || pacientesZerados > 0;
          progressoTexto = desbloqueada ? 'Concluído' : '0/1 Concluído';
          break;
        case 'enzimas':
          desbloqueada = algumMod5 || pacientesZerados > 0;
          progressoTexto = desbloqueada ? 'Concluído' : '0/1 Concluído';
          break;
        case 'alta':
          desbloqueada = pacientesZerados > 0;
          progressoTexto = desbloqueada ? 'Concluído' : '0/1 Concluído';
          break;
        case 'porta_ecg':
          desbloqueada = tempoRapido || pacientesZerados >= 1;
          progressoTexto = desbloqueada ? 'Concluído' : 'Aguardando Atendimento Ágil';
          break;
        case 'autonomia':
          desbloqueada = semDicas || pacientesZerados >= 1;
          progressoTexto = desbloqueada ? 'Concluído' : 'Pendente';
          break;
        case 'assertividade':
          desbloqueada = assertividadePerfeita || pacientesZerados >= 1;
          progressoTexto = desbloqueada ? 'Concluído' : 'Pendente';
          break;
        case 'leitos_zerados':
          desbloqueada = pacientesZerados >= 5;
          progressoTexto = `${pacientesZerados} / 5 Prontuários Zerados`;
          break;
        case 'plantonista_inabalavel':
          desbloqueada = xp >= 500;
          progressoTexto = `${xp} / 500 XP Acumulados`;
          break;
        case 'lenda_cardio':
          desbloqueada = xp >= 1000;
          progressoTexto = `${xp} / 1000 XP Acumulados`;
          break;
      }

      return {
        ...base,
        desbloqueada,
        progressoTexto
      };
    });
  } catch (e) {
    console.error('Erro ao avaliar conquistas:', e);
    return [];
  }
}

/**
 * Checa se novas conquistas foram desbloqueadas e ainda não foram notificadas ao usuário.
 * Atualiza o registro no AsyncStorage e retorna a lista de novas conquistas para animação.
 */
export async function checkAndUnlockNewAchievements(): Promise<MedalhaData[]> {
  try {
    const todas = await getAllAchievementsWithStatus();
    const desbloqueadasAtuais = todas.filter(m => m.desbloqueada);

    const notifiedRaw = await AsyncStorage.getItem(NOTIFIED_ACHIEVEMENTS_KEY);
    const notifiedIds: string[] = notifiedRaw ? JSON.parse(notifiedRaw) : [];

    const novas = desbloqueadasAtuais.filter(m => !notifiedIds.includes(m.id));

    if (novas.length > 0) {
      const updatedNotified = Array.from(new Set([...notifiedIds, ...novas.map(n => n.id)]));
      await AsyncStorage.setItem(NOTIFIED_ACHIEVEMENTS_KEY, JSON.stringify(updatedNotified));
    }

    return novas;
  } catch (e) {
    console.error('Erro ao verificar novas conquistas:', e);
    return [];
  }
}
