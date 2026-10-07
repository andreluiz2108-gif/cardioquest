import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../data/casos_clinicos_data.dart';
import '../data/questionarios_data.dart';
import '../models/caso_clinico.dart';
import '../theme/cardio_theme.dart';
import '../widgets/cardio_hud_card.dart';

class TriagemScreen extends StatefulWidget {
  final CasoClinico? caso;

  const TriagemScreen({
    super.key,
    this.caso,
  });

  @override
  State<TriagemScreen> createState() => _TriagemScreenState();
}

class _TriagemScreenState extends State<TriagemScreen> {
  late CasoClinico _caso;
  late List<Map<String, dynamic>> _perguntas;
  int _perguntaAtual = 0;

  @override
  void initState() {
    super.initState();
    _caso = widget.caso ?? CasosClinicosData.casos.first;
    _perguntas = QuestionariosData.obterPerguntasTriagem(_caso);
  }

  void _verificarResposta(int indiceEscolhido) async {
    if (indiceEscolhido == _perguntas[_perguntaAtual]['correta']) {
      if (_perguntaAtual < _perguntas.length - 1) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Conduta Correta! Avançando para a próxima etapa...'),
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
        await prefs.setBool('venceu_${casoId}_mod1', true);
        await prefs.setBool('venceu_mod1', true);

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
                  Icon(Icons.check_circle_outline, color: CardioTheme.primary, size: 28),
                  SizedBox(width: 10),
                  Text('Triagem Concluída!', style: TextStyle(color: CardioTheme.textPrimary)),
                ],
              ),
              content: const Text(
                'Excelente raciocínio clínico! O paciente foi classificado e monitorizado dentro do tempo hábil.\n\nVocê conquistou +150 XP!',
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
                  child: const Text('Continuar Plantão', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ],
            ),
          );
        }
      }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Conduta incorreta. Reveja os critérios de gravidade e tente novamente.'),
          backgroundColor: CardioTheme.statusGrave,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final pergunta = _perguntas[_perguntaAtual];
    final bool usarCores = pergunta['usarCores'];

    final List<Color> coresManchester = [
      CardioTheme.statusGrave,
      CardioTheme.statusMuitoUrgente,
      CardioTheme.statusUrgente,
      CardioTheme.statusEstavel,
      CardioTheme.statusPoucoUrgente,
    ];

    return Scaffold(
      backgroundColor: CardioTheme.background,
      appBar: AppBar(
        backgroundColor: CardioTheme.surface,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: CardioTheme.primary, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'MÓDULO 1 • TRIAGEM MANCHESTER',
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
                // Barra de Progresso das Etapas
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'CIRCUITO CLÍNICO: ETAPA ${_perguntaAtual + 1} DE ${_perguntas.length}',
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
                  headerIcon: Icons.help_outline,
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

                // Opções de Resposta em HUD Buttons
                ...List.generate(pergunta['opcoes'].length, (index) {
                  final opcaoCor = usarCores ? coresManchester[index] : CardioTheme.borderSubtle;
                  return Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    decoration: BoxDecoration(
                      color: CardioTheme.surfaceCard,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(
                        color: usarCores ? opcaoCor : CardioTheme.borderSubtle,
                        width: usarCores ? 1.8 : 1.0,
                      ),
                      boxShadow: usarCores
                          ? [
                              BoxShadow(
                                color: opcaoCor.withValues(alpha: 0.2),
                                blurRadius: 10,
                                spreadRadius: 0,
                              )
                            ]
                          : null,
                    ),
                    child: Material(
                      color: Colors.transparent,
                      child: InkWell(
                        onTap: () => _verificarResposta(index),
                        borderRadius: BorderRadius.circular(14),
                        splashColor: (usarCores ? opcaoCor : CardioTheme.primary).withValues(alpha: 0.2),
                        child: Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
                          child: Row(
                            children: [
                              Container(
                                width: 28,
                                height: 28,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: (usarCores ? opcaoCor : CardioTheme.primary).withValues(alpha: 0.15),
                                  border: Border.all(
                                    color: usarCores ? opcaoCor : CardioTheme.primary,
                                    width: 1.5,
                                  ),
                                ),
                                child: Center(
                                  child: Text(
                                    String.fromCharCode(65 + index),
                                    style: TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.bold,
                                      color: usarCores ? opcaoCor : CardioTheme.primary,
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 14),
                              Expanded(
                                child: Text(
                                  pergunta['opcoes'][index],
                                  style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w600,
                                    color: usarCores ? opcaoCor : CardioTheme.textPrimary,
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