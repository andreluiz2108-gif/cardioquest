export type CategoriaDesempenho = 'reforco' | 'estavel' | 'desafio';

export interface PlayerSessionMetrics {
  patientId: string;
  moduloId: string;
  totalPerguntas: number;
  acertos: number;
  erros: number;
  tempoTotalSegundos: number;
  dicasSolicitadas: number;
  timestamp: string;
}

export interface AdaptiveEvaluationResult {
  scoreAdaptativo: number;
  acuraciaPorcentagem: number;
  tempoMedioPorPergunta: number;
  categoria: CategoriaDesempenho;
  mensagemGenio: string;
  revolucaoSugerida: {
    titulo: string;
    descricao: string;
    patientIdSugerido?: string;
    rota?: string;
  };
}

export interface LearningRecommendation {
  categoria: CategoriaDesempenho;
  titulo: string;
  descricao: string;
  dicaGenio: string;
  patientIdRecomendado: string;
  moduloRecomendadoIndex?: number;
}
