export type Complexidade = 1 | 2 | 3 | 4 | 5;

export interface TriagemData {
  titulo: string;
  pergunta: string;
  opcoes: string[];
  correta: number;
  explicacao: string;
  classificacaoEsperada?: 'Vermelho' | 'Laranja' | 'Amarelo' | 'Verde';
}

export interface AnamnesePergunta {
  titulo: string;
  texto: string;
  opcoes: string[];
  correta: number;
  explicacao: string;
}

export interface AnamneseData {
  sinaisVitais: {
    pa: string;
    fc: string;
    fr: string;
    spo2: string;
    tax: string;
  };
  perguntas: AnamnesePergunta[];
}

export interface ECGData {
  achadoPrincipal: string;
  descricaoCompleta: string;
  paredeAtingida: string;
  pergunta: string;
  opcoes: string[];
  correta: number;
  explicacao: string;
  coronariaProvavel: string;
}

export interface ProtocoloData {
  titulo: string;
  cenario: string;
  pergunta: string;
  opcoes: string[];
  correta: number;
  explicacao: string;
  contraindicacoesEspecificas?: string[];
}

export interface EnzimasData {
  curvaTroponina: string;
  ckmb: string;
  outrosExames: string;
  pergunta: string;
  opcoes: string[];
  correta: number;
  explicacao: string;
}

export interface AltaData {
  orientacoes: string[];
  prescricaoSecundaria: string[];
  pergunta: string;
  opcoes: string[];
  correta: number;
  explicacao: string;
}

export interface PatientCase {
  id: string;
  nome: string;
  idade: number;
  genero: string;
  ocupacao: string;
  queixaPrincipal: string;
  tempoInicioSintomas: string;
  complexidade: Complexidade;
  corDestaque: string;
  imagemAvatar?: string;
  resumoClinico: string;
  fatoresDeRisco: string[];
  
  // As 6 Categorias de Atividades
  triagem: TriagemData;
  anamnese: AnamneseData;
  ecg: ECGData;
  protocolo: ProtocoloData;
  enzimas: EnzimasData;
  alta: AltaData;
}
