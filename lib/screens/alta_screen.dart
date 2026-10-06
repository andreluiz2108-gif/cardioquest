import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../theme/cardio_theme.dart';
import '../widgets/cardio_hud_card.dart';

class AltaScreen extends StatefulWidget {
  const AltaScreen({super.key});

  @override
  State<AltaScreen> createState() => _AltaScreenState();
}

class _AltaScreenState extends State<AltaScreen> {
  final List<Map<String, dynamic>> _habitos = [
    {"texto": "Caminhada leve progressiva (30 min/dia) após liberação da cardiologia", "bom": true},
    {"texto": "Substituir o cigarro tradicional por dispositivo eletrônico (Vape/Pod)", "bom": false},
    {"texto": "Dieta rica em sódio e ultraprocessados para repor eletrólitos rapidamente", "bom": false},
    {"texto": "Adesão rigorosa e contínua à dupla antiagregação e estatina prescrita", "bom": true},
  ];

  int _indiceAtual = 0;

  void _julgarHabito(bool recomendou) async {
    bool habitoRealmenteBom = _habitos[_indiceAtual]["bom"];

    if (recomendou == habitoRealmenteBom) {
      if (_indiceAtual < _habitos.length - 1) {
        setState(() {
          _indiceAtual++;
        });
      } else {
        final prefs = await SharedPreferences.getInstance();
        int xpAtual = prefs.getInt('xpEnfermeiro') ?? 0;
        await prefs.setInt('xpEnfermeiro', xpAtual + 200);
        await prefs.setBool('venceu_mod6', true);

        if (mounted) {
          showDialog(
            context: context,
            barrierDismissible: false,
            builder: (dialogCtx) => AlertDialog(
              backgroundColor: CardioTheme.surfaceCard,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
                side: const BorderSide(color: CardioTheme.primary, width: 1.5),
              ),
              title: const Row(
                children: [
                  Icon(Icons.verified, color: CardioTheme.primary, size: 28),
                  SizedBox(width: 10),
                  Text('Caso Clínico Concluído!', style: TextStyle(color: CardioTheme.textPrimary)),
                ],
              ),
              content: const Text(
                'Parabéns! Você conduziu todas as 6 etapas do atendimento ao Sr. Carlos com excelência técnica e salvou o miocárdio do paciente!\n\nVocê conquistou +200 XP e finalizou o plantão!',
                style: TextStyle(color: CardioTheme.textSecondary, fontSize: 15),
              ),
              actions: [
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: CardioTheme.primary,
                    foregroundColor: CardioTheme.textDark,
                  ),
                  onPressed: () {
                    Navigator.pop(dialogCtx);
                    Navigator.pop(context);
                  },
                  child: const Text('Voltar ao Prontuário', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ],
            ),
          );
        }
      }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Orientação de risco! Revise as diretrizes de prevenção cardiovascular secundária.'),
          backgroundColor: CardioTheme.statusGrave,
        ),
      );
      setState(() {
        _indiceAtual = 0;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: CardioTheme.background,
      appBar: AppBar(
        backgroundColor: CardioTheme.surface,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: CardioTheme.primary, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'MÓDULO 6 • ALTA & EDUCAÇÃO EM SAÚDE',
          style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, letterSpacing: 1.2),
        ),
      ),
      body: CyberGridBackground(
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(20.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Progresso HUD
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'ORIENTAÇÃO ${_indiceAtual + 1} DE ${_habitos.length}',
                      style: const TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1.1,
                        color: CardioTheme.primary,
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: CardioTheme.primary.withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: const Text(
                        '+200 XP',
                        style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: CardioTheme.primary),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                ClipRRect(
                  borderRadius: BorderRadius.circular(4),
                  child: LinearProgressIndicator(
                    value: (_indiceAtual + 1) / _habitos.length,
                    minHeight: 6,
                    backgroundColor: CardioTheme.surfaceElevated,
                    valueColor: const AlwaysStoppedAnimation<Color>(CardioTheme.primary),
                  ),
                ),
                const SizedBox(height: 24),

                // Cartão da Conduta
                Expanded(
                  child: CardioHudCard(
                    isGlowing: true,
                    headerTitle: 'JULGAMENTO DE CONDUTA • PREVENÇÃO SECUNDÁRIA',
                    headerIcon: Icons.volunteer_activism_outlined,
                    padding: const EdgeInsets.all(24),
                    child: Center(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: CardioTheme.surfaceElevated,
                              border: Border.all(color: CardioTheme.primary, width: 1.5),
                            ),
                            child: const Icon(
                              Icons.health_and_safety_outlined,
                              size: 40,
                              color: CardioTheme.primary,
                            ),
                          ),
                          const SizedBox(height: 24),
                          Text(
                            _habitos[_indiceAtual]["texto"],
                            textAlign: TextAlign.center,
                            style: const TextStyle(
                              fontSize: 17,
                              fontWeight: FontWeight.w600,
                              color: CardioTheme.textPrimary,
                              height: 1.4,
                            ),
                          ),
                          const SizedBox(height: 16),
                          const Text(
                            'Você orientaria o paciente a adotar este hábito no plano de alta médica?',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: 12,
                              color: CardioTheme.textMuted,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                // Botões de Decisão (Recomendar vs Não Recomendar)
                Row(
                  children: [
                    Expanded(
                      child: SizedBox(
                        height: 56,
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: CardioTheme.surfaceCard,
                            foregroundColor: CardioTheme.statusGrave,
                            side: const BorderSide(color: CardioTheme.statusGrave, width: 1.5),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                          ),
                          onPressed: () => _julgarHabito(false),
                          child: const Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.close, color: CardioTheme.statusGrave),
                              SizedBox(width: 8),
                              Text(
                                'NÃO INDICAR',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 14,
                                  color: CardioTheme.statusGrave,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Container(
                        height: 56,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(14),
                          gradient: CardioTheme.primaryGradient,
                          boxShadow: CardioTheme.neonGlow(opacity: 0.35, blur: 12),
                        ),
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.transparent,
                            shadowColor: Colors.transparent,
                            foregroundColor: CardioTheme.textDark,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                          ),
                          onPressed: () => _julgarHabito(true),
                          child: const Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.check, color: CardioTheme.textDark),
                              SizedBox(width: 8),
                              Text(
                                'RECOMENDAR',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 14,
                                  color: CardioTheme.textDark,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
              ],
            ),
          ),
        ),
      ),
    );
  }
}