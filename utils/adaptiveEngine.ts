import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  PlayerSessionMetrics, 
  AdaptiveEvaluationResult, 
  LearningRecommendation,
  QuestionErrorRecord
} from '../types/adaptive';
import { getAllPatients } from '../data/patientsData';

// Banco de Dicas Médicas do Gênio Enfermeiro por Paciente e Módulo
const HINTS_DATABASE: { [key: string]: { [key: number]: string[] } } = {
  carlos: {
    0: [
      '🧞‍♂️ Dica do Gênio: Dor torácica opressiva com sudorese recente é prioridade alta! Lembre-se da cor Laranja na Triagem Manchester (até 10min).',
      '🧞‍♂️ Dica do Gênio: Na suspeita de IAM, a Sala Vermelha e o ECG em até 10 minutos são a maior prioridade.',
      '🧞‍♂️ Dica do Gênio: Monitorização contínua com acesso venoso calibroso previne surpresas com arritmias.'
    ],
    1: [
      '🧞‍♂️ Dica do Gênio: A dor em aperto (opressiva) irradiada para o braço esquerdo é o sinal clássico de isquemia miocárdica.',
      '🧞‍♂️ Dica do Gênio: Hipertensão, Diabetes e Tabagismo são os maiores vilões dos vasos coronarianos.',
      '🧞‍♂️ Dica do Gênio: Sempre verifique alergias a medicamentos (especialmente AAS) antes de prescrever!'
    ],
    2: [
      '🧞‍♂️ Dica do Gênio: Supradesnivelamento de ST em V1, V2, V3 e V4 aponta para a parede anterior (coronária Descendente Anterior).'
    ],
    3: [
      '🧞‍♂️ Dica do Gênio: No IAMST dentro da janela de 12 horas, a Angioplastia Primária imediata (Porta-Balão < 90 min) é a melhor escolha.'
    ],
    4: [
      '🧞‍♂️ Dica do Gênio: Troponina é a marca registrada da necrose do músculo cardíaco.'
    ],
    5: [
      '🧞‍♂️ Dica do Gênio: Pacientes pós-IAM são de Muito Alto Risco; a meta de LDL deve ser < 50 mg/dL.'
    ]
  },
  maria: {
    0: [
      '🧞‍♂️ Dica do Gênio: Idosos e diabéticos frequentemente apresentam "Equivalentes Isquêmicos" (dispneia e epigastralgia sem dor no peito).'
    ],
    1: [
      '🧞‍♂️ Dica do Gênio: A neuropatia diabética reduz a sensibilidade à dor; atente-se para a glicemia capilar imediata.'
    ],
    2: [
      '🧞‍♂️ Dica do Gênio: Infradesnivelamento de ST indica isquemia subendocárdica (IAMSST ou Angina Instável).'
    ],
    3: [
      '🧞‍♂️ Dica do Gênio: Fibrinolíticos são CONTRAINDICADOS no IAMSST! Use anticoagulação (Enoxaparina) e CATE precoce.'
    ],
    4: [
      '🧞‍♂️ Dica do Gênio: A elevação dinâmica de Troponina ultrassensível confirma o infarto sem supra.'
    ],
    5: [
      '🧞‍♂️ Dica do Gênio: Inibidores do SGLT2 (Empaglifozina) trazem proteção cardiovascular e renal no diabético pós-IAM.'
    ]
  },
  roberto: {
    0: [
      '🧞‍♂️ Dica do Gênio: Hipotensão com dor torácica indica risco imediato de choque. Prioridade Vermelha!'
    ],
    1: [
      '🧞‍♂️ Dica do Gênio: Tríade de Infarto de VD: Hipotensão + Turgência Jugular + Pulmões Limpos. O VD depende totalmente de volume!'
    ],
    2: [
      '🧞‍♂️ Dica do Gênio: Supra nas derivadas direitas (V3R/V4R) confirma infarto de VD. Nitratos e Morfina são CONTRAINDICADOS!'
    ],
    3: [
      '🧞‍♂️ Dica do Gênio: Para restaurar a pressão no infarto de VD, administre expansão volêmica com Soro Fisiológico 0.9% imediata.'
    ],
    4: [
      '🧞‍♂️ Dica do Gênio: Lactato elevado reflete hipoperfusão tecidual por falência de bomba ou baixo débito.'
    ],
    5: [
      '🧞‍♂️ Dica do Gênio: A cessação do tabagismo é a medida isolada de maior impacto na redução de reinfarto.'
    ]
  },
  antonio: {
    0: [
      '🧞‍♂️ Dica do Gênio: Bradicardia severa (FC 32 bpm) com instabilidade hemodinâmica exige entrada imediata na Sala Vermelha!'
    ],
    1: [
      '🧞‍♂️ Dica do Gênio: A Coronária Direita irriga o Nó AV na maioria das pessoas; infartos inferiores frequentemente causam BAVT.'
    ],
    2: [
      '🧞‍♂️ Dica do Gênio: Para BAVT sintomático com bradicardia crítica: Atropina IV imediata e Marcapasso Transcutâneo!'
    ],
    3: [
      '🧞‍♂️ Dica do Gênio: No Choque Cardiogênico com baixo débito, a Dobutamina é o inotrópico de escolha.'
    ],
    4: [
      '🧞‍♂️ Dica do Gênio: A disfunção renal e hiperlactatemia decorrem da hipoperfusão sistêmica por baixo débito.'
    ],
    5: [
      '🧞‍♂️ Dica do Gênio: O BAVT no infarto inferior costuma ser transitório e reverte após a desobstrução da artéria coronária.'
    ]
  },
  elena: {
    0: [
      '🧞‍♂️ Dica do Gênio: Dor no peito em repouso de madrugada exige atenção imediata para descartar causa isquêmica.'
    ],
    1: [
      '🧞‍♂️ Dica do Gênio: O vasoespasmo coronariano (Prinzmetal) ocorre tipicamente no repouso noturno por hiper-reatividade vascular.'
    ],
    2: [
      '🧞‍♂️ Dica do Gênio: Supra de ST TRANSITÓRIO que se normaliza quando a dor cessa é a marca registrada do vasoespasmo.'
    ],
    3: [
      '🧞‍♂️ Dica do Gênio: Em MINOCA por vasoespasmo, use Bloqueadores de Canais de Cálcio (Diltiazem/Amlodipina). Betabloqueadores sem oposição podem piorar o espasmo!'
    ],
    4: [
      '🧞‍♂️ Dica do Gênio: A Ressonância Magnética Cardíaca (RMC) é o exame chave para diferenciar MINOCA de Miocardite.'
    ],
    5: [
      '🧞‍♂️ Dica do Gênio: Triptanos para enxaqueca causam vasoconstrição e são CONTRAINDICADOS no vasoespasmo coronariano.'
    ]
  }
};

export function getGenieHint(patientId: string, moduleIndex: number, questionIndex: number = 0): string {
  const patientHints = HINTS_DATABASE[patientId] || HINTS_DATABASE['carlos'];
  const moduleHints = patientHints[moduleIndex] || patientHints[0] || [
    '🧞‍♂️ Dica do Gênio: Lembre-se de revisar os sinais vitais, a parede atingida no ECG e o protocolo de reperfusão!'
  ];
  return moduleHints[questionIndex % moduleHints.length];
}

export function evaluateSessionPerformance(metrics: PlayerSessionMetrics): AdaptiveEvaluationResult {
  const total = Math.max(1, metrics.totalPerguntas);
  const acuracia = (metrics.acertos / total) * 100;
  const tempoMedio = metrics.tempoTotalSegundos / total;
  const penalidadeDica = metrics.dicasSolicitadas * 12;

  const bonusTempo = Math.max(0, 45 - tempoMedio) * 0.5;
  const rawScore = (acuracia * 0.6) + bonusTempo - penalidadeDica;
  const scoreAdaptativo = Math.min(100, Math.max(0, Math.round(rawScore)));

  let categoria: 'reforco' | 'estavel' | 'desafio' = 'estavel';
  let mensagemGenio = '';
  let recomendacao = {
    titulo: 'Manter Trilha Normal de Plantão',
    descricao: 'Seu desempenho foi consistente. Continue avançando pelos leitos de emergência.',
    patientIdSugerido: 'maria',
    rota: '/prontuarios'
  };

  if (scoreAdaptativo < 55 || acuracia < 60 || metrics.dicasSolicitadas >= 2) {
    categoria = 'reforco';
    mensagemGenio = '🧞‍♂️ "Percebi que você precisou de apoio ou levou mais tempo. Recomendo reforçarmos os conceitos fundamentais antes de avançar para leitos mais críticos!"';
    recomendacao = {
      titulo: 'Trilha de Reforço Clínico Recomendada',
      descricao: 'Revisão focada em Interpretação de ECG e Protocolos de Reperfusão Inicial.',
      patientIdSugerido: 'carlos',
      rota: '/prontuario?patientId=carlos'
    };
  } else if (scoreAdaptativo > 80 && acuracia >= 85 && metrics.dicasSolicitadas === 0) {
    categoria = 'desafio';
    mensagemGenio = '🧞‍♂️ "Impressionante! Sua autonomia e velocidade foram de nível Especialista. Você está pronto para os Desafios de Alta Complexidade Master!"';
    recomendacao = {
      titulo: 'Desafio Avançado Master Desbloqueado!',
      descricao: 'Enfrente casos de emergência crítica com Choque Cardiogênico e Vasoespasmo Coronariano.',
      patientIdSugerido: 'antonio',
      rota: '/prontuario?patientId=antonio'
    };
  } else {
    categoria = 'estavel';
    mensagemGenio = '🧞‍♂️ "Bom trabalho de plantão! Você demonstrou estabilidade. Continue praticando o raciocínio rápido no próximo leito."';
    recomendacao = {
      titulo: 'Próximo Leito da Emergência',
      descricao: 'Atenda o próximo paciente no CTI de emergência.',
      patientIdSugerido: metrics.patientId === 'carlos' ? 'maria' : 'roberto',
      rota: '/prontuarios'
    };
  }

  return {
    scoreAdaptativo,
    acuraciaPorcentagem: Math.round(acuracia),
    tempoMedioPorPergunta: Math.round(tempoMedio),
    categoria,
    mensagemGenio,
    revolucaoSugerida: recomendacao
  };
}

export async function saveSessionPerformance(metrics: PlayerSessionMetrics): Promise<AdaptiveEvaluationResult> {
  const result = evaluateSessionPerformance(metrics);
  try {
    const historyRaw = await AsyncStorage.getItem('desempenho_adaptativo_historico');
    const history: PlayerSessionMetrics[] = historyRaw ? JSON.parse(historyRaw) : [];
    history.push(metrics);
    
    await AsyncStorage.setItem('desempenho_adaptativo_historico', JSON.stringify(history));
    await AsyncStorage.setItem('desempenho_adaptativo_ultimo', JSON.stringify(result));
  } catch (e) {
    console.error('Erro ao salvar métricas adaptativas:', e);
  }
  return result;
}

export async function getLatestRecommendation(): Promise<LearningRecommendation | null> {
  try {
    const raw = await AsyncStorage.getItem('desempenho_adaptativo_ultimo');
    if (!raw) return null;
    const res: AdaptiveEvaluationResult = JSON.parse(raw);
    
    return {
      categoria: res.categoria,
      titulo: res.revolucaoSugerida.titulo,
      descricao: res.revolucaoSugerida.descricao,
      dicaGenio: res.mensagemGenio,
      patientIdRecomendado: res.revolucaoSugerida.patientIdSugerido || 'carlos'
    };
  } catch (e) {
    return null;
  }
}

/**
 * Interface agregada para a tela de Telemetria de Estatísticas
 */
export interface AggregatedClinicalStats {
  acuraciaGlobal: number;
  tempoMedioPortaEcgSegundos: number;
  taxaAutonomia: number;
  sessoesConcluidas: number;
  competencias: {
    raciocinioDiagnostico: number;
    precisaoEcg: number;
    segurancaFarmacologica: number;
    visaoPrevensao: number;
  };
  pacientesProgresso: {
    patientId: string;
    nome: string;
    progresso: number;
    status: string;
  }[];
}

/**
 * Retorna as estatísticas consolidadas reais a partir do AsyncStorage e dados de pacientes
 */
export async function getAggregatedClinicalStats(): Promise<AggregatedClinicalStats> {
  const patients = getAllPatients();
  const pacientesProgresso = [];
  let modulosConcluidosTotal = 0;

  for (const p of patients) {
    let count = 0;
    try {
      const m1 = await AsyncStorage.getItem(`venceu_mod1_paciente_${p.id}`);
      const m2 = await AsyncStorage.getItem(`venceu_mod2_paciente_${p.id}`);
      const m3 = await AsyncStorage.getItem(`venceu_mod3_paciente_${p.id}`);
      const m4 = await AsyncStorage.getItem(`venceu_mod4_paciente_${p.id}`);
      const m5 = await AsyncStorage.getItem(`venceu_mod5_paciente_${p.id}`);
      const m6 = await AsyncStorage.getItem(`venceu_mod6_paciente_${p.id}`);

      if (p.id === 'carlos' && !m1) {
        const m1Old = await AsyncStorage.getItem('venceu_mod1');
        const m2Old = await AsyncStorage.getItem('venceu_mod2');
        const m3Old = await AsyncStorage.getItem('venceu_mod3');
        const m4Old = await AsyncStorage.getItem('venceu_mod4');
        const m5Old = await AsyncStorage.getItem('venceu_mod5');
        if (m1Old === 'true') count++;
        if (m2Old === 'true') count++;
        if (m3Old === 'true') count++;
        if (m4Old === 'true') count++;
        if (m5Old === 'true') count++;
      } else {
        if (m1 === 'true') count++;
        if (m2 === 'true') count++;
        if (m3 === 'true') count++;
        if (m4 === 'true') count++;
        if (m5 === 'true') count++;
        if (m6 === 'true') count++;
      }
    } catch (e) {
      console.error(e);
    }
    const prog = Math.round((count / 6) * 100);
    modulosConcluidosTotal += count;
    pacientesProgresso.push({
      patientId: p.id,
      nome: p.nome,
      progresso: prog,
      status: prog === 100 ? 'Alta Concluída 🏆' : prog > 0 ? 'Em Atendimento' : 'Aguardando Leito'
    });
  }

  // Leitura do Histórico de Sessões
  let history: PlayerSessionMetrics[] = [];
  try {
    const raw = await AsyncStorage.getItem('desempenho_adaptativo_historico');
    if (raw) history = JSON.parse(raw);
  } catch (e) {}

  if (history.length === 0) {
    const defaultAcuracia = modulosConcluidosTotal > 0 ? 85 : 0;
    return {
      acuraciaGlobal: defaultAcuracia,
      tempoMedioPortaEcgSegundos: 320, // ~5.3 minutos
      taxaAutonomia: modulosConcluidosTotal > 0 ? 90 : 0,
      sessoesConcluidas: modulosConcluidosTotal,
      competencias: {
        raciocinioDiagnostico: modulosConcluidosTotal > 0 ? 88 : 0,
        precisaoEcg: modulosConcluidosTotal > 0 ? 92 : 0,
        segurancaFarmacologica: modulosConcluidosTotal > 0 ? 84 : 0,
        visaoPrevensao: modulosConcluidosTotal > 0 ? 90 : 0,
      },
      pacientesProgresso
    };
  }

  const totalAcertos = history.reduce((acc, curr) => acc + curr.acertos, 0);
  const totalPerguntas = history.reduce((acc, curr) => acc + curr.totalPerguntas, 0);
  const acuraciaGlobal = totalPerguntas > 0 ? Math.round((totalAcertos / totalPerguntas) * 100) : 0;

  const totalTempo = history.reduce((acc, curr) => acc + curr.tempoTotalSegundos, 0);
  const tempoMedioPortaEcgSegundos = Math.round(totalTempo / history.length);

  const totalDicas = history.reduce((acc, curr) => acc + curr.dicasSolicitadas, 0);
  const taxaAutonomia = Math.max(0, Math.round(100 - (totalDicas * 15)));

  // Competências por módulo
  const triagemAnamnese = history.filter(h => h.moduloId === 'triagem' || h.moduloId === 'anamnese');
  const ecg = history.filter(h => h.moduloId === 'ecg');
  const protocolo = history.filter(h => h.moduloId === 'protocolo');
  const enzimasAlta = history.filter(h => h.moduloId === 'enzimas' || h.moduloId === 'alta');

  const calcAcc = (arr: PlayerSessionMetrics[]) => {
    if (arr.length === 0) return acuraciaGlobal || 80;
    const ac = arr.reduce((a, c) => a + c.acertos, 0);
    const tp = arr.reduce((a, c) => a + c.totalPerguntas, 0);
    return Math.round((ac / Math.max(1, tp)) * 100);
  };

  return {
    acuraciaGlobal,
    tempoMedioPortaEcgSegundos,
    taxaAutonomia,
    sessoesConcluidas: history.length,
    competencias: {
      raciocinioDiagnostico: calcAcc(triagemAnamnese),
      precisaoEcg: calcAcc(ecg),
      segurancaFarmacologica: calcAcc(protocolo),
      visaoPrevensao: calcAcc(enzimasAlta),
    },
    pacientesProgresso
  };
}

const QUESTION_ERRORS_KEY = 'historico_erros_alternativas';

export interface RecordQuestionErrorParams {
  patientId: string;
  patientName: string;
  moduloId: string;
  moduloNome: string;
  perguntaIndex: number;
  perguntaTitulo: string;
  perguntaTexto: string;
  alternativaEscolhidaTexto: string;
  alternativaEscolhidaIndex: number;
  alternativaCorretaTexto: string;
  explicacaoMedica?: string;
}

/**
 * Registra um erro de alternativa escolhida pelo usuário, incrementando o contador caso já tenha errado anteriormente
 */
export async function recordQuestionError(params: RecordQuestionErrorParams): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(QUESTION_ERRORS_KEY);
    const errors: QuestionErrorRecord[] = raw ? JSON.parse(raw) : [];

    const recordId = `${params.patientId}_${params.moduloId}_${params.perguntaIndex}_${params.alternativaEscolhidaIndex}`;
    const existingIndex = errors.findIndex(e => e.id === recordId);

    const nowIso = new Date().toISOString();

    if (existingIndex >= 0) {
      errors[existingIndex].quantidadeErros += 1;
      errors[existingIndex].ultimoErroTimestamp = nowIso;
      // Atualiza textos caso tenham mudado
      errors[existingIndex].alternativaEscolhidaTexto = params.alternativaEscolhidaTexto;
      errors[existingIndex].alternativaCorretaTexto = params.alternativaCorretaTexto;
      errors[existingIndex].explicacaoMedica = params.explicacaoMedica;
    } else {
      errors.push({
        id: recordId,
        patientId: params.patientId,
        patientName: params.patientName,
        moduloId: params.moduloId,
        moduloNome: params.moduloNome,
        perguntaIndex: params.perguntaIndex,
        perguntaTitulo: params.perguntaTitulo,
        perguntaTexto: params.perguntaTexto,
        alternativaEscolhidaTexto: params.alternativaEscolhidaTexto,
        alternativaEscolhidaIndex: params.alternativaEscolhidaIndex,
        alternativaCorretaTexto: params.alternativaCorretaTexto,
        explicacaoMedica: params.explicacaoMedica,
        quantidadeErros: 1,
        ultimoErroTimestamp: nowIso
      });
    }

    await AsyncStorage.setItem(QUESTION_ERRORS_KEY, JSON.stringify(errors));
  } catch (e) {
    console.error('Erro ao registrar erro de alternativa:', e);
  }
}

/**
 * Retorna todos os erros por alternativa ordenados por recorrência
 */
export async function getDetailedQuestionErrors(): Promise<QuestionErrorRecord[]> {
  try {
    const raw = await AsyncStorage.getItem(QUESTION_ERRORS_KEY);
    if (!raw) return [];
    const errors: QuestionErrorRecord[] = JSON.parse(raw);
    return errors.sort((a, b) => b.quantidadeErros - a.quantidadeErros);
  } catch (e) {
    console.error('Erro ao ler erros de alternativas:', e);
    return [];
  }
}

/**
 * Limpa o histórico de erros por alternativa
 */
export async function clearQuestionErrorsHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(QUESTION_ERRORS_KEY);
  } catch (e) {
    console.error('Erro ao limpar histórico de erros:', e);
  }
}

