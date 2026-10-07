/// Modelo de Domínio para Casos Clínicos no CardioQuest
class CasoClinico {
  final String id;
  final String nome;
  final int idade;
  final String sexo;
  final String leito;
  final String sala;
  final String gravidade; // GRAVE, MODERADO, LEVE
  final String classificacaoManchester; // Vermelho, Laranja, Amarelo, Verde, Azul
  final int tempoMinutos;
  final String avatar;
  final String? avatarAsset;
  final String medicoResponsavel;
  final String queixaPrincipal;
  final String evolucaoClinica;
  final String conduta;
  final String frequenciaCardiaca;
  final String pressaoArterial;
  final String saturacaoO2;
  final String temperatura;
  final bool fcCritica;
  final bool paCritica;
  final bool spo2Critica;
  final String ecgResumo;
  final String enzimasResumo;

  const CasoClinico({
    required this.id,
    required this.nome,
    required this.idade,
    required this.sexo,
    required this.leito,
    required this.sala,
    required this.gravidade,
    required this.classificacaoManchester,
    required this.tempoMinutos,
    required this.avatar,
    this.avatarAsset,
    required this.medicoResponsavel,
    required this.queixaPrincipal,
    required this.evolucaoClinica,
    required this.conduta,
    required this.frequenciaCardiaca,
    required this.pressaoArterial,
    required this.saturacaoO2,
    required this.temperatura,
    this.fcCritica = false,
    this.paCritica = false,
    this.spo2Critica = false,
    required this.ecgResumo,
    required this.enzimasResumo,
  });
}
