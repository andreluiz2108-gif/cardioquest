import '../models/caso_clinico.dart';
import '../theme/cardio_theme.dart';

/// Repositório de Questionários e Desafios Clínicos Dinâmicos por Paciente
class QuestionariosData {
  /// 1. MÓDULO 1: TRIAGEM CLÍNICA (MANCHESTER)
  static List<Map<String, dynamic>> obterPerguntasTriagem(CasoClinico caso) {
    switch (caso.id) {
      case 'caso_2': // Dona Maria da Graça (58a - IAM sem Supra / Equivalente Isquêmico)
        return [
          {
            'titulo': 'ETAPA 1: CLASSIFICAÇÃO DE RISCO • ${caso.nome.toUpperCase()}',
            'texto': 'Dona Maria (58 anos, diabética) refere desconforto epigástrico e cansaço aos mínimos esforços iniciado há 3 horas, sem dor típica em aperto.\n\nQual a classificação de risco adequada pelo Protocolo de Manchester para este equivalente isquêmico?',
            'opcoes': [
              'Emergência (0 min) - Vermelho',
              'Muito Urgente (10 min) - Laranja',
              'Urgente (60 min) - Amarelo',
              'Pouco Urgente (120 min) - Verde',
              'Não Urgente (240 min) - Azul'
            ],
            'correta': 1,
            'usarCores': true,
          },
          {
            'titulo': 'ETAPA 2: CONDUTA DE TRIAGEM EM DIABÉTICOS',
            'texto': 'Equivalentes isquêmicos (dor atípica/epigástrica em mulheres e diabéticos) possuem alto risco de atraso diagnóstico.\n\nQual a conduta imediata na sala de triagem?',
            'opcoes': [
              'Encaminhar para consulta ambulatorial de gastroenterologia.',
              'Acomodar em leito de monitorização e realizar ECG em até 10 minutos.',
              'Prescrever antiácido e aguardar 2 horas na recepção.',
              'Liberar para domicílio após verificar sinais vitais basais.'
            ],
            'correta': 1,
            'usarCores': false,
          },
          {
            'titulo': 'ETAPA 3: MONITORIZAÇÃO INICIAL',
            'texto': 'A paciente está alocada na Unidade Semi-Intensiva (Leito 06).\n\nQuais medidas de enfermagem devem ser instituídas de imediato?',
            'opcoes': [
              'Apenas teste de glicemia capilar.',
              'Monitorização multiparamétrica contínua (ECG, PA, SpO2) e punção de acesso venoso periférico calibroso.',
              'Aplicação de bolsa térmica no abdome.',
              'Inalação com broncodilatador sem monitorização cardíaca.'
            ],
            'correta': 1,
            'usarCores': false,
          }
        ];

      case 'caso_3': // Lucas Almeida (34a - Miopericardite Aguda)
        return [
          {
            'titulo': 'ETAPA 1: CLASSIFICAÇÃO DE RISCO • ${caso.nome.toUpperCase()}',
            'texto': 'Lucas (34 anos) apresenta dor torácica aguda em pontada com atrito pericárdico à ausculta, que piora ao deitar e melhora ao inclinar o tronco para a frente.\n\nQual a prioridade no Protocolo de Manchester?',
            'opcoes': [
              'Emergência (0 min) - Vermelho',
              'Muito Urgente (10 min) - Laranja',
              'Urgente (60 min) - Amarelo',
              'Pouco Urgente (120 min) - Verde',
              'Não Urgente (240 min) - Azul'
            ],
            'correta': 1,
            'usarCores': true,
          },
          {
            'titulo': 'ETAPA 2: INVESTIGAÇÃO INICIAL DE PERICARDITE',
            'texto': 'Na suspeita de miopericardite aguda em jovem adulto, qual exame prioritário deve ser realizado nos primeiros 10 minutos?',
            'opcoes': [
              'Eletrocardiograma de 12 derivações para avaliar alterações de ST e PR.',
              'Tomografia de crânio com contraste.',
              'Endoscopia digestiva alta de urgência.',
              'Radiografia de coluna torácica.'
            ],
            'correta': 0,
            'usarCores': false,
          },
          {
            'titulo': 'ETAPA 3: POSICIONAMENTO E CONFORTO',
            'texto': 'O paciente relata forte alívio da dor na posição sentada com inclinação do tronco para a frente (prece maometana).\n\nQual a conduta da equipe de enfermagem?',
            'opcoes': [
              'Obrigar o paciente a deitar em decúbito dorsal horizontal estrito.',
              'Permitir o posicionamento antálgico de conforto enquanto mantém monitorização e acesso venoso.',
              'Administrar relaxante muscular e solicitar tração lombar.',
              'Interromper a monitorização para o paciente caminhar.'
            ],
            'correta': 1,
            'usarCores': false,
          }
        ];

      case 'caso_4': // Dona Helena Souza (71a - Edema Agudo de Pulmão)
        return [
          {
            'titulo': 'ETAPA 1: CLASSIFICAÇÃO DE RISCO • ${caso.nome.toUpperCase()}',
            'texto': 'Dona Helena (71 anos) chega à emergência com dispneia intensa em repouso, escarro róseo espumoso, PA 180/110 mmHg, FC 132 bpm e SpO2 84% em ar ambiente.\n\nQual a classificação de risco no Protocolo de Manchester?',
            'opcoes': [
              'Emergência (0 min) - Vermelho',
              'Muito Urgente (10 min) - Laranja',
              'Urgente (60 min) - Amarelo',
              'Pouco Urgente (120 min) - Verde',
              'Não Urgente (240 min) - Azul'
            ],
            'correta': 0,
            'usarCores': true,
          },
          {
            'titulo': 'ETAPA 2: MANEJO IMEDIATO NO EDEMA AGUDO DE PULMÃO',
            'texto': 'Paciente em insuficiência respiratória aguda hipoxêmica e congestão pulmonar grave.\n\nQual o primeiro cuidado imediato de enfermagem na Sala Vermelha?',
            'opcoes': [
              'Manter cabeceira elevada a 45°-90°, suporte de O2/VNI imediato e monitorização contínua.',
              'Colocar paciente em posição de Trendelenburg com pernas elevadas.',
              'Administrar 1000 mL de Soro Fisiológico 0.9% em infusão rápida.',
              'Aguardar o resultado dos exames laboratoriais antes de ofertar oxigênio.'
            ],
            'correta': 0,
            'usarCores': false,
          },
          {
            'titulo': 'ETAPA 3: ACESSO E SUPORTE HEMODINÂMICO',
            'texto': 'Com a paciente em Ventilação Não-Invasiva (VNI/CPAP), qual ação deve ser sincronizada com a prescrição médica de emergência?',
            'opcoes': [
              'Punção venosa calibrosa para administração de diurético de alça (Furosemida IV) e vasodilatador.',
              'Coleta de fezes para pesquisa de parasitas.',
              'Transferência imediata para enfermaria comum.',
              'Retirada do oxigênio para teste de respiração espontânea.'
            ],
            'correta': 0,
            'usarCores': false,
          }
        ];

      case 'caso_1': // Sr. Carlos Mendes (62a - IAMCSST)
      default:
        return [
          {
            'titulo': 'ETAPA 1: CLASSIFICAÇÃO DE RISCO • ${caso.nome.toUpperCase()}',
            'texto': 'Sr. Carlos (62 anos) relata dor torácica opressiva (9/10) em aperto há 40 minutos com irradiação para mandíbula e MSE, palidez e sudorese fria.\n\nQual a classificação de risco pelo Protocolo de Manchester?',
            'opcoes': [
              'Emergência (0 min) - Vermelho',
              'Muito Urgente (10 min) - Laranja',
              'Urgente (60 min) - Amarelo',
              'Pouco Urgente (120 min) - Verde',
              'Não Urgente (240 min) - Azul'
            ],
            'correta': 0,
            'usarCores': true,
          },
          {
            'titulo': 'ETAPA 2: CONDUTA IMEDIATA NA SALA VERMELHA',
            'texto': 'Classificação Vermelha (Emergência) confirmada no Leito 02!\n\nQual deve ser a PRIMEIRA ação de enfermagem?',
            'opcoes': [
              'Pedir ao paciente para aguardar sentado na recepção.',
              'Encaminhar para a sala de emergência e solicitar ECG em até 10 minutos.',
              'Aferir apenas a temperatura e dar um analgésico simples.',
              'Preencher o registro burocrático completo antes de acionar a equipe.'
            ],
            'correta': 1,
            'usarCores': false,
          },
          {
            'titulo': 'ETAPA 3: MONITORIZAÇÃO CONTÍNUA',
            'texto': 'O paciente está na sala de emergência aguardando a realização do ECG de 12 derivações.\n\nAlém do traçado, qual a monitorização prioritária?',
            'opcoes': [
              'Apenas frequência cardíaca.',
              'Medição da glicemia capilar isolada.',
              'Monitorização contínua (Sinais Vitais, Oximetria e Acesso Venoso Calibroso).',
              'Apenas a pressão arterial a cada 30 minutos.'
            ],
            'correta': 2,
            'usarCores': false,
          }
        ];
    }
  }

  /// 2. MÓDULO 2: ANAMNESE DIRECIONADA
  static List<Map<String, dynamic>> obterPerguntasAnamnese(CasoClinico caso) {
    switch (caso.id) {
      case 'caso_2': // Dona Maria da Graça
        return [
          {
            'titulo': 'PASSO 1: CARACTERIZAÇÃO DO EQUIVALENTE ISQUÊMICO',
            'texto': 'Dona Maria descreve desconforto epigástrico, náuseas e cansaço desproporcional. Por que pacientes diabéticos e mulheres idosas frequentemente apresentam este padrão atípico?',
            'opcoes': [
              'Devido à neuropatia autonômica diabética e alterações hormonais que atenuam a percepção de dor típica em aperto.',
              'Porque o coração de mulheres não possui inervação simpática.',
              'Por se tratar exclusivamente de gastrite medicamentosa.',
              'Porque a isquemia coronariana nunca acomete a parede inferior ou lateral em mulheres.'
            ],
            'correta': 0,
          },
          {
            'titulo': 'PASSO 2: FATORES DE RISCO EM DIABETES',
            'texto': 'Na anamnese direcionada de Dona Maria, quais fatores agravam severamente o risco de Síndrome Coronariana Aguda sem Supra de ST (IAMSSST)?',
            'opcoes': [
              'Controle glicêmico inadequado (HbA1c elevada), hipertensão arterial associada e dislipidemia.',
              'Histórico de rinite alérgica na infância.',
              'Uso prévio de protetor solar diário.',
              'Consumo moderado de água mineral.'
            ],
            'correta': 0,
          },
          {
            'titulo': 'PASSO 3: SEGURANÇA E ANTIDIABÉTICOS',
            'texto': 'Na investigação de medicamentos em uso, por que é fundamental identificar o uso de Metformina e anticoagulantes prévios antes de eventual cateterismo cardíaco com contraste?',
            'opcoes': [
              'Para planejar a suspensão temporária da Metformina visando prevenir acidose lática e nefropatia induzida por contraste.',
              'Porque a Metformina neutraliza a ação da Aspirina.',
              'Apenas para checar o valor do medicamento no SUS.',
              'Não há nenhuma relevância farmacológica.'
            ],
            'correta': 0,
          }
        ];

      case 'caso_3': // Lucas Almeida
        return [
          {
            'titulo': 'PASSO 1: PADRÃO DA DOR PERICÁRDICA',
            'texto': 'Lucas relata dor torácica que piora ao tossir, respirar fundo ou deitar em decúbito dorsal. Como se diferencia a dor pleurítica/pericárdica da dor isquêmica coronariana clássica?',
            'opcoes': [
              'A dor pericárdica é ventilatório-dependente e postural, enquanto a dor isquêmica é em peso/aperto com pouca variação postural.',
              'A dor isquêmica sempre melhora com a respiração profunda.',
              'Não existe diferença clínica entre as duas entidades.',
              'A dor pericárdica ocorre apenas no abdome inferior.'
            ],
            'correta': 0,
          },
          {
            'titulo': 'PASSO 2: GATILHOS E HISTÓRICO RECENTE',
            'texto': 'Durante a anamnese de Lucas, ele relata infecção viral de vias aéreas há 10 dias e uso excessivo de energéticos. Qual a relevância desse dado?',
            'opcoes': [
              'Infecções virais recentes (Enterovírus, Coxsackie, Influenza) são os principais agentes etiológicos de pericardite/miopericardite aguda.',
              'Gripes recentes descartam qualquer acometimento cardíaco.',
              'Energéticos anulam completamente os efeitos de infecções cardíacas.',
              'Indica que o quadro é exclusivamente pneumonia bacteriana.'
            ],
            'correta': 0,
          },
          {
            'titulo': 'PASSO 3: SINAIS DE ALARME PARA TAMPONAMENTO',
            'texto': 'Qual pergunta ou sinal deve ser ativamente pesquisado para descartar Tamponamento Cardíaco iminente (Tríade de Beck)?',
            'opcoes': [
              'Presença de hipotensão severa, turgência jugular patológica e abafamento de bulhas cardíacas.',
              'Febre baixa isolada sem repercussão hemodinâmica.',
              'Presença de tosse seca ocasional.',
              'Aparecimento de manchas avermelhadas na pele.'
            ],
            'correta': 0,
          }
        ];

      case 'caso_4': // Dona Helena Souza
        return [
          {
            'titulo': 'PASSO 1: CARACTERIZAÇÃO DA DISPNEIA',
            'texto': 'Dona Helena refere que acordou no meio da noite sem conseguir respirar, com tosse e escarro róseo. Qual o termo semiótico desse sintoma clássico de insuficiência cardíaca esquerda?',
            'opcoes': [
              'Dispneia Paroxística Noturna associada a Edema Agudo de Pulmão.',
              'Dor pleurítica benigna.',
              'Crise de ansiedade transitória sem substrato orgânico.',
              'Refluxo gastroesofágico simples.'
            ],
            'correta': 0,
          },
          {
            'titulo': 'PASSO 2: ANTECEDENTES CARDIOVASCULARES',
            'texto': 'Na anamnese de Dona Helena, qual histórico prévio explica o desfecho de descompensação aguda grave?',
            'opcoes': [
              'Histórico de IAM prévio com fração de ejeção reduzida e hipertensão arterial grave mal controlada.',
              'Histórico de cirurgia de apêndice há 40 anos.',
              'Alergia a picada de insetos.',
              'Uso eventual de colírio lubrificante.'
            ],
            'correta': 0,
          },
          {
            'titulo': 'PASSO 3: ADESÃO MEDICAMENTOSA & TRANSGRESSÃO',
            'texto': 'Ao questionar a paciente sobre a rotina dos últimos dias, qual fator comumente precipita a crise hipertensiva com EAP?',
            'opcoes': [
              'Suspensão inadvertida de anti-hipertensivos/diuréticos e ingestão excessiva de sal ou líquidos.',
              'Ingestão de chá de camomila.',
              'Sono regular de 8 horas.',
              'Prática de caminhada leve há 3 semanas.'
            ],
            'correta': 0,
          }
        ];

      case 'caso_1': // Sr. Carlos Mendes
      default:
        return [
          {
            'titulo': 'PASSO 1: CARACTERIZAÇÃO DA DOR',
            'texto': 'Considerando o relato do Sr. Carlos, qual característica da dor torácica é o indicativo mais clássico de Síndrome Coronariana Aguda (SCA)?',
            'opcoes': [
              'Dor em pontada que piora ao inspirar profundamente.',
              'Dor precordial opressiva (em aperto) com irradiação para membro superior esquerdo e mandíbula.',
              'Dor em queimação epigástrica que melhora imediatamente após alimentação.',
              'Dor lombar com irradiação para face posterior dos membros inferiores.'
            ],
            'correta': 1,
          },
          {
            'titulo': 'PASSO 2: FATORES DE RISCO CORONARIANO',
            'texto': 'A dor é altamente sugestiva de IAM. Durante a anamnese direcionada do Sr. Carlos, quais fatores de risco são cruciais investigar de imediato?',
            'opcoes': [
              'Histórico de asma brônquica e alergias alimentares sazonais.',
              'Frequência de viagens internacionais recentes ou contato com infecções virais.',
              'Hipertensão Arterial Sistêmica, Diabetes Mellitus, Tabagismo prévio e histórico familiar de DAC precoce.',
              'Prática de esportes radicais ou traumas ortopédicos recentes.'
            ],
            'correta': 2,
          },
          {
            'titulo': 'PASSO 3: SEGURANÇA MEDICAMENTOSA & ALERGIAS',
            'texto': 'Você está prestes a avançar para a terapia farmacológica de urgência.\n\nQual dado da anamnese é absolutamente VITAL confirmar para prevenir eventos adversos graves?',
            'opcoes': [
              'Tipo sanguíneo e fator Rh do paciente.',
              'Volume da última diurese espontânea.',
              'Histórico vacinal anual contra influenza.',
              'Histórico de alergias medicamentosas (especialmente AAS, Dipirona ou contraste iodado).'
            ],
            'correta': 3,
          }
        ];
    }
  }

  /// 3. MÓDULO 3: ELETROCARDIOGRAMA (ECG)
  static List<Map<String, dynamic>> obterPerguntasEcg(CasoClinico caso) {
    switch (caso.id) {
      case 'caso_2': // Dona Maria da Graça (IAMSSST / Inversão T V5-V6)
        return [
          {
            'titulo': 'CALIBRAÇÃO & TELEMETRIA BASE',
            'texto': 'Antes de analisar o ECG de 12 derivações de Dona Maria, confirme a calibração padrão de velocidade e voltagem do eletrocardiógrafo:',
            'opcoes': [
              '25 mm/s e 10 mm/mV (N)',
              '50 mm/s e 5 mm/mV',
              '10 mm/s e 20 mm/mV',
            ],
            'correta': 0,
            'tipoTracado': 1,
            'alerta': 'HR: 75 BPM • CALIBRAÇÃO PADRÃO',
            'corAlerta': CardioTheme.primary,
          },
          {
            'titulo': 'MONITORIZAÇÃO DE RITMO • LEITO 06',
            'texto': 'No traçado de monitor contínuo de Dona Maria, identifique o ritmo básico:',
            'opcoes': [
              'Ritmo Sinusal com FC de 92 bpm sem arritmias ventriculares agudas',
              'Fibrilação Ventricular Aguda',
              'Bloqueio Atrioventricular de 3º Grau'
            ],
            'correta': 0,
            'tipoTracado': 1,
            'alerta': 'HR: 92 BPM • RITMO SINUSAL',
            'corAlerta': CardioTheme.primary,
          },
          {
            'titulo': 'ECG 12 DERIVAÇÕES • DONA MARIA DA GRAÇA',
            'texto': 'O ECG de 12 derivações demonstra ausência de supradesnivelamento de ST, porém com inversão simétrica de onda T em V5 e V6 (parede lateral). Qual o diagnóstico?',
            'opcoes': [
              'IAM com Supradesnivelamento de ST em parede anterior',
              'IAM sem Supradesnivelamento de ST (IAMSSST) / Isquemia Subepicárdica Lateral',
              'Traçado de ECG rigorosamente normal',
              'Sobrecarga isolada de ventrículo direito'
            ],
            'correta': 1,
            'tipoTracado': 3,
            'alerta': 'HR: 92 BPM • INVERSÃO DE T EM V5-V6 (IAMSSST)',
            'corAlerta': CardioTheme.statusMuitoUrgente,
          }
        ];

      case 'caso_3': // Lucas Almeida (Miopericardite Aguda)
        return [
          {
            'titulo': 'CALIBRAÇÃO & MONITORIZAÇÃO',
            'texto': 'O monitor de triagem do Lucas registra ritmo regular de 88 bpm. Qual a importância de analisar as derivações periféricas e precordiais completas?',
            'opcoes': [
              'Para mapear se as alterações eletrocardiográficas são difusas ou restritas a um território arterial coronariano específico.',
              'Apenas para medir a temperatura periférica.',
              'Não é necessário realizar 12 derivações em jovens.',
            ],
            'correta': 0,
            'tipoTracado': 1,
            'alerta': 'HR: 88 BPM • RITMO SINUSAL',
            'corAlerta': CardioTheme.primary,
          },
          {
            'titulo': 'ANÁLISE DO SEGMENTO PR',
            'texto': 'Na suspeita de acometimento pericárdico inflamatório, o que o infradesnivelamento do segmento PR em DII e V5/V6 representa?',
            'opcoes': [
              'Corrente de lesão atrial típica da Pericardite Aguda.',
              'Infarto transmural extenso do ápice.',
              'Necrose de septo interventricular.',
            ],
            'correta': 0,
            'tipoTracado': 1,
            'alerta': 'INFRA DE PR • SINAL TÍPICO DE PERICARDITE',
            'corAlerta': CardioTheme.cyanAccent,
          },
          {
            'titulo': 'ECG 12 DERIVAÇÕES • LUCAS ALMEIDA',
            'texto': 'O traçado de Lucas revela supradesnivelamento difuso côncavo de ST em múltiplas derivações (DI, DII, aVF, V2-V6) e infra de PR, sem imagem em espelho. Qual o diagnóstico?',
            'opcoes': [
              'Miopericardite Aguda (alteração inflamatória difusa)',
              'IAMCSST por oclusão de artéria descendente anterior',
              'Fibrilação Ventricular',
              'Assistolia'
            ],
            'correta': 0,
            'tipoTracado': 3,
            'alerta': 'HR: 88 BPM • SUPRA CÔNCAVO DIFUSO (MIOPERICARDITE)',
            'corAlerta': CardioTheme.statusUrgente,
          }
        ];

      case 'caso_4': // Dona Helena Souza (EAP / Taquicardia + SVE)
        return [
          {
            'titulo': 'MONITORIZAÇÃO NA SALA VERMELHA • DONA HELENA',
            'texto': 'No leito 12, a paciente apresenta taquicardia extrema com desconforto respiratório agudo. Qual o ritmo observado com ondas P positivas precedendo cada QRS?',
            'opcoes': [
              'Taquicardia Sinusal (FC 132 bpm em resposta ao estresse adrenérgico e hipoxemia)',
              'Fibrilação Ventricular',
              'Ritmo Juncional Lento',
            ],
            'correta': 0,
            'tipoTracado': 1,
            'alerta': 'HR: 132 BPM • TAQUICARDIA SINUSAL',
            'corAlerta': CardioTheme.statusGrave,
          },
          {
            'titulo': 'CRITÉRIOS DE SOBRECARGA VENTRICULAR',
            'texto': 'Na presença de crise hipertensiva (PA 180/110) de longa data, o traçado apresenta ondas R amplas em V5/V6 e ondas S profundas em V1/V2 (Critério de Sokolow-Lyon > 35mm). O que isso indica?',
            'opcoes': [
              'Sobrecarga Ventricular Esquerda (SVE) por cardiopatia hipertensiva crônica.',
              'Coração de atleta jovem sem hipertrofia.',
              'Cor pulmonale agudo isolado.',
            ],
            'correta': 0,
            'tipoTracado': 1,
            'alerta': 'SOBREGARGA VENTRICULAR ESQUERDA (SVE)',
            'corAlerta': CardioTheme.statusGrave,
          },
          {
            'titulo': 'ECG 12 DERIVAÇÕES • DONA HELENA SOUZA',
            'texto': 'O ECG confirma Taquicardia Sinusal, SVE e infradesnivelamento secundário de ST em parede lateral por sobrecarga de pressão e isquemia subendocárdica. Qual o laudo?',
            'opcoes': [
              'Taquicardia Sinusal com Sobrecarga Ventricular Esquerda e Padrão Strain',
              'IAM com Supra de ST de Parede Anterior',
              'Bradicardia Sinusal a 40 bpm',
              'Bloqueio de Ramo Direito isolado'
            ],
            'correta': 0,
            'tipoTracado': 3,
            'alerta': 'HR: 132 BPM • SVE + STRAIN PATTERN (EAP)',
            'corAlerta': CardioTheme.statusGrave,
          }
        ];

      case 'caso_1': // Sr. Carlos Mendes
      default:
        return [
          {
            'titulo': 'CALIBRAÇÃO & LEITURA 1',
            'texto': 'Antes de avaliar o Sr. Carlos, confirme a identificação deste traçado de calibração normal no monitor de triagem:',
            'opcoes': [
              'Ritmo Sinusal Normal',
              'Fibrilação Ventricular (FV)',
              'Assistolia / Linha Reta'
            ],
            'correta': 0,
            'tipoTracado': 1,
            'alerta': 'HR: 75 BPM • SINUSAL',
            'corAlerta': CardioTheme.primary,
          },
          {
            'titulo': 'EMERGÊNCIA NO LEITO ADJACENTE',
            'texto': 'O alarme do monitor disparou! Identifique este ritmo caótico de parada cardiorrespiratória:',
            'opcoes': [
              'Bradicardia Sinusal',
              'Fibrilação Ventricular (Ritmo Chocável)',
              'Bloqueio Atrioventricular Total'
            ],
            'correta': 1,
            'tipoTracado': 2,
            'alerta': 'HR: --- • ALARME CRÍTICO',
            'corAlerta': CardioTheme.statusGrave,
          },
          {
            'titulo': 'ECG 12 DERIVAÇÕES • SR. CARLOS MENDES',
            'texto': 'Derivações V1 a V4 com supradesnivelamento significativo do segmento ST e dor torácica intensa em curso. Qual o diagnóstico eletrocardiográfico?',
            'opcoes': [
              'Ritmo Sinusal Normal',
              'Fibrilação Ventricular',
              'IAM com Supradesnivelamento do Segmento ST (IAMCSST Parede Anterior)',
              'Taquicardia Supraventricular Paroxística'
            ],
            'correta': 2,
            'tipoTracado': 3,
            'alerta': 'HR: 118 BPM • SUPRA ST PAREDE ANTERIOR',
            'corAlerta': CardioTheme.statusGrave,
          }
        ];
    }
  }

  /// 4. MÓDULO 4: PROTOCOLO FARMACOLÓGICO ESPECÍFICO
  static Map<String, dynamic> obterProtocoloFarmacologico(CasoClinico caso) {
    switch (caso.id) {
      case 'caso_2': // Dona Maria (IAMSSST / SCA sem supra)
        return {
          'titulo': 'TERAPIA FARMACOLÓGICA • IAMSSST (DONA MARIA)',
          'descricao': 'Selecione as 4 intervenções farmacológicas prioritárias para IAM sem supra de ST:',
          'medicamentos': [
            "Aspirina (AAS 200mg)",
            "Clopidogrel (300mg)",
            "Enoxaparina (Anticoagulação)",
            "Estatina de Alta Potência",
            "Trombolítico (Tenecteplase)",
            "Amoxicilina",
            "Furosemida 80mg",
            "Glicose Hipertônica 50%"
          ],
          'gabarito': [
            "Aspirina (AAS 200mg)",
            "Clopidogrel (300mg)",
            "Enoxaparina (Anticoagulação)",
            "Estatina de Alta Potência"
          ],
          'explicacao': 'No IAM sem supra de ST (IAMSSST), a terapia baseia-se em dupla antiagregação (AAS + Clopidogrel), anticoagulação plena com Enoxaparina e Estatina. Trombolítico é CONTRAINDICADO na ausência de supra de ST!'
        };

      case 'caso_3': // Lucas Almeida (Miopericardite)
        return {
          'titulo': 'TERAPIA FARMACOLÓGICA • MIOPERICARDITE (LUCAS)',
          'descricao': 'Selecione as 4 condutas farmacológicas corretas para Miopericardite Aguda:',
          'medicamentos': [
            "Anti-inflamatório (Ibuprofeno)",
            "Colchicina (0.5mg/dia)",
            "Repouso & Monitorização",
            "Proteção Gástrica (Omeprazol)",
            "Trombolítico Fibrinolítico",
            "Varfarina em dose de ataque",
            "Morfina contínua",
            "Adrenalina em infusão"
          ],
          'gabarito': [
            "Anti-inflamatório (Ibuprofeno)",
            "Colchicina (0.5mg/dia)",
            "Repouso & Monitorização",
            "Proteção Gástrica (Omeprazol)"
          ],
          'explicacao': 'Na miopericardite aguda, o pilar do tratamento é anti-inflamatório em dose plena associado a Colchicina (que reduz recidivas em até 50%). Fibrinolíticos e anticoagulação plena são contraindicados pelo alto risco de hemopericárdio!'
        };

      case 'caso_4': // Dona Helena (Edema Agudo de Pulmão)
        return {
          'titulo': 'TERAPIA FARMACOLÓGICA & SUPORTE • EAP (DONA HELENA)',
          'descricao': 'Selecione as 4 intervenções imediatas para Edema Agudo de Pulmão Hipertensivo:',
          'medicamentos': [
            "Furosemida IV (Diurético)",
            "Nitroglicerina IV / Vasodilatador",
            "Ventilação Não-Invasiva (CPAP/VNI)",
            "Cabeceira Elevada a 90°",
            "Reposição Volêmica (Soro 1000ml)",
            "Bloqueador Neuromuscular",
            "Atropina 1mg",
            "Ceftriaxona IV"
          ],
          'gabarito': [
            "Furosemida IV (Diurético)",
            "Nitroglicerina IV / Vasodilatador",
            "Ventilação Não-Invasiva (CPAP/VNI)",
            "Cabeceira Elevada a 90°"
          ],
          'explicacao': 'No EAP hipertensivo, o alívio imediato da congestão pulmonar requer Furosemida IV, redução de pré e pós-carga com Nitroglicerina IV e pressão positiva com CPAP/VNI com cabeceira elevada. Hidratação venosa é estritamente proibida!'
        };

      case 'caso_1': // Sr. Carlos Mendes (MONA clássico)
      default:
        return {
          'titulo': 'PROTOCOLO FARMACOLÓGICO MONA • SR. CARLOS',
          'descricao': 'Selecione as 4 medicações prioritárias do Protocolo MONA no IAM com Supra:',
          'medicamentos': [
            "Aspirina (AAS)",
            "Adrenalina",
            "Oxigênio",
            "Furosemida",
            "Morfina",
            "Dipirona",
            "Nitrato",
            "Amoxicilina"
          ],
          'gabarito': [
            "Morfina",
            "Oxigênio",
            "Nitrato",
            "Aspirina (AAS)"
          ],
          'explicacao': 'Protocolo MONA clássico no IAMCSST: Morfina (para dor refratária e ansiólise), Oxigênio suplementar (se SpO2 < 90%), Nitrato sublingual (se PAS > 90) e Aspirina mastigável imediata.'
        };
    }
  }

  /// 5. MÓDULO 5: ENZIMAS E BIOMARCADORES
  static List<Map<String, dynamic>> obterPerguntasEnzimas(CasoClinico caso) {
    switch (caso.id) {
      case 'caso_2': // Dona Maria (Curva seriada de Troponina no IAM sem supra)
        return [
          {
            'titulo': 'ETAPA 1: ESTRATÉGIA DA CURVA SERIALIZADA • DONA MARIA',
            'texto': 'No IAM sem supra de ST (IAMSSST), o ECG inicial pode não ter supra evidente. Como a curva de Troponina ultrassensível (0h e 3h) confirma o diagnóstico?',
            'opcoes': [
              'Pela variação dinâmica (delta) com elevação de mais de 20% a 50% em relação ao valor basal associada a sintomas isquêmicos.',
              'Apenas se a glicemia também dobrar de valor.',
              'Basta uma dosagem isolada mesmo que esteja dentro da normalidade.',
              'A Troponina não tem valor diagnóstico no IAM sem supra.'
            ],
            'correta': 0,
          },
          {
            'titulo': 'ETAPA 2: MARCADOR DE RISCO EM DIABÉTICOS',
            'texto': 'Qual biomarcador inflamatório de fase aguda complementa a estratificação de risco a longo prazo de Dona Maria?',
            'opcoes': [
              'Proteína C Reativa Ultrassensível (PCR-us)',
              'Ureia isolada',
              'Ácido Úrico',
              'Bilirrubina total'
            ],
            'correta': 0,
          },
          {
            'titulo': 'ETAPA 3: CONDUTA COM TROPONINA POSITIVA',
            'texto': 'A Troponina da 3ª hora retornou positiva e elevada (0.85 ng/mL). Qual a conduta indicada pela equipe médica e de enfermagem?',
            'opcoes': [
              'Manter em UCO e indicar Estratificação Invasiva Precoce (Cateterismo Cardíaco em até 24h).',
              'Dar alta com analgésico oral.',
              'Suspender todos os medicamentos antiplaquetários.',
              'Solicitar retorno ambulatorial em 30 dias.'
            ],
            'correta': 0,
          }
        ];

      case 'caso_3': // Lucas Almeida (Biomarcadores na Miopericardite)
        return [
          {
            'titulo': 'ETAPA 1: BIOMARCADORES DE INFLAMAÇÃO • LUCAS',
            'texto': 'Na pericardite/miopericardite aguda, quais marcadores séricos correlacionam-se diretamente com a atividade inflamatória e orientam a duração do tratamento?',
            'opcoes': [
              'Proteína C Reativa (PCR) e Velocidade de Hemossedimentação (VHS)',
              'Creatinina e Ureia apenas',
              'Sódio e Potássio séricos',
              'Hemoglobina glicada'
            ],
            'correta': 0,
          },
          {
            'titulo': 'ETAPA 2: TROPONINA NA MIOPERICARDITE',
            'texto': 'Lucas apresenta Troponina discretamente elevada (0.08 ng/mL). O que isso sinaliza em relação ao envolvimento cardíaco?',
            'opcoes': [
              'Indica acometimento do miocárdio adjacente pelo processo inflamatório (Miopericardite).',
              'Indica que houve trombose oclusiva aguda de tronco de coronária esquerda.',
              'É um resultado falso sem qualquer significado clínico.',
              'Significa que o paciente é portador de insuficiência renal terminal.'
            ],
            'correta': 0,
          },
          {
            'titulo': 'ETAPA 3: CRITÉRIO DE REMISSÃO INFLAMATÓRIA',
            'texto': 'Quando se considera seguro iniciar o desmame progressivo da Colchicina e anti-inflamatórios em Lucas?',
            'opcoes': [
              'Quando houver normalização completa da PCR e remissão total dos sintomas clínicos.',
              'Logo nas primeiras 24 horas independentemente dos exames.',
              'Apenas após 5 anos ininterruptos.',
              'Nunca se suspende a medicação.'
            ],
            'correta': 0,
          }
        ];

      case 'caso_4': // Dona Helena (BNP e Troponina no EAP)
        return [
          {
            'titulo': 'ETAPA 1: O PEPTÍDEO NATRIURÉTICO (BNP) • DONA HELENA',
            'texto': 'Dona Helena apresenta BNP sérico de 1850 pg/mL (valor de referência < 100 pg/mL). O que esse nível crítico expressa fisiopatologicamente?',
            'opcoes': [
              'Intensa sobrecarga de volume e estiramento das paredes dos ventrículos por falência aguda de bomba (EAP).',
              'Apenas cansaço muscular periférico.',
              'Infecção urinária assintomática.',
              'Função cardíaca normal e compensada.'
            ],
            'correta': 0,
          },
          {
            'titulo': 'ETAPA 2: MONITORIZAÇÃO ELETROLÍTICA E GASOMETRIA',
            'texto': 'Após administração de altas doses de Furosemida IV e ventilação não-invasiva, qual controle laboratorial rigoroso a enfermagem deve vigiar?',
            'opcoes': [
              'Potássio sérico (risco de hipocalemia e arritmias) e Gasometria Arterial (equilíbrio ácido-básico).',
              'Apenas dosagem de vitamina D.',
              'Tempo de protrombina sem uso de anticoagulante.',
              'Contagem de plaquetas isolada.'
            ],
            'correta': 0,
          },
          {
            'titulo': 'ETAPA 3: AVALIAÇÃO DA RESPOSTA DIURÉTICA',
            'texto': 'Qual o parâmetro clínico imediato que demonstra sucesso na descompressão do leito pulmonar de Dona Helena?',
            'opcoes': [
              'Aumento expressivo do débito urinário, melhora da oximetria de pulso e redução do esforço respiratório.',
              'Piora da sudorese e sonolência.',
              'Aumento da frequência respiratória acima de 40 irpm.',
              'Queda súbita da diurese para zero.'
            ],
            'correta': 0,
          }
        ];

      case 'caso_1': // Sr. Carlos Mendes
      default:
        return [
          {
            'titulo': 'ETAPA 1: O BIOMARCADOR PADRÃO-OURO • SR. CARLOS',
            'texto': 'O paciente está sob monitorização contínua com IAM anterior. Qual é o biomarcador padrão-ouro de maior sensibilidade e especificidade para necrose miocárdica?',
            'opcoes': [
              'Mioglobina',
              'CK-MB Massa',
              'Troponina Cardíaca (I ou T de Alta Sensibilidade)',
              'Desidrogenase Lática (LDH)'
            ],
            'correta': 2,
          },
          {
            'titulo': 'ETAPA 2: CINÉTICA DA CURVA ENZIMÁTICA',
            'texto': 'Você coletou sangue para Troponina I. Em relação à sua curva sérica, quando se inicia sua elevação detectável após a oclusão coronariana aguda?',
            'opcoes': [
              'Imediatamente nos primeiros 10 minutos.',
              'Entre 3 a 6 horas após o início da isquemia celular.',
              'Apenas após 24 horas completas do evento.',
              'Após 48 horas da dor precordial.'
            ],
            'correta': 1,
          },
          {
            'titulo': 'ETAPA 3: MONITORIZAÇÃO DE REINFARTO',
            'texto': 'No 4º dia pós-angioplastia, o Sr. Carlos refere nova dor torácica. A Troponina permanece elevada pela meia-vida residual (até 14 dias).\n\nQual biomarcador é o mais indicado para diagnosticar reinfarto recente?',
            'opcoes': [
              'Nova dosagem isolada de Troponina I.',
              'Peptídeo Natriurético Tipo B (BNP).',
              'D-Dímero.',
              'CK-MB (pois retorna aos níveis basais em 48 a 72 horas).'
            ],
            'correta': 3,
          }
        ];
    }
  }

  /// 6. MÓDULO 6: ALTA, DESFECHO E EDUCAÇÃO EM SAÚDE
  static List<Map<String, dynamic>> obterPerguntasAlta(CasoClinico caso) {
    switch (caso.id) {
      case 'caso_2': // Dona Maria
        return [
          {"texto": "Manter controle glicêmico estrito e meta de HbA1c < 7.0% com dieta e acompanhamento", "bom": true},
          {"texto": "Interromper a dupla antiagregação (AAS/Clopidogrel) logo que a dor estomacal passar", "bom": false},
          {"texto": "Participar de programa supervisionado de reabilitação cardiovascular após alta da UCO", "bom": true},
          {"texto": "Suspender a estatina se o colesterol LDL estiver abaixo de 100 mg/dL sem ordem médica", "bom": false},
        ];

      case 'caso_3': // Lucas Almeida
        return [
          {"texto": "Evitar exercícios físicos intensos e esportes competitivos até normalização da PCR e do ECG", "bom": true},
          {"texto": "Retomar musculação pesada e uso de termogênicos imediatamente após a alta", "bom": false},
          {"texto": "Manter o curso prescrito de Colchicina pelo período orientado para prevenir recidivas", "bom": true},
          {"texto": "Interromper o anti-inflamatório nas primeiras 24 horas mesmo se a dor persistir", "bom": false},
        ];

      case 'caso_4': // Dona Helena
        return [
          {"texto": "Controle diário de peso corporal e restrição de sódio na dieta para prevenir nova congestão", "bom": true},
          {"texto": "Aumentar a ingestão de líquidos para mais de 3 litros de água por dia no pós-edema agudo", "bom": false},
          {"texto": "Aferição periódica da pressão arterial e adesão rígida aos anti-hipertensivos e diuréticos", "bom": true},
          {"texto": "Suspender a medicação de pressão se a PA atingir 120/80 mmHg por conta própria", "bom": false},
        ];

      case 'caso_1': // Sr. Carlos Mendes
      default:
        return [
          {"texto": "Caminhada leve progressiva (30 min/dia) após liberação médica e reabilitação", "bom": true},
          {"texto": "Substituir o cigarro tradicional por dispositivo eletrônico (Vape/Pod)", "bom": false},
          {"texto": "Dieta rica em sódio e ultraprocessados para repor eletrólitos rapidamente", "bom": false},
          {"texto": "Adesão rigorosa e contínua à dupla antiagregação e estatina prescrita", "bom": true},
        ];
    }
  }
}
