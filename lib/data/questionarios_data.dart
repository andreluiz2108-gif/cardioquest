import '../models/caso_clinico.dart';
import '../theme/cardio_theme.dart';

/// Repositório Central de Questionários, Desafios e Simulações Clínicas por Paciente
class QuestionariosData {
  /// 1. MÓDULO 1: TRIAGEM CLÍNICA (MANCHESTER)
  static List<Map<String, dynamic>> obterPerguntasTriagem(CasoClinico caso) {
    switch (caso.id) {
      case 'caso_2': // Dona Maria da Graça (58a - IAMSSST / Equivalente Isquêmico)
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
            'titulo': 'ETAPA 3: MONITORIZAÇÃO INICIAL • LEITO 06',
            'texto': 'A paciente está alocada na Unidade Semi-Intensiva (Leito 06).\n\nQuais medidas de enfermagem devem ser instituídas de imediato?',
            'opcoes': [
              'Apenas teste de glicemia capilar.',
              'Monitorização multiparamétrica contínua (ECG, PA, SpO2) e punção de acesso venoso periférico calibroso.',
              'Aplicação de bolsa térmica no abdome.',
              'Inalação com broncodilatador sem monitorização cardíaca.'
            ],
            'correta': 1,
            'usarCores': false,
          },
          {
            'titulo': 'ETAPA 4: RECONHECIMENTO DE SINTOMAS ATÍPICOS EM MULHERES',
            'texto': 'Durante a triagem, Dona Maria queixa-se de náuseas súbitas, sudorese fria discreta e sensação de peso no dorso.\n\nComo a enfermagem deve interpretar esses sintomas no contexto cardiovascular?',
            'opcoes': [
              'Como sintomas neurovegetativos e equivalentes isquêmicos de alta relevância clínica para SCA.',
              'Como crise de ansiedade simples sem risco cardíaco.',
              'Como sintomas exclusivos de intoxicação alimentar.',
              'Como queixas irrelevantes que não justificam vigilância.'
            ],
            'correta': 0,
            'usarCores': false,
          },
          {
            'titulo': 'ETAPA 5: VIGILÂNCIA E INTERVALO DE REAVALIAÇÃO',
            'texto': 'Na suspeita de Síndrome Coronariana Aguda sem Supra de ST, qual a frequência de reavaliação clínica e sinais vitais na sala de observação?',
            'opcoes': [
              'Reavaliação contínua e sinais vitais a cada 15-30 minutos ou imediatamente se houver mudança clínica/dor.',
              'Apenas na hora da troca de plantão (a cada 12 horas).',
              'Uma única vez antes da alta médica.',
              'A cada 6 horas caso o paciente não chame a equipe.'
            ],
            'correta': 0,
            'usarCores': false,
          },
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
            'texto': 'Na suspeita de miopericardite aguda em jovem adulto com dor torácica, qual exame prioritário deve ser realizado nos primeiros 10 minutos?',
            'opcoes': [
              'Eletrocardiograma de 12 derivações para avaliar alterações de ST e PR.',
              'Tomografia de crânio com contraste.',
              'Endoscopia digestiva alta de urgência.',
              'Radiografia de coluna torácica isolada.'
            ],
            'correta': 0,
            'usarCores': false,
          },
          {
            'titulo': 'ETAPA 3: POSICIONAMENTO E CONFORTO ANTÁLGICO',
            'texto': 'O paciente relata forte alívio da dor na posição sentada com inclinação do tronco para a frente (prece maometana).\n\nQual a conduta da equipe de enfermagem?',
            'opcoes': [
              'Obrigar o paciente a deitar em decúbito dorsal horizontal estrito.',
              'Permitir o posicionamento antálgico de conforto enquanto mantém monitorização e acesso venoso.',
              'Administrar relaxante muscular e solicitar tração lombar.',
              'Interromper a monitorização para o paciente caminhar.'
            ],
            'correta': 1,
            'usarCores': false,
          },
          {
            'titulo': 'ETAPA 4: AUSCULTA CARDÍACA E RUÍDOS PATOLÓGICOS',
            'texto': 'Durante o exame físico na triagem, o enfermeiro ausculta um ruído superficial, áspero, em vaivém, audível na borda esternal esquerda.\n\nQual o achado semiótico clássico caracterizado?',
            'opcoes': [
              'Atrito Pericárdico (sinal patognomônico de inflamação pericárdica).',
              'Sopro sistólico de estenose aórtica severa.',
              'Terceira bulha (B3) protodiastólica isolada.',
              'Ruído hidroaéreo gástrico transmitido.'
            ],
            'correta': 0,
            'usarCores': false,
          },
          {
            'titulo': 'ETAPA 5: RASTREAMENTO DE TAMPONAMENTO CARDÍACO',
            'texto': 'Qual sinal clínico deve ser rigorosamente vigiado na triagem para afastar Tamponamento Cardíaco agudo?',
            'opcoes': [
              'Queda da pressão arterial com abafamento de bulhas e turgência de jugulares (Tríade de Beck).',
              'Aumento isolado da temperatura axilar para 37.5 °C.',
              'Presença de tosse produtiva com escarro amarelado.',
              'Hiperemia conjuntival bilateral sem dor torácica.'
            ],
            'correta': 0,
            'usarCores': false,
          },
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
          },
          {
            'titulo': 'ETAPA 4: AVALIAÇÃO DE ESFORÇO E FADIGA RESPIRATÓRIA',
            'texto': 'A paciente apresenta uso de musculatura acessória, tiragem intercostal e fala entrecortada.\n\nQual o risco imediato se não houver resposta rápida à VNI e aos medicamentos?',
            'opcoes': [
              'Fadiga muscular diafragmática, parada respiratória e necessidade de Intubação Orotraqueal (IOT).',
              'Evolução benigna espontânea sem necessidade de oxigenoterapia.',
              'Melhora imediata do volume pulmonar sem intervenção.',
              'Redução imediata da frequência respiratória para níveis fisiológicos sem tratamento.'
            ],
            'correta': 0,
            'usarCores': false,
          },
          {
            'titulo': 'ETAPA 5: RESTRIÇÃO HÍDRICA ABSOLUTA NA FASE AGUDA',
            'texto': 'Um acadêmico sugere iniciar hidratação venosa contínua com soro fisiológico no leito de Dona Helena.\n\nQual a orientação correta do enfermeiro preceptor?',
            'opcoes': [
              'Contraindicar rigorosamente a hidratação venosa, pois a sobrecarga de volume agravará o edema pulmonar e a hipoxemia.',
              'Aprovar a hidratação rápida de 2000 mL para lavar os pulmões.',
              'Liberar a infusão sem avaliar o balanço hídrico.',
              'Apenas substituir o soro fisiológico por água destilada pura IV.'
            ],
            'correta': 0,
            'usarCores': false,
          },
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
          },
          {
            'titulo': 'ETAPA 4: RECONHECIMENTO DE SINAIS DE CHOQUE CARDIOGÊNICO',
            'texto': 'Sr. Carlos apresenta PA 160/100, porém com sudorese fria intensa e pulso radial filiforme e taquicárdico (118 bpm).\n\nQual risco hemodinâmico crítico deve ser vigiado continuamente pela enfermagem?',
            'opcoes': [
              'Evolução para Choque Cardiogênico e Insuficiência de Bomba por necrose miocárdica extensa.',
              'Hipotermia benigna sem relevância hemodinâmica.',
              'Choque anafilático por contato com ar condicionado.',
              'Queda isolada de plaquetas nas primeiras horas.'
            ],
            'correta': 0,
            'usarCores': false,
          },
          {
            'titulo': 'ETAPA 5: ACIONAMENTO DO CÓDIGO IAM & TEMPO PORTA-BALÃO',
            'texto': 'Com o diagnóstico de IAMCSST de parede anterior estabelecido, qual a meta institucional de tempo para a desobstrução mecânica da artéria coronária (Angioplastia Primária)?',
            'opcoes': [
              'Tempo Porta-Balão menor que 90 minutos (ou até 120 min em caso de transferência).',
              'Até 24 horas após a admissão hospitalar.',
              'Em até 7 dias após estabilização clínica.',
              'Apenas após o término de todos os exames de sangue da rotina.'
            ],
            'correta': 0,
            'usarCores': false,
          },
        ];
    }
  }

  /// 2. MÓDULO 2: ANAMNESE DIRECIONADA
  static List<Map<String, dynamic>> obterPerguntasAnamnese(CasoClinico caso) {
    switch (caso.id) {
      case 'caso_2': // Dona Maria da Graça (58a - IAMSSST / Diabética)
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
          },
          {
            'titulo': 'PASSO 4: SINTOMAS PRODRÔMICOS E EVOLUÇÃO',
            'texto': 'Ao aprofundar a anamnese, Dona Maria relata episódios de fadiga incomum e cansaço aos mínimos esforços nas últimas duas semanas.\n\nComo classificar esses pródromos no histórico cardiológico?',
            'opcoes': [
              'Como sintomas de angina instável / pródromos de isquemia miocárdica em progressão.',
              'Como alterações decorrentes exclusivamente do envelhecimento natural.',
              'Como sintomas psicológicos sem relevância patológica.',
              'Como efeito colateral esperado de vitaminas orais.'
            ],
            'correta': 0,
          },
          {
            'titulo': 'PASSO 5: HISTÓRICO DE RISCO CARDIOVASCULAR NA PÓS-MENOPAUSA',
            'texto': 'Por que o risco de eventos coronarianos agudos aumenta de forma acentuada em mulheres após a menopausa?',
            'opcoes': [
              'Pela perda do efeito vasodilatador e protetor do endotélio conferido pelo estrogênio, associada ao acúmulo de fatores aterogênicos.',
              'Porque a pressão arterial cai bruscamente na menopausa.',
              'Porque a frequência cardíaca torna-se inferior a 30 bpm.',
              'Pela duplicação imediata do volume intravascular.'
            ],
            'correta': 0,
          },
        ];

      case 'caso_3': // Lucas Almeida (34a - Miopericardite)
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
          },
          {
            'titulo': 'PASSO 4: INVESTIGAÇÃO DE ESTIMULANTES E SUBSTÂNCIAS EXÓGENAS',
            'texto': 'Lucas relata consumo de termogênicos com alta concentração de cafeína e taurina.\n\nQual o impacto dessas substâncias na vigência de processo inflamatório miocárdico?',
            'opcoes': [
              'Aumentam o consumo miocárdico de oxigênio e o tônus adrenérgico, favorecendo taquiarritmias e sobrecarga ventricular.',
              'Atuam como agentes anti-inflamatórios potentes no pericárdio.',
              'Previnem qualquer alteração do ritmo cardíaco.',
              'Neutralizam a ação de vírus no miocárdio.'
            ],
            'correta': 0,
          },
          {
            'titulo': 'PASSO 5: HISTÓRICO DE SINTOMAS SISTÊMICOS',
            'texto': 'Ao detalhar os antecedentes recentes, quais sintomas associados reforçam a etiologia infecciosa/inflamatória da pericardite?',
            'opcoes': [
              'Febre prévia, mialgia difusa, astenia, odinofagia e artralgia nos dias anteriores ao início da dor torácica.',
              'Dor lombar isolada após esforço físico intenso sem febre.',
              'Ganho súbito de 10 kg de massa magra.',
              'Prurido cutâneo exclusivo após banho de mar.'
            ],
            'correta': 0,
          },
        ];

      case 'caso_4': // Dona Helena Souza (71a - Edema Agudo de Pulmão)
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
          },
          {
            'titulo': 'PASSO 4: INVESTIGAÇÃO DE ISQUEMIA DESENCADEANTE',
            'texto': 'Em pacientes idosos e hipertensos com EAP agudo, por que é mandatório investigar dor ou desconforto torácico prévio?',
            'opcoes': [
              'Porque um novo evento isquêmico agudo / IAM silencioso é uma das principais causas de descompensação ventricular esquerda aguda.',
              'Porque a isquemia impede a ação de qualquer diurético oral.',
              'Apenas para checar se a paciente tem histórico de refluxo.',
              'Não é necessário investigar isquemia em pacientes com edema pulmonar.'
            ],
            'correta': 0,
          },
          {
            'titulo': 'PASSO 5: USO DE MEDICAMENTOS QUE RETÊM SÓDIO',
            'texto': 'Dona Helena relata ter tomado anti-inflamatórios (Diclofenaco) por conta própria para dores articulares nos últimos 5 dias.\n\nQual o efeito farmacológico desse grupo de drogas na Insuficiência Cardíaca?',
            'opcoes': [
              'Inibição de prostaglandinas renais, causando retenção severa de sódio e água e perda da eficácia dos diuréticos.',
              'Dilatação das artérias coronárias com melhora imediata do débito.',
              'Aumento súbito da filtração glomerular em 300%.',
              'Eliminação acelerada de potássio e sódio pela urina.'
            ],
            'correta': 0,
          },
        ];

      case 'caso_1': // Sr. Carlos Mendes (62a - IAMCSST)
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
          },
          {
            'titulo': 'PASSO 4: TEMPO CRONOLÓGICO DE INÍCIO DOS SINTOMAS',
            'texto': 'Sr. Carlos afirma que a dor começou exatamente há 40 minutos enquanto descansava.\n\nQual o impacto dessa informação temporal na tomada de conduta clínica?',
            'opcoes': [
              'O paciente está dentro da "janela áurea" (< 2 horas) de reperfusão, onde a desobstrução coronariana salva a maior quantidade de miocárdio.',
              'Indica que o infarto já se consolidou e não há tecido viável a ser salvo.',
              'Significa que o tratamento invasivo deve ser adiado para o dia seguinte.',
              'O tempo de início da dor não interfere no prognóstico miocárdico.'
            ],
            'correta': 0,
          },
          {
            'titulo': 'PASSO 5: RASTREAMENTO DO USO DE INIBIDORES DA FOSFODIESTERASE-5',
            'texto': 'Antes de administrar Nitrato sublingual para alívio da dor isquêmica no Sr. Carlos, qual pergunta é mandatória na anamnese?',
            'opcoes': [
              'Se fez uso de medicamentos para disfunção erétil (Sildenafil nas últimas 24h ou Tadalafil nas últimas 48h), pelo risco de choque vasodilatador fatal.',
              'Se ingeriu café nas últimas 6 horas.',
              'Se realizou exercícios físicos na semana passada.',
              'Se tem histórico de fratura óssea na infância.'
            ],
            'correta': 0,
          },
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
          },
          {
            'titulo': 'ECG SERIAL & MONITORIZAÇÃO DINÂMICA',
            'texto': 'Em pacientes com suspeita de IAM sem supra de ST e ECG inicial não conclusivo, qual a frequência de repetição do traçado recomendada pelas diretrizes?',
            'opcoes': [
              'Repetir ECG a cada 3 a 6 horas na fase inicial, ou IMEDIATAMENTE se houver recorrência da dor torácica.',
              'Realizar apenas um único ECG durante toda a internação.',
              'Repetir somente após 7 dias de internação.',
              'Não há indicação de novos eletrocardiogramas.'
            ],
            'correta': 0,
            'tipoTracado': 1,
            'alerta': 'ECG SERIAL • VIGILÂNCIA DE EVOLUÇÃO ISQUÊMICA',
            'corAlerta': CardioTheme.cyanAccent,
          },
          {
            'titulo': 'RECONHECIMENTO DE ISQUEMIA VS. LESÃO NO TRAÇADO',
            'texto': 'No eletrocardiograma de Dona Maria, o que representa fisiopatologicamente a onda T invertida, pontiaguda e simétrica?',
            'opcoes': [
              'Isquemia miocárdica subepicárdica ou transmural em território de artéria coronária circunflexa ou ramos marginais.',
              'Necrose muscular antiga cicatrizada com fibrose total.',
              'Repolarização normal de jovem atleta.',
              'Artefato por mau contato do eletrodo na pele.'
            ],
            'correta': 0,
            'tipoTracado': 3,
            'alerta': 'HR: 92 BPM • ISQUEMIA SUBEPICÁRDICA LATERAL',
            'corAlerta': CardioTheme.statusMuitoUrgente,
          },
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
          },
          {
            'titulo': 'FASES EVOLUTIVAS DE SPODICK NO ECG',
            'texto': 'Na pericardite aguda, as alterações do ECG passam por 4 estágios evolutivos. O que caracteriza o Estágio 1 (fase aguda inicial)?',
            'opcoes': [
              'Supradesnivelamento côncavo de ST difuso com ondas T positivas e infradesnivelamento de PR.',
              'Ondas Q patológicas de necrose transmural.',
              'Inversão profunda e permanente de ondas T com supra convexo.',
              'Linha isoelétrica com perda total de voltagem.'
            ],
            'correta': 0,
            'tipoTracado': 1,
            'alerta': 'ESTÁGIO 1 DE SPODICK • SUPRA CÔNCAVO DIFUSO',
            'corAlerta': CardioTheme.primary,
          },
          {
            'titulo': 'DIFERENÇA ENTRE SUPRA DO IAM E DA PERICARDITE',
            'texto': 'Como diferenciar no traçado o supra de ST da Pericardite Aguda do supra de ST do Infarto Agudo do Miocárdio (IAMCSST)?',
            'opcoes': [
              'Na pericardite o supra é difuso, com concavidade voltada para cima e sem espelho; no IAM o supra é convexo (em dorso de baleia), restrito a um território vascular e com espelho recíproco.',
              'No IAM o supra ocorre em todas as 12 derivações simultaneamente.',
              'Na pericardite surgem ondas Q gigantes em 10 minutos.',
              'Não é possível diferenciar os dois traçados.'
            ],
            'correta': 0,
            'tipoTracado': 3,
            'alerta': 'HR: 88 BPM • MORFOLOGIA CÔNCAVA DIFUSA',
            'corAlerta': CardioTheme.cyanAccent,
          },
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
          },
          {
            'titulo': 'RASTREAMENTO DE ARRITMIAS PRECIPITANTES',
            'texto': 'No contexto de Insuficiência Cardíaca e Edema Agudo de Pulmão, qual arritmia supraventricular comum deve ser monitorizada continuamente no traçado?',
            'opcoes': [
              'Fibrilação Atrial de Alta Resposta Ventricular (perda da contração atrial e queda abrupta do débito cardíaco).',
              'Ritmo Idiobradicárdico benigno.',
              'Bloqueio Sinoatrial de 1º Grau isolado.',
              'Extrassístoles ventriculares benignas raras sem significado.'
            ],
            'correta': 0,
            'tipoTracado': 1,
            'alerta': 'TELEMETRIA • VIGILÂNCIA DE ARRITMIAS ATRIAS',
            'corAlerta': CardioTheme.statusMuitoUrgente,
          },
          {
            'titulo': 'MONITORIZAÇÃO DO INTERVALO QTc & EFEITOS ELETROLÍTICOS',
            'texto': 'Após infusão de altas doses de diuréticos de alça (Furosemida IV), o que o aparecimento de ondas U proeminentes e prolongamento de QTc no ECG sinaliza?',
            'opcoes': [
              'Hipocalemia (queda crítica de potássio sérico) com risco iminente de arritmias ventriculares graves como Torsades de Pointes.',
              'Hipercalemia com risco de asistolia.',
              'Apenas melhora da perfusão periférica.',
              'Efeito normal sem necessidade de correção eletrolítica.'
            ],
            'correta': 0,
            'tipoTracado': 3,
            'alerta': 'HR: 132 BPM • ALERTA DE DISTÚRBIO ELETROLÍTICO (HIPOCALEMIA)',
            'corAlerta': CardioTheme.statusGrave,
          },
        ];

      case 'caso_1': // Sr. Carlos Mendes (62a - IAMCSST)
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
          },
          {
            'titulo': 'IDENTIFICAÇÃO DE IMAGEM RECÍPROCA (EM ESPELHO)',
            'texto': 'Ao analisar o traçado de 12 derivações do Sr. Carlos, observa-se infradesnivelamento de ST em DIII e aVF.\n\nO que esse achado eletrocardiográfico confirma?',
            'opcoes': [
              'Imagem em espelho (recíproca) típica da oclusão aguda da artéria descendente anterior, reforçando o diagnóstico de IAM com supra.',
              'Que o paciente tem dois infartos simultâneos em paredes opostas.',
              'Trata-se de artefato de posicionamento de eletrodo.',
              'Indica que o quadro é apenas ansiedade.'
            ],
            'correta': 0,
            'tipoTracado': 3,
            'alerta': 'HR: 118 BPM • IMAGEM EM ESPELHO (DIII/aVF)',
            'corAlerta': CardioTheme.statusGrave,
          },
          {
            'titulo': 'DERIVAÇÕES ADICIONAIS (DIREITAS E POSTERIORES)',
            'texto': 'Quando um paciente apresenta infarto de parede inferior (DII, DIII, aVF) ou suspeita de acometimento dorsal/VD, quais derivações complementares a enfermagem deve traçar imediatamente?',
            'opcoes': [
              'Derivações Direitas (V3R e V4R) e Derivações Posteriores (V7 e V8).',
              'Apenas D1 e D2 com velocidade de 50 mm/s.',
              'Derivações intracardíacas invasivas.',
              'Não existem derivações adicionais descritas na literatura.'
            ],
            'correta': 0,
            'tipoTracado': 1,
            'alerta': 'PROTOCOLO • V3R, V4R, V7, V8 ADICIONAIS',
            'corAlerta': CardioTheme.primary,
          },
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
          'explicacao': 'No IAM sem supra de ST (IAMSSST), a terapia baseia-se em dupla antiagregação (AAS + Clopidogrel), anticoagulação plena com Enoxaparina e Estatina de alta potência. Trombolítico é CONTRAINDICADO na ausência de supra de ST!'
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
          'explicacao': 'Na miopericardite aguda, o pilar do tratamento é anti-inflamatório em dose plena associado a Colchicina (que reduz recidivas em até 50%), repouso e proteção gástrica com IBP. Fibrinolíticos e anticoagulação plena são contraindicados pelo alto risco de hemopericárdio e tamponamento!'
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
          'explicacao': 'No EAP hipertensivo, o alívio imediato da congestão pulmonar requer Furosemida IV (venodilatação imediata e diurese potente), redução de pré e pós-carga com Nitroglicerina IV e pressão positiva com CPAP/VNI com cabeceira elevada a 90°. Reposição volêmica é PROIBIDA!'
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
          'explicacao': 'Protocolo MONA clássico no IAMCSST: Morfina (para dor refratária e redução de pré-carga), Oxigênio suplementar (se SpO2 < 90%), Nitrato sublingual (vasodilatação coronariana se PAS > 90) e Aspirina mastigável imediata (200-300mg).'
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
          },
          {
            'titulo': 'ETAPA 4: ESCORES DE RISCO CLÍNICO-ENZIMÁTICO (GRACE / TIMI)',
            'texto': 'A elevação da Troponina associada à idade (58 anos) e antecedente de Diabetes pontua nos escores GRACE e TIMI.\n\nO que um escore de alto risco determina na prática assistencial?',
            'opcoes': [
              'Indicação formal de internação em Unidade Coronariana Intensiva (UCO) e cineangiocoronariografia urgente.',
              'Liberação para enfermaria geral sem monitorização.',
              'Suspensão de qualquer intervenção diagnóstica.',
              'Encaminhamento imediato para cirurgia ortopédica.'
            ],
            'correta': 0,
          },
          {
            'titulo': 'ETAPA 5: CUIDADOS DE ENFERMAGEM NA COLETA SERIALIZADA',
            'texto': 'Qual cuidado de enfermagem é crucial no protocolo de dosagem seriada de Troponina ultrassensível (protocolo 0h/1h ou 0h/3h)?',
            'opcoes': [
              'Rigor absoluto no registro dos horários exatos de cada punção para cálculo correto da variação (delta).',
              'Coletar todas as amostras no mesmo tubo com intervalo de 5 minutos.',
              'Aquecer o sangue coletado em micro-ondas antes do envio.',
              'Aguardar 48 horas antes de enviar os tubos ao laboratório.'
            ],
            'correta': 0,
          },
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
          },
          {
            'titulo': 'ETAPA 4: ECOCARDIOGRAMA COMPLEMENTAR AOS BIOMARCADORES',
            'texto': 'Junto com a dosagem de biomarcadores, por que o Ecocardiograma Transtorácico à beira-leito é essencial na miopericardite?',
            'opcoes': [
              'Para quantificar eventual derrame pericárdico e avaliar a função contrátil global e segmentar dos ventrículos.',
              'Para substituir a necessidade de aferir a pressão arterial.',
              'Apenas para medir a espessura do esterno.',
              'Para visualizar a mucosa gástrica.'
            ],
            'correta': 0,
          },
          {
            'titulo': 'ETAPA 5: CINÉTICA DE TROPONINA: MIOPERICARDITE VS. IAM',
            'texto': 'Como se comporta a curva de Troponina na Miopericardite em comparação com o pico massivo do Infarto Agudo do Miocárdio?',
            'opcoes': [
              'Na miopericardite a elevação tende a ser mais modesta e proporcional à elevação marcante de PCR, sem curva abrupta de oclusão coronariana.',
              'Na miopericardite a troponina atinge 500 vezes o valor de referência em 30 minutos.',
              'No infarto agudo a troponina nunca se eleva.',
              'As curvas são idênticas em todos os aspectos fisiopatológicos.'
            ],
            'correta': 0,
          },
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
          },
          {
            'titulo': 'ETAPA 4: TROPONINA POSITIVA NO EDEMA AGUDO DE PULMÃO',
            'texto': 'A Troponina de Dona Helena retornou discretamente positiva (0.22 ng/mL).\n\nQual a interpretação clínica mais adequada para esse achado no contexto de EAP hipertensivo?',
            'opcoes': [
              'Dano miocárdico secundário ao estresse parietal extremo, taquicardia e hipoxemia (lesão tipo 2), devendo-se investigar também IAM desencadeante.',
              'Indica que a paciente nunca teve nenhuma doença no coração.',
              'Resultado inválido que deve ser completamente descartado.',
              'Trata-se de efeito esperado da máscara de oxigênio.'
            ],
            'correta': 0,
          },
          {
            'titulo': 'ETAPA 5: VIGILÂNCIA DA SÍNDROME CARDIORRENAL AGUDA',
            'texto': 'Durante a terapia diurética agressiva no EAP, por que a dosagem seriada de Creatinina e Ureia plasmáticas é prioritária?',
            'opcoes': [
              'Para rastrear precocemente disfunção renal aguda induzida por hipovolemia relativa ou hipoperfusão (Síndrome Cardiorrenal tipo 1).',
              'Para verificar a absorção gástrica de carboidratos.',
              'Para calcular o índice de massa corporal.',
              'Não há relação entre função cardíaca e função renal.'
            ],
            'correta': 0,
          },
        ];

      case 'caso_1': // Sr. Carlos Mendes (62a - IAMCSST)
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
          },
          {
            'titulo': 'ETAPA 4: PAPEL DO ECG VS. BIOMARCADORES NO IAMCSST',
            'texto': 'Na presença de supradesnivelamento de ST no ECG e dor típica em curso, deve-se aguardar o resultado da Troponina para encaminhar à Hemodinâmica?',
            'opcoes': [
              'NÃO! No IAM com supra de ST, o diagnóstico é eletrocardiográfico e a reperfusão imediata NÃO deve ser atrasada aguardando exames laboratoriais.',
              'SIM! É obrigatório ter o laudo da troponina antes de abrir a sala de hemodinâmica.',
              'SIM! Deve-se aguardar a curva de 24 horas.',
              'Apenas se o paciente tiver mais de 80 anos.'
            ],
            'correta': 0,
          },
          {
            'titulo': 'ETAPA 5: CINÉTICA ULTRARRÁPIDA DA MIOGLOBINA',
            'texto': 'Qual a principal característica cinética da Mioglobina na fase ultraprecoce da isquemia miocárdica?',
            'opcoes': [
              'Eleva-se muito precocemente (em 1 a 2 horas), porém possui baixa especificidade por estar presente também no músculo esquelético.',
              'Permanece elevada por 30 dias no sangue.',
              'Só se eleva se houver insuficiência hepática concomitante.',
              'É o biomarcador mais específico exclusivo do miocárdio.'
            ],
            'correta': 0,
          },
        ];
    }
  }

  /// 6. MÓDULO 6: ALTA, DESFECHO E EDUCAÇÃO EM SAÚDE
  static List<Map<String, dynamic>> obterPerguntasAlta(CasoClinico caso) {
    switch (caso.id) {
      case 'caso_2': // Dona Maria da Graça (IAMSSST / Diabética)
        return [
          {"texto": "Manter controle glicêmico estrito com meta de HbA1c < 7.0%, dieta balanceada e monitorização", "bom": true},
          {"texto": "Interromper a dupla antiagregação (AAS/Clopidogrel) logo que o desconforto estomacal passar", "bom": false},
          {"texto": "Participar de programa supervisionado de reabilitação cardiovascular após alta da UCO", "bom": true},
          {"texto": "Suspender a estatina por conta própria se o colesterol LDL estiver abaixo de 100 mg/dL sem ordem médica", "bom": false},
          {"texto": "Monitorar a pressão arterial regularmente e manter acompanhamento com cardiologista e endocrinologista", "bom": true},
          {"texto": "Ignorar episódios de náusea súbita e cansaço incomum acreditando ser apenas indigestão passageira", "bom": false},
        ];

      case 'caso_3': // Lucas Almeida (Miopericardite Aguda)
        return [
          {"texto": "Evitar exercícios físicos intensos e esportes competitivos por 3 meses até normalização da PCR e do ECG", "bom": true},
          {"texto": "Retomar musculação pesada e uso de suplementos termogênicos imediatamente após a alta", "bom": false},
          {"texto": "Manter o curso prescrito de Colchicina e anti-inflamatório pelo período orientado para prevenir recidivas", "bom": true},
          {"texto": "Interromper o anti-inflamatório nas primeiras 24 horas caso não sinta dor torácica no momento", "bom": false},
          {"texto": "Retornar imediatamente à emergência em caso de febre persistente, falta de ar ou dor torácica recorrente", "bom": true},
          {"texto": "Fazer consumo recreativo de energéticos e álcool durante o período de recuperação inflamatória", "bom": false},
        ];

      case 'caso_4': // Dona Helena Souza (Edema Agudo de Pulmão)
        return [
          {"texto": "Pesagem diária pela manhã e controle rigoroso de sódio na dieta para prevenir nova congestão pulmonar", "bom": true},
          {"texto": "Aumentar a ingestão de líquidos para mais de 3 litros de água por dia no pós-edema agudo", "bom": false},
          {"texto": "Aferição periódica da pressão arterial e adesão rígida aos anti-hipertensivos e diuréticos prescritos", "bom": true},
          {"texto": "Suspender a medicação de pressão se a PA atingir 120/80 mmHg por conta própria", "bom": false},
          {"texto": "Procurar a emergência imediatamente se houver ganho de peso rápido (>2kg em 3 dias) ou falta de ar ao deitar", "bom": true},
          {"texto": "Utilizar anti-inflamatórios comuns (como Diclofenaco) para qualquer dor no corpo sem prescrição médica", "bom": false},
        ];

      case 'caso_1': // Sr. Carlos Mendes (IAMCSST)
      default:
        return [
          {"texto": "Caminhada leve progressiva (30 min/dia) após liberação médica e reabilitação cardiovascular", "bom": true},
          {"texto": "Substituir o cigarro tradicional por dispositivo eletrônico (Vape/Pod) acreditando ser inofensivo", "bom": false},
          {"texto": "Adesão rigorosa e contínua à dupla antiagregação (AAS + Clopidogrel) e estatina prescrita", "bom": true},
          {"texto": "Dieta rica em sódio e ultraprocessados para repor eletrólitos rapidamente", "bom": false},
          {"texto": "Reconhecimento precoce de sinais de alerta (dor torácica opressiva recorrente, falta de ar súbita)", "bom": true},
          {"texto": "Interromper os remédios do coração por conta própria quando não sentir mais nenhuma dor no peito", "bom": false},
        ];
    }
  }
}
