import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../data/casos_clinicos_data.dart';
import '../data/questionarios_data.dart';
import '../models/caso_clinico.dart';
import '../theme/cardio_theme.dart';
import '../widgets/cardio_hud_card.dart';

class EcgScreen extends StatefulWidget {
  final CasoClinico? caso;

  const EcgScreen({
    super.key,
    this.caso,
  });

  @override
  State<EcgScreen> createState() => _EcgScreenState();
}

class _EcgScreenState extends State<EcgScreen> {
  late CasoClinico _caso;
  late List<Map<String, dynamic>> _perguntas;
  int _perguntaAtual = 0;

  @override
  void initState() {
    super.initState();
    _caso = widget.caso ?? CasosClinicosData.casos.first;
    _perguntas = QuestionariosData.obterPerguntasEcg(_caso);
  }

  void _verificarDiagnostico(int indiceEscolhido) async {
    if (indiceEscolhido == _perguntas[_perguntaAtual]['correta']) {
      if (_perguntaAtual < _perguntas.length - 1) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Interpretação Eletrocardiográfica Exata! Próximo traçado...'),
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
        await prefs.setInt('xpEnfermeiro', xpAtual + 200);
        final casoId = widget.caso?.id ?? 'caso_1';
        await prefs.setBool('venceu_${casoId}_mod3', true);
        await prefs.setBool('venceu_mod3', true);

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
                  Icon(Icons.monitor_heart, color: CardioTheme.primary, size: 28),
                  SizedBox(width: 10),
                  Text('Águia do ECG!', style: TextStyle(color: CardioTheme.textPrimary)),
                ],
              ),
              content: const Text(
                'Excelente raciocínio eletrocardiográfico e interpretação de derivações!\n\nVocê conquistou +200 XP!',
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
                  child: const Text('Continuar para Protocolo', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ],
            ),
          );
        }
      }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Diagnóstico Incorreto. Analise as ondas e o segmento ST atentamente.'),
          backgroundColor: CardioTheme.statusGrave,
        ),
      );
    }
  }

  CustomPainter _obterPainter(int tipo) {
    switch (tipo) {
      case 1:
        return TracadoNormalPainter();
      case 2:
        return TracadoFVPainter();
      case 3:
        return TracadoSupraSTPainter();
      default:
        return TracadoNormalPainter();
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
          'MÓDULO 3 • ELETROCARDIOGRAMA (ECG)',
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
                      'TRAÇADO ${_perguntaAtual + 1} DE ${_perguntas.length}',
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
                    value: (_perguntaAtual + 1) / _perguntas.length,
                    minHeight: 6,
                    backgroundColor: CardioTheme.surfaceElevated,
                    valueColor: const AlwaysStoppedAnimation<Color>(CardioTheme.primary),
                  ),
                ),
                const SizedBox(height: 20),

                // Monitor de ECG Holográfico / Cockpit
                Container(
                  decoration: BoxDecoration(
                    color: const Color(0xFF030A12),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: CardioTheme.primary, width: 1.5),
                    boxShadow: CardioTheme.neonGlow(opacity: 0.25, blur: 16),
                  ),
                  child: Column(
                    children: [
                      // Cabeçalho do Monitor
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                        decoration: BoxDecoration(
                          color: CardioTheme.surfaceElevated.withValues(alpha: 0.8),
                          borderRadius: const BorderRadius.only(
                            topLeft: Radius.circular(14),
                            topRight: Radius.circular(14),
                          ),
                          border: const Border(bottom: BorderSide(color: CardioTheme.borderSubtle)),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Row(
                              children: [
                                Icon(Icons.circle, size: 8, color: CardioTheme.primary),
                                SizedBox(width: 6),
                                Text(
                                  'MONITOR TELEMETRIA 12-DERIVAÇÕES',
                                  style: TextStyle(
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                    letterSpacing: 1.0,
                                    color: CardioTheme.textPrimary,
                                  ),
                                ),
                              ],
                            ),
                            Text(
                              pergunta['alerta'],
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                color: pergunta['corAlerta'],
                              ),
                            ),
                          ],
                        ),
                      ),
                      // Tela com Onda Desenhada
                      ClipRRect(
                        borderRadius: const BorderRadius.only(
                          bottomLeft: Radius.circular(14),
                          bottomRight: Radius.circular(14),
                        ),
                        child: SizedBox(
                          height: 170,
                          width: double.infinity,
                          child: Stack(
                            children: [
                              CustomPaint(
                                size: const Size(double.infinity, 170),
                                painter: GridPainter(),
                              ),
                              CustomPaint(
                                size: const Size(double.infinity, 170),
                                painter: _obterPainter(pergunta['tipoTracado']),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),

                // Pergunta HUD
                CardioHudCard(
                  headerTitle: pergunta['titulo'],
                  headerIcon: Icons.monitor_heart,
                  padding: const EdgeInsets.all(18),
                  child: Text(
                    pergunta['texto'],
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                      color: CardioTheme.textPrimary,
                      height: 1.4,
                    ),
                  ),
                ),
                const SizedBox(height: 20),

                // Opções de Diagnóstico
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
                        onTap: () => _verificarDiagnostico(index),
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
                                    fontWeight: FontWeight.w600,
                                    color: CardioTheme.textPrimary,
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

// --- CÓDIGOS DE DESENHO VETORIAL DO FLUTTER ---

class GridPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFF00E599).withValues(alpha: 0.12)
      ..strokeWidth = 1.0;
    for (double i = 0; i < size.width; i += 18) {
      canvas.drawLine(Offset(i, 0), Offset(i, size.height), paint);
    }
    for (double i = 0; i < size.height; i += 18) {
      canvas.drawLine(Offset(0, i), Offset(size.width, i), paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class TracadoNormalPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFF00E599)
      ..strokeWidth = 2.5
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    final path = Path();
    final double midY = size.height / 2;

    for (int ciclo = 0; ciclo < 3; ciclo++) {
      double offsetX = ciclo * 130.0;
      if (ciclo == 0) path.moveTo(0, midY);

      path.lineTo(offsetX + 20, midY);
      path.quadraticBezierTo(offsetX + 30, midY - 15, offsetX + 40, midY); // Onda P
      path.lineTo(offsetX + 50, midY);
      path.lineTo(offsetX + 55, midY + 10);  // Q
      path.lineTo(offsetX + 65, midY - 65);  // R (Pico)
      path.lineTo(offsetX + 75, midY + 20);  // S
      path.lineTo(offsetX + 80, midY);
      path.quadraticBezierTo(offsetX + 95, midY - 25, offsetX + 110, midY); // Onda T Normal
      path.lineTo(offsetX + 130, midY);
    }
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class TracadoFVPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFFEF4444)
      ..strokeWidth = 2.5
      ..style = PaintingStyle.stroke;

    final path = Path();
    final double midY = size.height / 2;
    path.moveTo(0, midY);

    for (double x = 0; x < size.width; x += 15) {
      double variacao = (x % 30 == 0) ? 45.0 : -35.0;
      path.lineTo(x, midY + variacao);
    }
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class TracadoSupraSTPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFFEF4444)
      ..strokeWidth = 2.8
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    final path = Path();
    final double midY = size.height / 2 + 10;

    for (int ciclo = 0; ciclo < 3; ciclo++) {
      double offsetX = ciclo * 130.0;
      if (ciclo == 0) path.moveTo(0, midY);

      path.lineTo(offsetX + 20, midY);
      path.quadraticBezierTo(offsetX + 30, midY - 12, offsetX + 40, midY); // Onda P
      path.lineTo(offsetX + 50, midY);
      path.lineTo(offsetX + 55, midY + 10); // Q
      path.lineTo(offsetX + 65, midY - 70); // R (Pico alto)
      path.lineTo(offsetX + 75, midY - 25); // S NÃO DESCE: SUPRA DESNIVELADO
      path.quadraticBezierTo(offsetX + 95, midY - 50, offsetX + 115, midY); // Onda T Fundida com Supra
      path.lineTo(offsetX + 130, midY);
    }
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}