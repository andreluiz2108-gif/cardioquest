import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AltaScreen extends StatefulWidget {
  const AltaScreen({super.key});

  @override
  State<AltaScreen> createState() => _AltaScreenState();
}

class _AltaScreenState extends State<AltaScreen> {
  // Fila de hábitos que o aluno precisa julgar
  final List<Map<String, dynamic>> _habitos = [
    {"texto": "Caminhada leve (30 min/dia) após liberação médica", "bom": true},
    {"texto": "Substituir o cigarro tradicional por Vape (Cigarro Eletrônico)", "bom": false},
    {"texto": "Dieta rica em embutidos para repor energia", "bom": false},
    {"texto": "Uso rigoroso e contínuo das medicações prescritas", "bom": true},
  ];

  int _indiceAtual = 0; // Controla qual hábito está aparecendo na tela

  void _julgarHabito(bool recomendou) async {
    bool habitoRealmenteBom = _habitos[_indiceAtual]["bom"];

    // Verifica se a escolha do aluno bate com a realidade médica
    if (recomendou == habitoRealmenteBom) {

      // Se acertou, vai para o próximo hábito
      if (_indiceAtual < _habitos.length - 1) {
        setState(() {
          _indiceAtual++;
        });
      } else {
        // Se era o último hábito, venceu o módulo! (Recompensa de 200 XP)
        final prefs = await SharedPreferences.getInstance();
        int xpAtual = prefs.getInt('xpEnfermeiro') ?? 0;
        await prefs.setInt('xpEnfermeiro', xpAtual + 200);

        if (mounted) {
          showDialog(
            context: context,
            barrierDismissible: false,
            builder: (context) => AlertDialog(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              title: const Row(
                children: [
                  Icon(Icons.volunteer_activism, color: Colors.teal, size: 30),
                  SizedBox(width: 10),
                  Text('Alta Segura!'),
                ],
              ),
              content: const Text(
                'Parabéns! Você orientou o Sr. Carlos perfeitamente. A educação em saúde é fundamental para evitar um reinfarto. O paciente recebeu alta com segurança!\n\nVocê ganhou +200 XP!',
                style: TextStyle(fontSize: 16),
              ),
              actions: [
                ElevatedButton(
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.teal),
                  onPressed: () {
                    Navigator.pop(context); // Fecha o aviso
                    Navigator.pop(context); // Volta ao prontuário
                  },
                  child: const Text('Concluir Caso', style: TextStyle(color: Colors.white)),
                ),
              ],
            ),
          );
        }
      }
    } else {
      // Se errou a recomendação, toma uma bronca construtiva
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('Orientação perigosa! Revise as diretrizes de prevenção secundária e tente novamente.'),
          backgroundColor: Colors.red[800],
          behavior: SnackBarBehavior.floating,
        ),
      );
      // Reinicia o teste para garantir a fixação do conteúdo
      setState(() {
        _indiceAtual = 0;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1E3A8A),
        title: const Text(
          'Módulo 6: Alta Médica',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Row(
              children: [
                Icon(Icons.health_and_safety, color: Colors.teal, size: 30),
                SizedBox(width: 10),
                Text(
                  'Educação em Saúde',
                  style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Color(0xFF1E3A8A)),
                ),
              ],
            ),
            const SizedBox(height: 16),
            const Text(
              'O paciente está de alta. Avalie o hábito abaixo e decida se deve orientá-lo a EVITAR ou RECOMENDAR:',
              style: TextStyle(fontSize: 16, color: Colors.black87),
            ),
            const SizedBox(height: 32),

            // O Cartão do Hábito atual
            Container(
              padding: const EdgeInsets.all(32),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.teal.shade200, width: 2),
                boxShadow: [
                  BoxShadow(color: Colors.teal.withOpacity(0.1), blurRadius: 15, spreadRadius: 5),
                ],
              ),
              child: Column(
                children: [
                  Text(
                    'Hábito ${_indiceAtual + 1} de ${_habitos.length}',
                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    _habitos[_indiceAtual]["texto"],
                    textAlign: TextAlign.center,
                    style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF1E3A8A)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 40),

            // Botões de Decisão (Recomendar ou Evitar)
            Row(
              children: [
                Expanded(
                  child: SizedBox(
                    height: 60,
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.red[600],
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      onPressed: () => _julgarHabito(false),
                      icon: const Icon(Icons.block, color: Colors.white),
                      label: const Text('EVITAR', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: SizedBox(
                    height: 60,
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.teal[600],
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      onPressed: () => _julgarHabito(true),
                      icon: const Icon(Icons.check_circle_outline, color: Colors.white),
                      label: const Text('RECOMENDAR', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white)),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}