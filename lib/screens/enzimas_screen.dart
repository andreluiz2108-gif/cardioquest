import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../data/casos_clinicos_data.dart';
import '../data/questionarios_data.dart';
import '../models/caso_clinico.dart';
import '../theme/cardio_theme.dart';
import '../widgets/cardio_hud_card.dart';

class EnzimasScreen extends StatefulWidget {
  final CasoClinico? caso;

  const EnzimasScreen({
    super.key,
    this.caso,
  });

  @override
  State<EnzimasScreen> createState() => _EnzimasScreenState();
}

class _EnzimasScreenState extends State<EnzimasScreen> {
  late CasoClinico _caso;
  late List<Map<String, dynamic>> _perguntas;
  int _perguntaAtual = 0;

  @override
  void initState() {
    super.initState();
    _caso = widget.caso ?? CasosClinicosData.casos.first;
    _perguntas = QuestionariosData.obterPerguntasEnzimas(_caso);
  }

  void _verificarResposta(int indiceEscolhido) async {
    if (indiceEscolhido == _perguntas[_perguntaAtual]['correta']) {
      if (_perguntaAtual < _perguntas.length - 1) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Interpretação Laboratorial Correta! Avançando...'),
            backgroundColor: CardioTheme.primaryDark,
            duration: Duration(seconds: 1),
          ),
        );
        setState(() {
          _perguntaAtual++;
        });
      } else {
        final prefs = await SharedPreferences.getInstance();
        int xpAtual = prefs.getInt('xpEnfermeiro') ?? 0;
        await prefs.setInt('xpEnfermeiro', xpAtual + 150);
        final casoId = widget.caso?.id ?? 'caso_1';
        await prefs.setBool('venceu_${casoId}_mod5', true);
        await prefs.setBool('venceu_mod5', true);

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
                  Icon(Icons.biotech, color: CardioTheme.primary, size: 28),
                  SizedBox(width: 10),
                  Text('Mestre dos Biomarcadores!', style: TextStyle(color: CardioTheme.textPrimary)),
                ],
              ),
              content: const Text(
                'Excelente raciocínio na cinética enzimática e identificação precisa do risco de reinfarto!\n\nVocê conquistou +150 XP!',
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
                  child: const Text('Continuar para Desfecho', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ],
            ),
          );
        }
      }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Resposta incorreta. Analise a meia-vida e especificidade de cada biomarcador.'),
          backgroundColor: CardioTheme.statusGrave,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final pergunta = _perguntas[_perguntaAtual];

    return Scaffold(
      backgroundColor: CardioTheme.background,
      appBar: AppBar(
        backgroundColor: CardioTheme.surface,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: CardioTheme.primary, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'MÓDULO 5 • ENZIMAS CARDÍACAS',
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
                // Progresso HUD
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'ANÁLISE LABORATORIAL: ${_perguntaAtual + 1} DE ${_perguntas.length}',
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
                        '+150 XP',
                        style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: CardioTheme.primary),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                ClipRRect(
                  borderRadius: BorderRadius.circular(4),
                  child: LinearProgressIndicator(
                    value: (_perguntaAtual + 1) / _perguntas.length,
                    minHeight: 6,
                    backgroundColor: CardioTheme.surfaceElevated,
                    valueColor: const AlwaysStoppedAnimation<Color>(CardioTheme.primary),
                  ),
                ),
                const SizedBox(height: 20),

                // Pergunta HUD
                CardioHudCard(
                  isGlowing: true,
                  headerTitle: pergunta['titulo'],
                  headerIcon: Icons.science_outlined,
                  padding: const EdgeInsets.all(20),
                  child: Text(
                    pergunta['texto'],
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w500,
                      color: CardioTheme.textPrimary,
                      height: 1.4,
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                // Opções
                ...List.generate(pergunta['opcoes'].length, (index) {
                  return Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    decoration: BoxDecoration(
                      color: CardioTheme.surfaceCard,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: CardioTheme.borderSubtle, width: 1.0),
                    ),
                    child: Material(
                      color: Colors.transparent,
                      child: InkWell(
                        onTap: () => _verificarResposta(index),
                        borderRadius: BorderRadius.circular(14),
                        splashColor: CardioTheme.primary.withValues(alpha: 0.2),
                        child: Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
                          child: Row(
                            children: [
                              Container(
                                width: 28,
                                height: 28,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: CardioTheme.primary.withValues(alpha: 0.15),
                                  border: Border.all(color: CardioTheme.primary, width: 1.5),
                                ),
                                child: Center(
                                  child: Text(
                                    String.fromCharCode(65 + index),
                                    style: const TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.bold,
                                      color: CardioTheme.primary,
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 14),
                              Expanded(
                                child: Text(
                                  pergunta['opcoes'][index],
                                  style: const TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w500,
                                    color: CardioTheme.textPrimary,
                                    height: 1.3,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  );
                }),
              ],
            ),
          ),
        ),
      ),
    );
  }
}