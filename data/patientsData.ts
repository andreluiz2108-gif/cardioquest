import { PatientCase } from '../types/patient';

export const PATIENTS_DATA: PatientCase[] = [
  // CASO 1: Sr. Carlos Mendes (Básico / Clássico)
  {
    id: 'carlos',
    nome: 'Sr. Carlos Mendes',
    idade: 62,
    genero: 'Masculino',
    ocupacao: 'Comerciante',
    queixaPrincipal: 'Dor torácica opressiva (9/10) irradiada para membro superior esquerdo há 40 minutos.',
    tempoInicioSintomas: '40 minutos',
    complexidade: 2,
    corDestaque: '#EF4444',
    resumoClinico: 'Quadro clássico de Síndrome Coronariana Aguda com Supradesnivelamento do Segmento ST (IAMST) em parede anterior.',
    fatoresDeRisco: ['Hipertensão Arterial', 'Sedentarismo', 'Estresse Crônico'],
    triagem: {
      titulo: 'Triagem Manchester: Sr. Carlos',
      pergunta: 'Com dor torácica opressiva grave (9/10) iniciada há 40min com sudorese, qual a prioridade na Triagem Manchester?',
      opcoes: [
        'A) Vermelho (Emergência - Atendimento imediato)',
        'B) Laranja (Muito Urgente - Atendimento em até 10 minutos)',
        'C) Amarelo (Urgente - Atendimento em até 60 minutos)',
        'D) Verde (Pouco Urgente - Atendimento em até 120 minutos)'
      ],
      correta: 1,
      explicacao: 'Pela classificação de Manchester, dor torácica típica de início recente sem rebaixamento de consciência se enquadra na cor Laranja (Muito Urgente, até 10 min). ECG deve ser realizado em até 10 minutos (Porta-ECG).',
      classificacaoEsperada: 'Laranja'
    },
    anamnese: {
      sinaisVitais: {
        pa: '145/90 mmHg',
        fc: '88 bpm',
        fr: '18 irpm',
        spo2: '96% em ar ambiente',
        tax: '36.5 °C'
      },
      perguntas: [
        {
          titulo: 'Passo 1: Caracterização da Dor',
          texto: 'Qual característica da dor do Sr. Carlos é o indicativo mais clássico de síndrome isquêmica miocárdica aguda?',
          opcoes: [
            'A) Dor em pontada que piora ao inspirar fundo.',
            'B) Dor precordial opressiva (em aperto) irradiada para membro superior esquerdo.',
            'C) Dor em queimação na boca do estômago que melhora com alimentação.',
            'D) Dor lombar com irradiação para as pernas.'
          ],
          correta: 1,
          explicacao: 'A dor isquêmica miocárdica clássica é retroesternal opressiva/em aperto, podendo irradiar para mandíbula, pescoço, ombro ou MSE.'
        },
        {
          titulo: 'Passo 2: Fatores de Risco',
          texto: 'Quais fatores de risco coronariano são cruciais investigar no histórico do Sr. Carlos?',
          opcoes: [
            'A) Asma e alergias alimentares.',
            'B) Viagens recentes e contato infeccioso.',
            'C) Hipertensão, Diabetes, Tabagismo e Histórico Familiar de DAC precoce.',
            'D) Lesões ortopédicas e prática de desportos.'
          ],
          correta: 2,
          explicacao: 'HAS, DM, tabagismo, dislipidemia e histórico familiar precoce são os fatores de risco ateroscleróticos clássicos.'
        },
        {
          titulo: 'Passo 3: Segurança Medicamentosa',
          texto: 'Antes de administrar medicação de emergência, qual confirmação é vital?',
          opcoes: [
            'A) Fator Rh e tipo sanguíneo.',
            'B) Última micção.',
            'C) Vacinação contra a gripe.',
            'D) Histórico de alergias a medicamentos (especialmente AAS e Iodo).'
          ],
          correta: 3,
          explicacao: 'Confirmar alergias (AAS, contraste iodado) previne choques anafiláticos e complicações imediatas.'
        }
      ]
    },
    ecg: {
      achadoPrincipal: 'Supradesnivelamento de ST em V1, V2, V3 e V4',
      descricaoCompleta: 'ECG de 12 derivadas demonstra supradesnivelamento do segmento ST de 3mm nas derivadas anteroseptais (V1-V4) com imagem em espelho nas derivadas inferiores (DII, DIII, aVF).',
      paredeAtingida: 'Parede Anterior Extensa / Anteroseptal',
      coronariaProvavel: 'Artéria Coronária Descendente Anterior (DA)',
      pergunta: 'Diante do ECG demonstrando Supra de ST de 3mm em V1 a V4 no Sr. Carlos, qual a interpretação eletrocardiográfica correta?',
      opcoes: [
        'A) Repolarização precoce benigna sem relevância clínica.',
        'B) Infarto Agudo do Miocárdio com Supradesnivelamento de ST (IAMST) em parede anterior por oclusão de Descendente Anterior.',
        'C) Pericardite aguda difusa com infra de PR.',
        'D) Bloqueio Completo de Ramo Direito isolado.'
      ],
      correta: 1,
      explicacao: 'O supra de ST convexo em derivadas contíguas (V1-V4) define IAMST em parede anterior, habitualmente associado a oclusão da artéria Descendente Anterior (DA).'
    },
    protocolo: {
      titulo: 'Protocolo de Reperfusão e Farmacologia',
      cenario: 'Paciente no serviço de emergência a 15 min do centro de hemodinâmica.',
      pergunta: 'Para o Sr. Carlos (IAMST de parede anterior dentro da janela de 12 horas), qual a conduta terapêutica imediata de escolha?',
      opcoes: [
        'A) Alta para casa com analgésicos comuns e retorno ambulatorial.',
        'B) Dupla antiagregação plaquetária (AAS + Inibidor P2Y12) e Angioplastia Coronariana Primária imediata (Porta-Balão < 90 min).',
        'C) Observação em UTI por 48 horas sem medicação anticoagulante.',
        'D) Apenas administração de oxigênio suplementar e diurético de alça.'
      ],
      correta: 1,
      explicacao: 'A angioplastia primária é a estratégia de reperfusão preferencial quando realizada em < 90 min do diagnóstico.'
    },
    enzimas: {
      curvaTroponina: 'Troponina I de alta sensibilidade: 4.800 ng/L (VN < 14 ng/L)',
      ckmb: 'CK-MB massa: 48 ng/mL (elevada)',
      outrosExames: 'Hemograma normal, Creatinina 0.9 mg/dL, Potássio 4.2 mEq/L',
      pergunta: 'A elevação expressiva da Troponina I no Sr. Carlos confirma qual fenômeno fisiopatológico?',
      opcoes: [
        'A) Inflamação muscular esquelética periférica.',
        'B) Necrose miocárdica resultante da oclusão coronariana aguda.',
        'C) Insuficiência renal aguda por rabdomiólise.',
        'D) Infecção bacteriana sistêmica.'
      ],
      correta: 1,
      explicacao: 'Troponina é um biomarcador altamente específico de dano e necrose de miócitos cardíacos.'
    },
    alta: {
      orientacoes: [
        'Uso contínuo da dupla antiagregação plaquetária (AAS + Clopidogrel/Ticagrelor) por 12 meses.',
        'Introdução de Estatina de alta potência (Atorvastatina 80mg) para meta de LDL < 50 mg/dL.',
        'Controle pressórico rigoroso com IECA/BRA e Betabloqueador.',
        'Programa de Reabilitação Cardiovascular supervisionada e cessação do sedentarismo.'
      ],
      prescricaoSecundaria: ['AAS 100mg/dia', 'Ticagrelor 90mg 12/12h', 'Atorvastatina 80mg à noite', 'Enalapril 10mg 12/12h', 'Carvedilol 6.25mg 12/12h'],
      pergunta: 'Na orientação de alta para o Sr. Carlos (pós-IAMST), qual a meta terapêutica de LDL-colesterol recomendada pelas diretrizes de prevenção secundária?',
      opcoes: [
        'A) LDL < 130 mg/dL.',
        'B) LDL < 100 mg/dL.',
        'C) LDL < 50 mg/dL (paciente de muito alto risco cardiovascular).',
        'D) O nível de LDL não interfere na prevenção secundária.'
      ],
      correta: 2,
      explicacao: 'Pacientes pós-IAMST são classificados como de Muito Alto Risco Cardiovascular, com meta de LDL < 50 mg/dL.'
    }
  },

  // CASO 2: Dona Maria das Graças (Moderada / Atípica em Diabética)
  {
    id: 'maria',
    nome: 'Dona Maria das Graças',
    idade: 74,
    genero: 'Feminino',
    ocupacao: 'Aposentada',
    queixaPrincipal: 'Dispneia súbita, mal-estar epigástrico, náuseas e sudorese profusa há 2 horas. Nega dor torácica típica.',
    tempoInicioSintomas: '2 horas',
    complexidade: 3,
    corDestaque: '#F97316',
    resumoClinico: 'Quadro atípico de Síndrome Coronariana Aguda sem Supradesnivelamento de ST (IAMSST) em paciente idosa e diabética de longa data.',
    fatoresDeRisco: ['Diabetes Mellitus tipo 2 há 20 anos', 'Hipertensão Arterial', 'Idade Avançada (>70 anos)'],
    triagem: {
      titulo: 'Triagem Manchester: Dona Maria',
      pergunta: 'Dona Maria (diabética de 74a) chega afebril, sudoreica, com dispneia súbita e náuseas, sem queixa explícita de dor torácica. Qual a classificação de risco?',
      opcoes: [
        'A) Verde (Pouco Urgente) - Pois não há dor no peito.',
        'B) Laranja (Muito Urgente) - Devido à suspeita de Equivalente Isquêmico em paciente idosa/diabética.',
        'C) Azul (Não Urgente) - Encaminhar para posto de saúde.',
        'D) Amarelo - Aguardar retorno dos exames laboratoriais na sala de espera.'
      ],
      correta: 1,
      explicacao: 'Idosos e diabéticos frequentemente apresentam "Equivalentes Isquêmicos" (dispneia, mal-estar epigástrico, sudorese) sem dor típica. Devem ser triados como Laranja e submetidos a ECG imediato.',
      classificacaoEsperada: 'Laranja'
    },
    anamnese: {
      sinaisVitais: {
        pa: '160/95 mmHg',
        fc: '96 bpm',
        fr: '24 irpm',
        spo2: '93% em ar ambiente',
        tax: '36.2 °C'
      },
      perguntas: [
        {
          titulo: 'Passo 1: Reconhecimento do Equivalente Isquêmico',
          texto: 'Por que a absência de dor torácica típica na Dona Maria NÃO descarta Infarto Agudo do Miocárdio?',
          opcoes: [
            'A) A dor de infarto em mulheres nunca ocorre.',
            'B) A neuropatia autonômica diabética pode alterar a percepção nociceptiva da dor isquêmica.',
            'C) Pacientes idosos não possuem receptores cardíacos.',
            'D) A dor só ocorre se houver febre associada.'
          ],
          correta: 1,
          explicacao: 'A neuropatia autonômica no Diabetes reduz a percepção dolorosa clássica, fazendo com que a isquemia se manifeste por dispneia ou epigastralgia.'
        },
        {
          titulo: 'Passo 2: Investigação de Comorbidades',
          texto: 'Qual exame rápido de cabeceira deve ser realizado imediatamente na anamnese de Dona Maria para diagnosticar potenciais descompensações?',
          opcoes: [
            'A) Glicemia capilar (HGT) para afastar hipoglicemia ou cetoacidose.',
            'B) Teste visual de Snellen.',
            'C) Exame otoscópico bilateral.',
            'D) Coleta de fezes.'
          ],
          correta: 0,
          explicacao: 'Em diabéticos com mal-estar agudo, a glicemia capilar imediata diferencia quadros hipoglicêmicos de eventos isquêmicos concomitantes.'
        },
        {
          titulo: 'Passo 3: Avaliação do Escore de Risco TIMI/GRACE',
          texto: 'Quais parâmetros aumentam o risco do IAMSST na Dona Maria?',
          opcoes: [
            'A) Idade > 65 anos, uso prévio de AAS e elevação de biomarcadores.',
            'B) Apenas o sexo feminino.',
            'C) Apresentar pressão arterial normal.',
            'D) Praticar caminhadas leves.'
          ],
          correta: 0,
          explicacao: 'Idade ≥ 65 anos, fatores de risco cardiovascular e marcadores positivos pontuam nos escores TIMI/GRACE para estratificação de risco.'
        }
      ]
    },
    ecg: {
      achadoPrincipal: 'Infradesnivelamento de ST de 2mm em V4, V5, V6 e T invertida simétrica',
      descricaoCompleta: 'ECG sem supra de ST, porém com infradesnivelamento de ST de 2mm nas derivadas anterolaterais (V4-V6) e ondas T invertidas e profundas.',
      paredeAtingida: 'Isquemia Subendocárdica Anterolateral',
      coronariaProvavel: 'Suboclusão de Artéria Coronária Circumflexa (CX) ou Descendente Anterior (DA)',
      pergunta: 'O ECG da Dona Maria mostra infradesnivelamento de ST de 2mm de V4 a V6. Qual o diagnóstico eletrocardiográfico correto?',
      opcoes: [
        'A) Infarto com Supradesnivelamento de ST (IAMST) que necessita de trombolítico de emergência.',
        'B) Síndrome Coronariana Aguda Sem Supradesnivelamento de ST (IAMSST) / Angina Instável com isquemia subendocárdica.',
        'C) Ritmo Sinusal estritamente normal.',
        'D) Dextrocardia isolada.'
      ],
      correta: 1,
      explicacao: 'Infra de ST ≥ 0.5mm ou inversão simétrica de T sem supra de ST caracterizam o IAMSST ou Angina Instável.'
    },
    protocolo: {
      titulo: 'Manejo no IAMSST e Estratificação de Risco',
      cenario: 'Paciente estável com IAMSST de alto risco (Troponina positiva e infra de ST).',
      pergunta: 'Para Dona Maria (IAMSST de Alto Risco por Escore GRACE elevado), qual a conduta adequada quanto ao uso de Fibrinolíticos (Trombolíticos)?',
      opcoes: [
        'A) Administrar Alteplase (rtPA) imediatamente na emergência.',
        'B) Fibrinolíticos são CONTRAINDICADOS no IAMSST; a indicação é anticoagulação com Fondaparinux/Enoxaparina e Estratificação Invasiva (CATE em até 24h).',
        'C) Administrar Tenecteplase em bolus único.',
        'D) Não utilizar nenhuma medicação anticoagulante nem antiagregante.'
      ],
      correta: 1,
      explicacao: 'Fibrinolíticos NÃO têm indicação no IAMSST (aumentam mortalidade/sangramento sem benefício). O tratamento envolve antiagregação dupla, anticoagulação e CATE precoce.'
    },
    enzimas: {
      curvaTroponina: 'Troponina T ultrassensível: 1.250 ng/L (Curva ascendente em 3h: 2.900 ng/L)',
      ckmb: 'CK-MB: 28 ng/mL',
      outrosExames: 'Glicemia: 210 mg/dL, HbA1c: 9.2%, Ureia: 45 mg/dL, Creatinina: 1.2 mg/dL',
      pergunta: 'A curva ascendente de Troponina ultrassensível em 3 horas no IAMSST da Dona Maria confirma:',
      opcoes: [
        'A) Apenas Angina Estável sem lesão miocárdica.',
        'B) Diagnóstico definitivo de Infarto Agudo do Miocárdio sem Supra de ST (IAMSST) com lesão miocárdica ativa.',
        'C) Falso positivo decorrente exclusivamente da glicemia elevada.',
        'D) Ausência total de risco cardiovascular.'
      ],
      correta: 1,
      explicacao: 'A elevação e/ou queda dinâmica da Troponina com pelo menos um valor acima do percentil 99 define o diagnóstico de IAM.'
    },
    alta: {
      orientacoes: [
        'Controle glicêmico rigoroso (Meta de HbA1c < 7.0%) com otimização de iSGLT2 (Empaglifozina/Dapaglifozina) ou ag-GLP1 pelo benefício cardiovascular demonstrado.',
        'Dupla antiagregação plaquetária mantida.',
        'Acompanhamento conjunto com Cardiologia e Endocrinologia.'
      ],
      prescricaoSecundaria: ['AAS 100mg/dia', 'Clopidogrel 75mg/dia', 'Atorvastatina 80mg/dia', 'Empaglifozina 10mg/dia', 'Metformina 850mg 12/12h'],
      pergunta: 'Além da medicação cardiovascular pós-IAM, qual classe de antidiabético oral traz benefício comprovado na redução de eventos cardiovasculares e insuficiência cardíaca para Dona Maria?',
      opcoes: [
        'A) Glibenclamida (Sulfonilureia).',
        'B) Inibidores do SGLT2 (ex: Empaglifozina ou Dapaglifozina).',
        'C) Insulina NPH em doses elevadas isoladas.',
        'D) Acarbose.'
      ],
      correta: 1,
      explicacao: 'Inibidores do SGLT2 demonstram redução de mortalidade cardiovascular, internações por IC e progressão de doença renal em pacientes pós-infarto com Diabetes.'
    }
  },

  // CASO 3: Sr. Roberto Oliveira (Alta / IAM Inferior + VD)
  {
    id: 'roberto',
    nome: 'Sr. Roberto Oliveira',
    idade: 55,
    genero: 'Masculino',
    ocupacao: 'Motorista de Caminhão',
    queixaPrincipal: 'Dor epigástrica intensa e sensação de peso no peito há 1h30m. Apresenta-se pálido, hipotenso (PA 80/50 mmHg) e com turgência jugular a 45°.',
    tempoInicioSintomas: '1 hora e 30 minutos',
    complexidade: 4,
    corDestaque: '#A855F7',
    resumoClinico: 'IAMST de Parede Inferior com extensão grave para Ventrículo Direito (VD). Paciente volumodependente com profunda hipotensão arterial.',
    fatoresDeRisco: ['Tabagismo pesado (40 maços/ano)', 'Dislipidemia não tratada', 'Estresse ocupacional'],
    triagem: {
      titulo: 'Triagem Manchester: Sr. Roberto',
      pergunta: 'Sr. Roberto apresenta dor torácica/epigástrica intensa acompanhada de hipotensão (PA 80/50 mmHg) e palidez. Qual a classificação de risco?',
      opcoes: [
        'A) Vermelho (Emergência - Risco iminente de morte por choque)',
        'B) Amarelo (Urgente - Atendimento em até 60 minutos)',
        'C) Verde (Pouco Urgente)',
        'D) Laranja (Pode aguardar 10 minutos na recepção sem monitorização)'
      ],
      correta: 0,
      explicacao: 'Dor torácica associada à hipotensão severa/sinais de choque hemodinâmico classifica o paciente na cor Vermelha (atendimento imediato na Sala Vermelha).',
      classificacaoEsperada: 'Vermelho'
    },
    anamnese: {
      sinaisVitais: {
        pa: '80/50 mmHg (Hipotensão grave)',
        fc: '54 bpm (Bradicardia sinusal)',
        fr: '20 irpm',
        spo2: '94% em ar ambiente',
        tax: '35.9 °C'
      },
      perguntas: [
        {
          titulo: 'Passo 1: Tríade do Infarto de VD',
          texto: 'Ao constatar Hipotensão + Turgência Jugular + Pulmões Limpos sem estertores no Sr. Roberto, qual hipótese de acometimento ventricular deve ser levantada?',
          opcoes: [
            'A) Infarto isolado de parede lateral.',
            'B) Acometimento e falência aguda de Ventrículo Direito (Acometimento de VD).',
            'C) Edema Agudo de Pulmão por Insuficiência Ventricular Esquerda grave.',
            'D) Tamponamento cardíaco traumático.'
          ],
          correta: 1,
          explicacao: 'A tríade hipotensão + turgência jugular + ausculta pulmonar limpa é a apresentação clássica do acometimento do Ventrículo Direito no IAM de parede inferior.'
        },
        {
          titulo: 'Passo 2: Investigação de Uso de Substâncias',
          texto: 'Antes de prescrever vasodilatadores em pacientes hipotensos com dor torácica, o que deve ser ativamente interrogado?',
          opcoes: [
            'A) Consumo de café matinal.',
            'B) Uso de Inibidores da 5-Fosfodiesterase (Sildenafil/Tadalafil) nas últimas 24-48 horas.',
            'C) Uso de suplementos de vitamina C.',
            'D) Consumo de adoçantes artificiais.'
          ],
          correta: 1,
          explicacao: 'O uso de inibidores da PDE-5 (Sildenafil/Tadalafil) em conjunto com Nitratos pode provocar hipotensão refratária e colapso circulatório fatal.'
        },
        {
          titulo: 'Passo 3: Exame Físico Específico',
          texto: 'Diante do achado eletrocardiográfico de supra em DII, DIII e aVF, qual conduta diagnóstica imediata deve ser realizada na máquina de ECG?',
          opcoes: [
            'A) Rodar derivadas direitas adicionais (V3R e V4R).',
            'B) Desligar o equipamento de ECG.',
            'C) Fazer apenas ECG de 3 derivações simples.',
            'D) Aguardar 24 horas para repetir o exame.'
          ],
          correta: 0,
          explicacao: 'Todo IAM de parede inferior exige a realização imediata das derivadas direitas (V3R e V4R) para pesquisar oclusão de Coronária Direita proximal e infarto de VD.'
        }
      ]
    },
    ecg: {
      achadoPrincipal: 'Supra de ST em DII, DIII, aVF e Supra de ST ≥ 1mm em V3R e V4R',
      descricaoCompleta: 'Supradesnivelamento de ST nas derivadas inferiores (DII, DIII > DII, aVF) com infra de ST de imagem em espelho em DI e aVL. Derivadas direitas confirmam Supra de ST em V3R e V4R.',
      paredeAtingida: 'Parede Inferior + Ventrículo Direito',
      coronariaProvavel: 'Artéria Coronária Direita (CD) Proximal',
      pergunta: 'O ECG do Sr. Roberto confirma Supra de ST em DII, DIII, aVF e em V4R. Qual a medicação rotineira de dor torácica que está estritamente CONTRAINDICADA neste paciente?',
      opcoes: [
        'A) Dinitrato de Isossorbida / Nitroglicerina (Nitratos) e Morfina.',
        'B) Soro Fisiológico 0.9%.',
        'C) AAS (Ácido Acetilsalicílico).',
        'D) Clopidogrel.'
      ],
      correta: 0,
      explicacao: 'Nitratos e Morfina reduzem drasticamente a pré-carga. No infarto de VD, o ventrículo direito é totalmente volumodependente; venodilatadores podem induzir choque cardiogênico severo.'
    },
    protocolo: {
      titulo: 'Manejo Hemodinâmico Específico do IAM de VD',
      cenario: 'Paciente hipotenso (PA 80/50 mmHg), bradicárdico e com infarto de VD confirmado.',
      pergunta: 'Qual a medida terapêutica inicial prioritária para estabilização da pressão arterial no Sr. Roberto antes da Angioplastia?',
      opcoes: [
        'A) Administrar Furosemida (diurético de alça) em altas doses.',
        'B) Expansão volumétrica imediata com Soro Fisiológico 0.9% (500 a 1000 mL) para otimizar a pré-carga do VD.',
        'C) Iniciar infusão imediata de Nitroglicerina contínua.',
        'D) Aplicar compressão torácica imediata.'
      ],
      correta: 1,
      explicacao: 'O VD infartado depende de alta pressão de enchimento atrioventricular direito. A reposição volêmica com cristaloides é a primeira linha para restaurar a PA no infarto de VD.'
    },
    enzimas: {
      curvaTroponina: 'Troponina I: 6.200 ng/L',
      ckmb: 'CK-MB: 54 ng/mL',
      outrosExames: 'Gasometria Arterial: Lactato 3.8 mmol/L (indicativo de hipoperfusão tecidual)',
      pergunta: 'A elevação do Lactato arterial no Sr. Roberto traduz qual estado clínico?',
      opcoes: [
        'A) Alcalose respiratória por hiperventilação simples.',
        'B) Hipoperfusão tecidual sistêmica e sofrimento celular secundário à hipotensão do IAM de VD.',
        'C) Atividade física excessiva prévia.',
        'D) Função hepática superestimada.'
      ],
      correta: 1,
      explicacao: 'O lactato elevado é marcador de metabolismo anaeróbico por hipoperfusão tecidual no choque circulatório.'
    },
    alta: {
      orientacoes: [
        'Evitar desidratação e o uso de vasodilatadores sem estrita orientação médica.',
        'Manter dupla antiagregação e estatina.',
        'Programa intensivo de cessação do tabagismo.'
      ],
      prescricaoSecundaria: ['AAS 100mg/dia', 'Ticagrelor 90mg 12/12h', 'Rosuvastatina 40mg/dia', 'Atenolol 25mg/dia (após estabilização)'],
      pergunta: 'Na alta do Sr. Roberto, qual intervenção de estilo de vida tem maior impacto na redução de reinfarto e mortalidade no paciente tabagista?',
      opcoes: [
        'A) Reduzir o consumo de sal isoladamente.',
        'B) Cessação completa do Tabagismo (com apoio comportamental/farmacológico).',
        'C) Suplementação com vitaminas lipossolúveis.',
        'D) Evitar exposição solar.'
      ],
      correta: 1,
      explicacao: 'A interrupção do tabagismo reduz em até 50% o risco de novo evento coronariano em pacientes pós-IAM.'
    }
  },

  // CASO 4: Sr. Antônio "Tonho" Silva (Crítico / BAVT & Choque Cardiogênico)
  {
    id: 'antonio',
    nome: 'Sr. Antônio Silva',
    idade: 68,
    genero: 'Masculino',
    ocupacao: 'Agricultor',
    queixaPrincipal: 'Dor torácica há 4 horas, associada a tontura extrema, confusão mental, sudorese fria e extremidades cianóticas.',
    tempoInicioSintomas: '4 horas',
    complexidade: 5,
    corDestaque: '#DC2626',
    resumoClinico: 'IAMST de Parede Inferodorsal complicado com Bloqueio Atrioventricular Total (BAVT - BAV de 3º grau) e Choque Cardiogênico.',
    fatoresDeRisco: ['Hipertensão Arterial severa não tratada', 'Dislipidemia', 'Idade de 68 anos'],
    triagem: {
      titulo: 'Triagem Manchester: Sr. Antônio',
      pergunta: 'Sr. Antônio chega com tontura grave, confusão mental, FC de 32 bpm e PA de 70/40 mmHg. Qual a classificação de risco imediata?',
      opcoes: [
        'A) Vermelho (Emergência - Instabilidade hemodinâmica grave e bradicardia crítica)',
        'B) Laranja',
        'C) Amarelo',
        'D) Verde'
      ],
      correta: 0,
      explicacao: 'Instabilidade hemodinâmica crítica com rebaixamento de consciência e bradicardia severa exige atendimento IMEDIATO na Sala Vermelha.',
      classificacaoEsperada: 'Vermelho'
    },
    anamnese: {
      sinaisVitais: {
        pa: '70/40 mmHg (Choque profundo)',
        fc: '32 bpm (Bradicardia grave)',
        fr: '26 irpm',
        spo2: '88% em ar ambiente',
        tax: '35.4 °C'
      },
      perguntas: [
        {
          titulo: 'Passo 1: Identificação de Complicação Elétrica',
          texto: 'A extrema bradicardia (FC 32 bpm) no Sr. Antônio é uma complicação clássica de infarto em qual parede ventricular?',
          opcoes: [
            'A) Parede Inferior (pela irrigação do Nó AV pela Artéria Coronária Direita em 90% dos indivíduos).',
            'B) Parede Anterior isolada.',
            'C) Parede Lateral alta.',
            'D) Átrio esquerdo isolado.'
          ],
          correta: 0,
          explicacao: 'A Coronária Direita irriga o Nó Atrioventricular (Nó AV) na grande maioria das pessoas. Infartos inferiores com oclusão proximal frequentemente causam BAVT por isquemia nodal.'
        },
        {
          titulo: 'Passo 2: Perfusão Tecidual',
          texto: 'Quais sinais ao exame físico indicam Choque Cardiogênico no Sr. Antônio?',
          opcoes: [
            'A) Extremidades frias, tempo de enchimento capilar > 3 segundos, oligúria e confusão mental.',
            'B) Pele quente e corada com rubor facial.',
            'C) Pulsos amplos e cheios.',
            'D) Hiperatividade e agitação psicomotora leve.'
          ],
          correta: 0,
          explicacao: 'Sinais de má perfusão tecidual (membros frios/marmorados, TEC prolongado, oligúria e alteração do sensorium) caracterizam o choque.'
        },
        {
          titulo: 'Passo 3: Suporte Ventilatório',
          texto: 'Com SpO2 de 88% e estertoração creptante bilateral até terços médios, qual a indicação de suporte de oxigênio?',
          opcoes: [
            'A) Não oferecer oxigênio.',
            'B) Oxigenoterapia imediata (Máscara não reinalante com reservatório ou VNI/Intubação se rebaixamento persistente).',
            'C) Sedação isolada sem oxigênio.',
            'D) Inalação com soro fisiológico apenas.'
          ],
          correta: 1,
          explicacao: 'Hipoxemia (SpO2 < 90%) associada a congestionamento pulmonar exige suplementação de oxigênio imediata.'
        }
      ]
    },
    ecg: {
      achadoPrincipal: 'Dissociação Atrioventricular Completa (BAVT) com RR regular de 32 bpm + Supra de ST em DII, DIII, aVF e V7-V9',
      descricaoCompleta: 'Ondas P (100 bpm) sem relação com complexos QRS largos e lentos (32 bpm). Supradesnivelamento de ST inferior e posterior (V7-V9).',
      paredeAtingida: 'Parede Inferodorsal + Isquemia do Nó AV',
      coronariaProvavel: 'Artéria Coronária Direita (CD) Dominante Ocluída na Origem',
      pergunta: 'O ECG do Sr. Antônio revela Bloqueio AV Total (BAVT) com FC de 32 bpm e instabilidade. Qual a medicação farmacológica de primeira linha e qual a medida elétrica de emergência?',
      opcoes: [
        'A) Atropina IV (0.5 a 1mg) e instalação imediata de Marcapasso Transcutâneo.',
        'B) Amiodarona IV em bolus rápido.',
        'C) Adenosina 6mg IV em bolus.',
        'D) Diltiazem IV.'
      ],
      correta: 0,
      explicacao: 'Para bradicardia sintomática/instável por BAVT, Atropina IV é a primeira medida farmacológica enquanto se instala o Marcapasso Transcutâneo de emergência.'
    },
    protocolo: {
      titulo: 'Manejo do Choque Cardiogênico e Reperfusão de Emergência',
      cenario: 'Paciente com BAVT marcapassado, mantendo PA 75/45 mmHg sob choque cardiogênico.',
      pergunta: 'No manejo farmacológico do Choque Cardiogênico pós-IAM no Sr. Antônio, qual inotrópico vasoativo é indicado para melhorar a contratilidade miocárdica e o débito cardíaco?',
      opcoes: [
        'A) Dobutamina IV em infusão contínua (associada a Noradrenalina se hipotensão grave persistir).',
        'B) Propranolol IV em bolus.',
        'C) Verapamil IV.',
        'D) Nitroprussiato de Sódio em alta dose.'
      ],
      correta: 0,
      explicacao: 'Dobutamina é o inotrópico de escolha para choque cardiogênico para aumentar o débito cardíaco. Noradrenalina pode ser associada para manter a PAM mínima.'
    },
    enzimas: {
      curvaTroponina: 'Troponina T: 12.500 ng/L (maciça)',
      ckmb: 'CK-MB: 110 ng/mL',
      outrosExames: 'Lactato: 5.9 mmol/L, Creatinina: 2.1 mg/dL (Dano renal agudo pré-renal)',
      pergunta: 'A disfunção renal aguda (Creatinina 2.1) e o Lactato alto no Sr. Antônio decorrem de:',
      opcoes: [
        'A) Infecção do trato urinário associada.',
        'B) Hipoperfusão orgânica grave e baixo débito cardíaco do Choque Cardiogênico.',
        'C) Erro de coleta laboratorial.',
        'D) Doença renal policística congênita.'
      ],
      correta: 1,
      explicacao: 'A falência de bomba reduz o débito cardíaco, levando à hipoperfusão renal (IRA pré-renal) e hiperlactatemia.'
    },
    alta: {
      orientacoes: [
        'Acompanhamento estrito em UTI coronariana pós-angioplastia com implante de Stent Farmacológico.',
        'Avaliação de necessidade de Marcapasso Definitivo se BAVT persistir após revascularização.',
        'Reabilitação cardíaca em fase hospitalar precoce.'
      ],
      prescricaoSecundaria: ['AAS 100mg/dia', 'Ticagrelor 90mg 12/12h', 'Atorvastatina 80mg/dia', 'Furosemida 20mg/dia'],
      pergunta: 'Após a angioplastia primária e desobstrução da Coronária Direita no Sr. Antônio, o que costuma ocorrer com o Bloqueio AV Total isquêmico na maioria dos casos?',
      opcoes: [
        'A) O BAVT é sempre irreversível e exige marcapasso definitivo em 100% dos pacientes imediatamente.',
        'B) O BAVT em IAM inferior costuma ser transitório e regredir após a reperfusão coronariana adequada do nó AV.',
        'C) Evolui obrigatoriamente para Fibrilação Ventricular.',
        'D) Transforma-se em Bloqueio de Ramo Esquerdo permanente.'
      ],
      correta: 1,
      explicacao: 'Diferente do IAM anterior, o BAVT no IAM inferior é habitualmente supra-hisiano e transitório, revertendo frequentemente após a reperfusão coronariana.'
    }
  },

  // CASO 5: Dra. Elena Vasconcelos (Especial / MINOCA - Espasmo Coronariano)
  {
    id: 'elena',
    nome: 'Dra. Elena Vasconcelos',
    idade: 48,
    genero: 'Feminino',
    ocupacao: 'Médica Cirurgiã',
    queixaPrincipal: 'Dor torácica em aperto de forte intensidade ocorrendo de madrugada no repouso (às 04:00h), durando 20 minutos com resolução espontânea.',
    tempoInicioSintomas: '1 hora (episódios recorrentes no repouso)',
    complexidade: 5,
    corDestaque: '#14B8A6',
    resumoClinico: 'Quadro de MINOCA (Infarto sem Obstrução Coronariana Relevante) secundário a Vasoespasmo Coronariano Agudo (Angina de Prinzmetal).',
    fatoresDeRisco: ['Tabagismo ocasional', 'Estresse emocional elevado', 'Enxaqueca prévia'],
    triagem: {
      titulo: 'Triagem Manchester: Dra. Elena',
      pergunta: 'Dra. Elena (48a) relata dor torácica opressiva pré-precordial em repouso de madrugada. Qual a prioridade de atendimento?',
      opcoes: [
        'A) Laranja (Muito Urgente - Avaliação cardiológica e ECG imediato)',
        'B) Verde - Pois a paciente é jovem e sem histórico de diabetes.',
        'C) Azul - Encaminhar para consulta psicológica.',
        'D) Amarelo - Atendimento em 2 horas.'
      ],
      correta: 0,
      explicacao: 'Dor torácica de início recente no repouso exige investigação imediata para afastar síndrome coronariana aguda (Laranja).',
      classificacaoEsperada: 'Laranja'
    },
    anamnese: {
      sinaisVitais: {
        pa: '130/80 mmHg',
        fc: '76 bpm',
        fr: '16 irpm',
        spo2: '98% em ar ambiente',
        tax: '36.6 °C'
      },
      perguntas: [
        {
          titulo: 'Passo 1: Padrão Temporal da Angina de Prinzmetal',
          texto: 'Qual a característica marcante do horário de surgimento da dor na Angina Vasoespástica (Prinzmetal) da Dra. Elena?',
          opcoes: [
            'A) Ocorre exclusivamente durante o exercício físico máximo.',
            'B) Ocorre tipicamente no repouso, frequentemente de madrugada ou primeiras horas da manhã.',
            'C) Surge apenas após a ingestão de refeições gordurosas.',
            'D) Ocorre ao se deitar de bruços.'
          ],
          correta: 1,
          explicacao: 'O vasoespasmo coronariano hiper-reativo ocorre predominantemente no repouso noturno/madrugada devido a alterações no tônus autonômico vasomotor.'
        },
        {
          titulo: 'Passo 2: Fatores Desencadeantes de Vasoespasmo',
          texto: 'Quais gatilhos podem precipitar os episódios de vasoespasmo coronariano?',
          opcoes: [
            'A) Tabagismo, estresse emocional agudo, exposição ao frio e uso de vasoconstritores (ex: descongestionantes ou cocaína).',
            'B) Consumo de água gelada.',
            'C) Ingestão de frutas cítricas.',
            'D) Prática de meditação.'
          ],
          correta: 0,
          explicacao: 'Nicotina, estresse, frio intenso e drogas vasoconstritoras impulsionam hiper-reatividade muscular lisa vascular nas coronárias.'
        },
        {
          titulo: 'Passo 3: Investigação de Doenças Associadas',
          texto: 'A associação de Angina Vasoespástica com Enxaqueca e Fenômeno de Raynaud sugere:',
          opcoes: [
            'A) Uma hiper-reatividade vascular vasospástica generalizada.',
            'B) Ausência de qualquer alteração vascular.',
            'C) Infecção viral aguda.',
            'D) Doença pulmonar obstrutiva.'
          ],
          correta: 0,
          explicacao: 'Vasoespasmo coronariano pode fazer parte de uma síndrome de hiper-reatividade vascular sistêmica (com Raynaud e enxaqueca).'
        }
      ]
    },
    ecg: {
      achadoPrincipal: 'Supradesnivelamento de ST transitório em D1, aVL e V5-V6 durante o episódio de dor, com normalização completa após alívio',
      descricaoCompleta: 'ECG realizado durante a crise de dor mostrou Supra de ST lateral (D1, aVL, V5, V6). Repetido 15 minutos após alívio da dor, o ECG retornou ao padrão totalmente normal.',
      paredeAtingida: 'Isquemia Transmural Transitória de Parede Lateral',
      coronariaProvavel: 'Espasmo de Artéria Circumflexa ou Ramo Diagonal da DA',
      pergunta: 'A alteração de Supra de ST TRANSITÓRIO que se normaliza completamente após a resolução da dor é a marca eletrocardiográfica de:',
      opcoes: [
        'A) Infarto transmural fixo com necrose estabelecida.',
        'B) Isquemia transmural transitória por Vasoespasmo Coronariano Agudo (Angina de Prinzmetal).',
        'C) Bloqueio de Ramo Esquerdo fixo.',
        'D) Pericardite crônica constritiva.'
      ],
      correta: 1,
      explicacao: 'O supra de ST que desaparece quando a dor cessa reflete oclusão coronariana funcional transitória sem trombose fixa.'
    },
    protocolo: {
      titulo: 'Tratamento Farmacológico do Vasoespasmo e MINOCA',
      cenario: 'Coronariografia (CATE) realizada demonstrando coronárias epicárdicas ISENTAS de lesões obstrutivas (MINOCA).',
      pergunta: 'Qual a classe de medicamentos de PRIMEIRA LINHA para prevenção de novos episódios de vasoespasmo coronariano na Dra. Elena?',
      opcoes: [
        'A) Betabloqueadores não seletivos em altas doses (ex: Propranolol).',
        'B) Bloqueadores dos Canais de Cálcio (ex: Diltiazem, Verapamil ou Amlodipina) e Nitratos de longa ação.',
        'C) Fibrinolíticos IV diários.',
        'D) Anticoagulação oral com Varfarina.'
      ],
      correta: 1,
      explicacao: 'Bloqueadores dos Canais de Cálcio relaxam a musculatura lisa coronariana e são o tratamento de escolha para vasoespasmo. Betabloqueadores sem oposição alfa podem piorar o vasoespasmo.'
    },
    enzimas: {
      curvaTroponina: 'Troponina I ultrassensível: 380 ng/L (Leve elevação indicando MINOCA)',
      ckmb: 'CK-MB: 12 ng/mL',
      outrosExames: 'Ressonância Magnética Cardíaca (RMC): Realce tardio mesocardíaco/subendocárdico focal confirmando necrose isquêmica focal sem obstrução maciça',
      pergunta: 'Qual o papel da Ressonância Magnética Cardíaca (RMC) na investigação de MINOCA (Infarto sem Obstrução Coronariana)?',
      opcoes: [
        'A) Não possui qualquer utilidade diagnóstica.',
        'B) Diferenciar lesão isquêmica miocárdica de Miocardite ou Miocardiopatia de Takotsubo.',
        'C) Substituir a amnese inicial.',
        'D) Diagnosticar embolia pulmonar.'
      ],
      correta: 1,
      explicacao: 'A RMC é o exame padrão-ouro na investigação de MINOCA para diferenciar infarto vasoespástico/embólico de miocardite aguda e síndrome de Takotsubo.'
    },
    alta: {
      orientacoes: [
        'Manter uso contínuo de Bloqueador de Canal de Cálcio (ex: Diltiazem ou Amlodipina).',
        'Cessação total do tabagismo e controle rigoroso do estresse.',
        'EVITAR o uso de Betabloqueadores não seletivos e triptanos (medicações de enxaqueca que causam vasoconstrição).'
      ],
      prescricaoSecundaria: ['Diltiazem 180mg/dia (ou Amlodipina 10mg)', 'Mononitrato de Isossorbida 40mg/dia', 'Atorvastatina 20mg/dia'],
      pergunta: 'Na orientação de alta da Dra. Elena (MINOCA por vasoespasmo), qual medicação para crise de enxaqueca está CONTRAINDICADA por poder induzir espasmo coronariano grave?',
      opcoes: [
        'A) Dipirona.',
        'B) Triptanos (ex: Sumatriptana) e derivados do Ergot.',
        'C) Paracetamol.',
        'D) Metoclopramida.'
      ],
      correta: 1,
      explicacao: 'Triptanos e ergotamínicos são agonistas de receptores serotonérgicos vasoconstritores e podem desencadear vasoespasmo coronariano grave.'
    }
  }
];

export function getAllPatients(): PatientCase[] {
  return PATIENTS_DATA;
}

export function getPatientById(id: string): PatientCase {
  const patient = PATIENTS_DATA.find(p => p.id === id);
  return patient || PATIENTS_DATA[0]; // Fallback para o Sr. Carlos
}
