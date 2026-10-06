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

export interface QuestionErrorRecord {
  id: string; // Identificador único: `${patientId}_${moduloId}_${perguntaIndex}_${alternativaEscolhidaIndex}`
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
  quantidadeErros: number; // Quantas vezes errou essa alternativa específica
  ultimoErroTimestamp: string;
}

