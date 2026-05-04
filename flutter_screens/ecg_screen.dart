import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class EcgScreen extends StatefulWidget {
  const EcgScreen({super.key});

  @override
  State<EcgScreen> createState() => _EcgScreenState();
}

class _EcgScreenState extends State<EcgScreen> {
  int _perguntaAtual = 0;

  // Nosso circuito visual de 3 traçados de ECG
  final List<Map<String, dynamic>> _perguntas = [
    {
      'titulo': 'Treino: Leitura 1',
      'texto': 'Antes de avaliar o Sr. Carlos, o preceptor pede para você identificar este traçado de um monitor de rotina:',
      'opcoes': [
        'Ritmo Sinusal Normal',
        'Fibrilação Ventricular',
        'Assistolia'
      ],
      'correta': 0,
      'tipoTracado': 1, // Chama o pintor do ritmo normal
      'alerta': 'HR: 75',
      'corAlerta': Colors.greenAccent,
    },
    {
      'titulo': 'Treino: Leitura 2',
      'texto': 'O alarme de emergência soou no leito ao lado! Identifique este ritmo caótico de parada cardiorrespiratória:',
      'opcoes': [
        'Bradicardia Sinusal',
        'Fibrilação Ventricular',
        'Bloqueio Atrioventricular'
      ],
      'correta': 1,
      'tipoTracado': 2, // Chama o pintor da FV
      'alerta': 'HR: ---',
      'corAlerta': Colors.redAccent,
    },
    {
      'titulo': 'ECG do Sr. Carlos',
      'texto': 'Foco total no nosso paciente. Derivação V2. A dor torácica continua intensa. Qual é o diagnóstico exato?',
      'opcoes': [
        'Ritmo Sinusal Normal',
        'Fibrilação Ventricular',
        'IAM com Supra de ST',
        'Taquicardia Ventricular'
      ],
      'correta': 2,
      'tipoTracado': 3, // Chama o pintor do Supra de ST
      'alerta': 'HR: 110',
      'corAlerta': Colors.redAccent,
    }
  ];

  void _verificarDiagnostico(int indiceEscolhido) async {
    if (indiceEscolhido == _perguntas[_perguntaAtual]['correta']) {
      // Acertou e vai para o próximo traçado
      if (_perguntaAtual < _perguntas.length - 1) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Leitura perfeita! Vamos para o próximo traçado.'),
            backgroundColor: Colors.green,
            duration: Duration(seconds: 1),
          ),
        );
        setState(() {
          _perguntaAtual++;
        });
      } else {
        // Acertou o último traçado! Recebe o XP máximo do módulo.
        final prefs = await SharedPreferences.getInstance();
        int xpAtual = prefs.getInt('xpEnfermeiro') ?? 0;
        await prefs.setInt('xpEnfermeiro', xpAtual + 200); // Dá os 200 XP
        await prefs.setBool('venceu_mod3', true); // Destranca a Medicação

        if (mounted) {
          showDialog(
            context: context,
            barrierDismissible: false,
            builder: (context) => AlertDialog(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              title: const Row(
                children: [
                  Icon(Icons.monitor_heart, color: Colors.green, size: 30),
                  SizedBox(width: 10),
                  Text('Águia do ECG!'),
                ],
              ),
              content: const Text(
                'Você demonstrou excelente competência na leitura de monitores cardíacos e diagnosticou a isquemia aguda do paciente.\n\nGanhou +200 XP!',
                style: TextStyle(fontSize: 16),
              ),
              actions: [
                ElevatedButton(
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.green),
                  onPressed: () {
                    Navigator.pop(context); // Fecha aviso
                    Navigator.pop(context); // Volta ao prontuário
                  },
                  child: const Text('Continuar', style: TextStyle(color: Colors.white)),
                ),
              ],
            ),
          );
        }
      }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('Diagnóstico Incorreto. Analise o formato das ondas e o segmento ST com atenção.'),
          backgroundColor: Colors.red[800],
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  // Função que escolhe qual código matemático vai desenhar a linha do coração
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
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1E3A8A),
        title: const Text(
          'Módulo 3: ECG',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'Etapa ${_perguntaAtual + 1} de ${_perguntas.length}',
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.grey),
            ),
            const SizedBox(height: 8),
            Text(
              pergunta['titulo'],
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF1E3A8A)),
            ),
            const SizedBox(height: 8),
            Text(
              pergunta['texto'],
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 14, color: Colors.black87),
            ),
            const SizedBox(height: 24),

            // O Monitor do ECG (Fundo preto com grade)
            Container(
              height: 200,
              width: double.infinity,
              decoration: BoxDecoration(
                color: Colors.black,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.grey.shade400, width: 4),
                boxShadow: [
                  BoxShadow(color: Colors.green.withOpacity(0.2), blurRadius: 15, spreadRadius: 5),
                ],
              ),
              child: Stack(
                children: [
                  // Grade de fundo (papel de ECG)
                  CustomPaint(
                    size: const Size(double.infinity, 200),
                    painter: GridPainter(),
                  ),
                  // A linha verde que muda de acordo com a pergunta!
                  CustomPaint(
                    size: const Size(double.infinity, 200),
                    painter: _obterPainter(pergunta['tipoTracado']),
                  ),
                  // Alerta piscando (HR)
                  Positioned(
                    top: 16,
                    right: 16,
                    child: Row(
                      children: [
                        Icon(Icons.warning, color: pergunta['corAlerta'], size: 16),
                        const SizedBox(width: 4),
                        Text(pergunta['alerta'], style: TextStyle(color: pergunta['corAlerta'], fontWeight: FontWeight.bold, fontFamily: 'monospace')),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),

            // Botões de Diagnóstico com nossa correção do BoxConstraints
            ...List.generate(pergunta['opcoes'].length, (index) {
              return Padding(
                padding: const EdgeInsets.only(bottom: 12.0),
                child: Container(
                  constraints: const BoxConstraints(minHeight: 60),
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      foregroundColor: Colors.black87,
                      padding: const EdgeInsets.all(16),
                      alignment: Alignment.center,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                        side: BorderSide(color: Colors.grey.shade300),
                      ),
                    ),
                    onPressed: () => _verificarDiagnostico(index),
                    child: Text(
                      pergunta['opcoes'][index],
                      textAlign: TextAlign.center,
                      style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
              );
            }),
          ],
        ),
      ),
    );
  }
}

// --- CÓDIGOS DE DESENHO DO FLUTTER ---

class GridPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.green.withOpacity(0.2)
      ..strokeWidth = 1.0;
    for (double i = 0; i < size.width; i += 20) canvas.drawLine(Offset(i, 0), Offset(i, size.height), paint);
    for (double i = 0; i < size.height; i += 20) canvas.drawLine(Offset(0, i), Offset(size.width, i), paint);
  }
  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

// NOVO: 1. Traçado Normal
class TracadoNormalPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = Colors.greenAccent..strokeWidth = 3.0..style = PaintingStyle.stroke..strokeJoin = StrokeJoin.round;
    final path = Path();
    double yBase = size.height * 0.6;
    double startX = size.width * 0.1;

    path.moveTo(0, yBase);
    path.lineTo(startX, yBase);
    // Onda P
    path.quadraticBezierTo(startX + 10, yBase - 10, startX + 20, yBase);
    path.lineTo(startX + 30, yBase);
    // QRS Normal
    path.lineTo(startX + 35, yBase + 10); // Q
    path.lineTo(startX + 45, yBase - 80); // R
    path.lineTo(startX + 55, yBase + 20); // S
    path.lineTo(startX + 60, yBase);      // Volta à linha de base exata
    // Onda T
    path.quadraticBezierTo(startX + 80, yBase - 20, startX + 100, yBase);
    path.lineTo(size.width, yBase);

    canvas.drawPath(path, paint);
  }
  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

// NOVO: 2. Traçado Caótico (Fibrilação Ventricular)
class TracadoFVPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = Colors.redAccent..strokeWidth = 3.0..style = PaintingStyle.stroke..strokeJoin = StrokeJoin.round;
    final path = Path();
    double yBase = size.height * 0.6;

    path.moveTo(0, yBase);
    // Cria ondas irregulares para simular fibrilação
    path.quadraticBezierTo(20, yBase - 40, 40, yBase + 10);
    path.quadraticBezierTo(60, yBase + 50, 80, yBase - 20);
    path.quadraticBezierTo(100, yBase - 60, 120, yBase + 30);
    path.quadraticBezierTo(140, yBase + 40, 160, yBase - 10);
    path.quadraticBezierTo(180, yBase - 50, 200, yBase + 20);
    path.quadraticBezierTo(220, yBase + 30, 240, yBase - 30);
    path.quadraticBezierTo(260, yBase - 20, 280, yBase + 40);
    path.quadraticBezierTo(300, yBase + 20, 320, yBase - 40);
    path.lineTo(size.width, yBase);

    canvas.drawPath(path, paint);
  }
  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

// 3. Traçado IAM com Supra ST (O que já tínhamos)
class TracadoSupraSTPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = Colors.greenAccent..strokeWidth = 3.0..style = PaintingStyle.stroke..strokeJoin = StrokeJoin.round;
    final path = Path();
    double yBase = size.height * 0.6;
    double startX = size.width * 0.1;

    path.moveTo(0, yBase);
    path.lineTo(startX, yBase);
    path.quadraticBezierTo(startX + 10, yBase - 10, startX + 20, yBase);
    path.lineTo(startX + 30, yBase);
    path.lineTo(startX + 35, yBase + 10);
    path.lineTo(startX + 45, yBase - 80);
    path.lineTo(startX + 55, yBase + 20);

    // O SUPRA DE ST
    double stElevation = yBase - 35;
    path.lineTo(startX + 65, stElevation);
    path.quadraticBezierTo(startX + 90, stElevation - 20, startX + 110, yBase);
    path.lineTo(size.width, yBase);

    canvas.drawPath(path, paint);
  }
  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}