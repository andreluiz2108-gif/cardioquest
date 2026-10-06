import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../theme/cardio_theme.dart';
import '../widgets/cardio_hud_card.dart';

class TrofeusScreen extends StatefulWidget {
  const TrofeusScreen({super.key});

  @override
  State<TrofeusScreen> createState() => _TrofeusScreenState();
}

class _TrofeusScreenState extends State<TrofeusScreen> {
  bool _temMedalha1 = false;
  bool _temMedalha2 = false;
  bool _temMedalha3 = false;
  bool _temMedalha4 = false;
  bool _temMedalha5 = false;
  bool _temMedalha6 = false;
  int _xpTotal = 0;

  final List<Map<String, dynamic>> _listaTrofeus = [
    {
      'id': 1,
      'titulo': 'Olho Clínico de Triagem',
      'subtitulo': 'Classificação de risco precisa pelo Protocolo Manchester',
      'competencia': 'Módulo 1 • Sala Vermelha',
      'xp': '+150 XP',
      'icone': Icons.filter_alt_outlined,
      'cor': CardioTheme.statusGrave,
    },
    {
      'id': 2,
      'titulo': 'Detetive da Anamnese',
      'subtitulo': 'Mapeamento de dor típica, fatores de risco e alergias vitais',
      'competencia': 'Módulo 2 • Investigação Clínica',
      'xp': '+150 XP',
      'icone': Icons.history_edu_outlined,
      'cor': CardioTheme.cyanAccent,
    },
    {
      'id': 3,
      'titulo': 'Águia do ECG',
      'subtitulo': 'Identificação do IAM com Supra de ST em menos de 10 minutos',
      'competencia': 'Módulo 3 • Telemetria 12D',
      'xp': '+200 XP',
      'icone': Icons.monitor_heart_outlined,
      'cor': CardioTheme.primary,
    },
    {
      'id': 4,
      'titulo': 'Mestre do Protocolo MONA',
      'subtitulo': 'Prescrição farmacológica assertiva para alívio e reperfusão',
      'competencia': 'Módulo 4 • Farmacologia',
      'xp': '+200 XP',
      'icone': Icons.medication_outlined,
      'cor': Colors.purpleAccent,
    },
    {
      'id': 5,
      'titulo': 'Bioquímica Cardíaca',
      'subtitulo': 'Interpretação da curva de Troponina e vigilância de reinfarto',
      'competencia': 'Módulo 5 • Biomarcadores',
      'xp': '+150 XP',
      'icone': Icons.biotech_outlined,
      'cor': Colors.indigoAccent,
    },
    {
      'id': 6,
      'titulo': 'Alta & Reabilitação Segura',
      'subtitulo': 'Educação em saúde para prevenção de novos eventos isquêmicos',
      'competencia': 'Módulo 6 • Desfecho Clínico',
      'xp': '+200 XP',
      'icone': Icons.health_and_safety_outlined,
      'cor': CardioTheme.secondary,
    },
  ];

  @override
  void initState() {
    super.initState();
    _carregarMedalhas();
  }

  Future<void> _carregarMedalhas() async {
    final prefs = await SharedPreferences.getInstance();
    if (mounted) {
      setState(() {
        _temMedalha1 = prefs.getBool('venceu_mod1') ?? false;
        _temMedalha2 = prefs.getBool('venceu_mod2') ?? false;
        _temMedalha3 = prefs.getBool('venceu_mod3') ?? false;
        _temMedalha4 = prefs.getBool('venceu_mod4') ?? false;
        _temMedalha5 = prefs.getBool('venceu_mod5') ?? false;
        _temMedalha6 = prefs.getBool('venceu_mod6') ?? false;
        _xpTotal = prefs.getInt('xpEnfermeiro') ?? 0;
      });
    }
  }

  bool _isDesbloqueado(int index) {
    switch (index) {
      case 0:
        return _temMedalha1;
      case 1:
        return _temMedalha2;
      case 2:
        return _temMedalha3;
      case 3:
        return _temMedalha4;
      case 4:
        return _temMedalha5;
      case 5:
        return _temMedalha6;
      default:
        return false;
    }
  }

  @override
  Widget build(BuildContext context) {
    int totalDesbloqueadas = [
      _temMedalha1,
      _temMedalha2,
      _temMedalha3,
      _temMedalha4,
      _temMedalha5,
      _temMedalha6
    ].where((m) => m).length;

    return Scaffold(
      backgroundColor: CardioTheme.background,
      appBar: AppBar(
        backgroundColor: CardioTheme.surface,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: CardioTheme.primary, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'GALERIA DE CONQUISTAS & MEDALHAS',
          style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, letterSpacing: 1.2),
        ),
      ),
      body: CyberGridBackground(
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(20.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // 1. Resumo Superior HUD Compacto
                CardioHudCard(
                  isGlowing: true,
                  glowColor: CardioTheme.statusUrgente,
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: CardioTheme.statusUrgente.withValues(alpha: 0.15),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: CardioTheme.statusUrgente, width: 1.5),
                            ),
                            child: const Icon(Icons.emoji_events, color: CardioTheme.statusUrgente, size: 24),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'PROGRESSO DE CARREIRA CLÍNICA',
                                  style: TextStyle(
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                    letterSpacing: 1.1,
                                    color: CardioTheme.statusUrgente,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  '$totalDesbloqueadas DE 6 CONQUISTAS DESBLOQUEADAS',
                                  style: const TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.bold,
                                    color: CardioTheme.textPrimary,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: CardioTheme.primary.withValues(alpha: 0.15),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: CardioTheme.primary, width: 1),
                            ),
                            child: Text(
                              '$_xpTotal XP',
                              style: const TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.bold,
                                color: CardioTheme.primary,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(4),
                        child: LinearProgressIndicator(
                          value: totalDesbloqueadas / 6.0,
                          minHeight: 6,
                          backgroundColor: CardioTheme.surfaceElevated,
                          valueColor: const AlwaysStoppedAnimation<Color>(CardioTheme.primary),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),

                const Text(
                  'MEDALHAS DE MÉRITO CLÍNICO',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1.2,
                    color: CardioTheme.primary,
                  ),
                ),
                const SizedBox(height: 12),

                // 2. Lista Organizada e Elegante de Troféus (Ícones menores e hierarquia clara)
                ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: _listaTrofeus.length,
                  separatorBuilder: (context, index) => const SizedBox(height: 10),
                  itemBuilder: (context, index) {
                    final trofeu = _listaTrofeus[index];
                    final desbloqueado = _isDesbloqueado(index);
                    final Color cor = trofeu['cor'] as Color;

                    return Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                      decoration: BoxDecoration(
                        color: desbloqueado ? CardioTheme.surfaceCard : CardioTheme.surface.withValues(alpha: 0.6),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(
                          color: desbloqueado ? cor : CardioTheme.borderSubtle,
                          width: desbloqueado ? 1.5 : 1.0,
                        ),
                        boxShadow: desbloqueado
                            ? [
                                BoxShadow(
                                  color: cor.withValues(alpha: 0.18),
                                  blurRadius: 10,
                                  spreadRadius: 0,
                                )
                              ]
                            : null,
                      ),
                      child: Row(
                        children: [
                          // Ícone do Troféu elegante e compacto (22px)
                          Container(
                            width: 42,
                            height: 42,
                            decoration: BoxDecoration(
                              color: desbloqueado ? cor.withValues(alpha: 0.15) : CardioTheme.surfaceElevated,
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(
                                color: desbloqueado ? cor : CardioTheme.borderSubtle,
                                width: 1,
                              ),
                            ),
                            child: Icon(
                              desbloqueado ? (trofeu['icone'] as IconData) : Icons.lock_outline,
                              color: desbloqueado ? cor : CardioTheme.textMuted,
                              size: 20,
                            ),
                          ),
                          const SizedBox(width: 14),
                          // Textos e Detalhes
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Flexible(
                                      child: Text(
                                        trofeu['titulo'] as String,
                                        style: TextStyle(
                                          fontSize: 13,
                                          fontWeight: FontWeight.bold,
                                          color: desbloqueado ? CardioTheme.textPrimary : CardioTheme.textMuted,
                                        ),
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                      decoration: BoxDecoration(
                                        color: desbloqueado
                                            ? CardioTheme.primary.withValues(alpha: 0.15)
                                            : CardioTheme.surfaceElevated,
                                        borderRadius: BorderRadius.circular(4),
                                      ),
                                      child: Text(
                                        desbloqueado ? 'DESBLOQUEADO' : 'BLOQUEADO',
                                        style: TextStyle(
                                          fontSize: 9,
                                          fontWeight: FontWeight.bold,
                                          letterSpacing: 0.6,
                                          color: desbloqueado ? CardioTheme.primary : CardioTheme.textMuted,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 3),
                                Text(
                                  trofeu['subtitulo'] as String,
                                  style: TextStyle(
                                    fontSize: 11,
                                    color: desbloqueado ? CardioTheme.textSecondary : CardioTheme.textMuted.withValues(alpha: 0.6),
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Row(
                                  children: [
                                    Text(
                                      trofeu['competencia'] as String,
                                      style: TextStyle(
                                        fontSize: 10,
                                        fontWeight: FontWeight.w600,
                                        color: desbloqueado ? cor : CardioTheme.textMuted,
                                      ),
                                    ),
                                    const Spacer(),
                                    Text(
                                      trofeu['xp'] as String,
                                      style: TextStyle(
                                        fontSize: 10,
                                        fontWeight: FontWeight.bold,
                                        color: desbloqueado ? CardioTheme.primary : CardioTheme.textMuted,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
                const SizedBox(height: 16),
              ],
            ),
          ),
        ),
      ),
    );
  }
}