import 'package:shared_preferences/shared_preferences.dart';
import '../models/caso_clinico.dart';

class CasosClinicosData {
  static const List<CasoClinico> casos = [
    CasoClinico(
      id: 'caso_1',
      nome: 'Carlos Mendes',
      dificuldade: 'FÁCIL',
      nivel: 1,
      idade: 62,
      sexo: 'Masculino',
      leito: 'Leito 02',
      sala: 'Sala Vermelha (Emergência)',
      gravidade: 'GRAVE',
      classificacaoManchester: 'Vermelho (0 min)',
      tempoMinutos: 0,
      avatar: '👴',
      avatarAsset: 'assets/avatars/avatar_carlos.jpg',
      medicoResponsavel: 'Dr. Rafael Costa (Cardio)',
      queixaPrincipal: 'Dor torácica opressiva (9/10) irradiada para membro superior esquerdo e mandíbula há 40 minutos, associada a sudorese fria e dispneia.',
      evolucaoClinica: 'Paciente monitorizado na Sala Vermelha. Mantém dor torácica intensa, ansioso mas responsivo. ECG com supra de ST em parede anterior (V1-V4).',
      conduta: 'Monitorização contínua, O2 suplementar se SpO2 < 90%, Acesso venoso duplo calibroso, Protocolo MONA imediato e acionamento da Hemodinâmica.',
      frequenciaCardiaca: '118 bpm',
      pressaoArterial: '160/100 mmHg',
      saturacaoO2: '92%',
      temperatura: '37.8 °C',
      fcCritica: true,
      paCritica: true,
      spo2Critica: true,
      ecgResumo: 'IAMCSST Parede Anterior (Supra ST V1-V4)',
      enzimasResumo: 'Troponina I: 14.8 ng/mL (Elevada) • CK-MB: 48 U/L',
    ),
    CasoClinico(
      id: 'caso_2',
      nome: 'Maria da Graça',
      dificuldade: 'MÉDIO',
      nivel: 2,
      idade: 58,
      sexo: 'Feminino',
      leito: 'Leito 06',
      sala: 'Unidade Semi-Intensiva',
      gravidade: 'MODERADO',
      classificacaoManchester: 'Laranja (10 min)',
      tempoMinutos: 10,
      avatar: '👵',
      avatarAsset: 'assets/avatars/avatar_maria.jpg',
      medicoResponsavel: 'Dra. Camila Torres (Cardio)',
      queixaPrincipal: 'Desconforto epigástrico e cansaço aos mínimos esforços iniciado há 3 horas em paciente diabética. Nega dor típica em aperto.',
      evolucaoClinica: 'Quadro atípico de equivalente isquêmico em paciente diabética. ECG sem supra de ST, porém com inversão simétrica de onda T em V5 e V6.',
      conduta: 'Estratificação de risco com curva seriada de Troponina (0h e 3h), AAS 200mg, Nitrato sublingual se dor e internação em UCO.',
      frequenciaCardiaca: '92 bpm',
      pressaoArterial: '145/90 mmHg',
      saturacaoO2: '96%',
      temperatura: '36.6 °C',
      fcCritica: false,
      paCritica: false,
      spo2Critica: false,
      ecgResumo: 'IAMSSST / Inversão de T em parede lateral',
      enzimasResumo: 'Troponina 0h: 0.12 ng/mL • Curva 3h pendente',
    ),
    CasoClinico(
      id: 'caso_3',
      nome: 'Helena Souza',
      dificuldade: 'DIFÍCIL',
      nivel: 3,
      idade: 71,
      sexo: 'Feminino',
      leito: 'Leito 12',
      sala: 'Sala Vermelha (CTI)',
      gravidade: 'GRAVE',
      classificacaoManchester: 'Vermelho (0 min)',
      tempoMinutos: 0,
      avatar: '🧓',
      avatarAsset: 'assets/avatars/avatar_helena.jpg',
      medicoResponsavel: 'Dr. Rafael Costa (CTI)',
      queixaPrincipal: 'Dispneia intensa em repouso com tosse produtiva e escarro róseo, turgência jugular e estertores crepitantes difusos até ápice pulmonar.',
      evolucaoClinica: 'Edema Agudo de Pulmão (EAP) cardiogênico pós-infarto com hipotensão e má perfusão periférica.',
      conduta: 'Ventilação Não-Invasiva (VNI/CPAP), Furosemida IV, Vasodilatador se PA permitir e monitorização hemodinâmica invasiva.',
      frequenciaCardiaca: '132 bpm',
      pressaoArterial: '180/110 mmHg',
      saturacaoO2: '84%',
      temperatura: '36.9 °C',
      fcCritica: true,
      paCritica: true,
      spo2Critica: true,
      ecgResumo: 'Taquicardia Sinusal com Sobrecarga Ventricular Esquerda',
      enzimasResumo: 'BNP: 1850 pg/mL (Crítico) • Troponina positiva',
    ),
  ];

  /// Verifica se o caso clínico está desbloqueado para o jogador
  /// Regra:
  /// - Caso 1 (Fácil): Sempre liberado
  /// - Caso 2 (Médio): Liberado ao concluir os 6 módulos do Caso 1
  /// - Caso 3 (Difícil): Liberado ao concluir os 6 módulos do Caso 2
  static bool isCasoDesbloqueado(String casoId, SharedPreferences prefs) {
    if (casoId == 'caso_1') return true;
    if (casoId == 'caso_2') {
      return (prefs.getBool('venceu_caso_1_mod6') ?? false);
    }
    if (casoId == 'caso_3' || casoId == 'caso_4') {
      return (prefs.getBool('venceu_caso_2_mod6') ?? false);
    }
    return false;
  }

  /// Retorna a mensagem informativa de bloqueio para o caso
  static String obterMensagemBloqueio(String casoId) {
    if (casoId == 'caso_2') {
      return 'Nível Bloqueado! Conclua todos os 6 módulos de Carlos Mendes (Nível Fácil) para desbloquear Maria da Graça (Nível Médio).';
    }
    if (casoId == 'caso_3' || casoId == 'caso_4') {
      return 'Nível Bloqueado! Conclua todos os 6 módulos de Maria da Graça (Nível Médio) para desbloquear Helena Souza (Nível Difícil).';
    }
    return 'Caso clínico bloqueado.';
  }

  /// Consulta a conclusão de módulo com retrocompatibilidade para chave migrada
  static bool isModuloConcluido(String casoId, int modulo, SharedPreferences prefs) {
    if (prefs.getBool('venceu_${casoId}_mod$modulo') == true) return true;
    if (casoId == 'caso_3' && prefs.getBool('venceu_caso_4_mod$modulo') == true) return true;
    return false;
  }
}
