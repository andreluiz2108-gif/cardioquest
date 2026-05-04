import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class EnzimasScreen extends StatefulWidget {
  const EnzimasScreen({super.key});

  @override
  State<EnzimasScreen> createState() => _EnzimasScreenState();
}

class _EnzimasScreenState extends State<EnzimasScreen> {
  int _perguntaAtual = 0;

  // O nosso circuito de 3 perguntas para as Enzimas Cardíacas
  final List<Map<String, dynamic>> _perguntas = [
    {
      'titulo': 'Passo 1: O Padrão-Ouro',
      'texto': 'O Sr. Carlos está estabilizado. Qual é o biomarcador considerado o "padrão-ouro" atual (mais sensível e específico) para confirmar a necrose miocárdica?',
      'opcoes': [
        'A) Mioglobina',
        'B) CK-MB',
        'C) Troponina',
        'D) Desidrogenase Lática (LDH)'
      ],
      'correta': 2,
    },
    {
      'titulo': 'Passo 2: O Tempo da Curva',
      'texto': 'Você realizou a colheita de sangue para a Troponina. Sobre a curva enzimática deste marcador, quando costuma ocorrer a sua elevação inicial no sangue após o início da isquemia?',
      'opcoes': [
        'A) Imediatamente (nos primeiros 15 minutos).',
        'B) Em poucas horas (geralmente entre 3h a 6h).',
        'C) Apenas após 24 horas completas do início da dor.',
        'D) Após 48 horas do evento isquêmico.'
      ],
      'correta': 1,
    },
    {
      'titulo': 'Passo 3: Risco de Reinfarto',
      'texto': 'No 4º dia de internamento, o paciente volta a ter dor no peito. A Troponina dele ainda está alta devido ao primeiro infarto (demora até 14 dias a normalizar).\n\nQue outro marcador seria mais útil solicitar AGORA para detetar um possível novo infarto?',
      'opcoes': [
        'A) Nova dosagem de Troponina.',
        'B) Peptídeo Natriurético B (BNP).',
        'C) D-Dímero.',
        'D) CK-MB (pois normaliza rapidamente em 48-72h).'
      ],
      'correta': 3,
    }
  ];

  void _verificarResposta(int indiceEscolhido) async {
    if (indiceEscolhido == _perguntas[_perguntaAtual]['correta']) {
      // Se acertou e há mais perguntas
      if (_perguntaAtual < _perguntas.length - 1) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Resposta exata! Vamos avançar na análise.'),
            backgroundColor: Colors.indigo,
            duration: Duration(seconds: 1),
          ),
        );
        setState(() {
          _perguntaAtual++;
        });
      } else {
        // Acertou a última pergunta do circuito! Recebe o XP e destranca a Alta.
        final prefs = await SharedPreferences.getInstance();
        int xpAtual = prefs.getInt('xpEnfermeiro') ?? 0;
        await prefs.setInt('xpEnfermeiro', xpAtual + 150); // 150 XP pela vitória
        await prefs.setBool('venceu_mod5', true); // Destranca a Alta Médica (Módulo 6)

        if (mounted) {
          showDialog(
            context: context,
            barrierDismissible: false,
            builder: (context) => AlertDialog(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              title: const Row(
                children: [
                  Icon(Icons.science, color: Colors.indigo, size: 30),
                  SizedBox(width: 10),
                  Text('Mestre do Laboratório!'),
                ],
              ),
              content: const Text(
                'Excelente domínio da curva enzimática! Você sabe identificar a lesão inicial e monitorizar o risco de reinfarto.\n\nGanhou +150 XP!',
                style: TextStyle(fontSize: 16),
              ),
              actions: [
                ElevatedButton(
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.indigo),
                  onPressed: () {
                    Navigator.pop(context); // Fecha o aviso
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
          content: const Text('Análise Incorreta. Reveja as diretrizes sobre os tempos de elevação e queda dos biomarcadores.'),
          backgroundColor: Colors.red[800],
          behavior: SnackBarBehavior.floating,
        ),
      );
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
          'Módulo 5: Laboratório',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Indicador de progresso
            Text(
              'Etapa ${_perguntaAtual + 1} de ${_perguntas.length}',
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.grey),
            ),
            const SizedBox(height: 8),

            // Cartão da Pergunta
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.indigo[50],
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.indigo.shade200, width: 2),
                boxShadow: [
                  BoxShadow(color: Colors.indigo.withOpacity(0.1), blurRadius: 10, spreadRadius: 2),
                ],
              ),
              child: Column(
                children: [
                  Text(
                    pergunta['titulo'],
                    textAlign: TextAlign.center,
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF1E3A8A)),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    pergunta['texto'],
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500, color: Colors.black87),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),

            // Gerador de Botões com o BoxConstraints
            ...List.generate(pergunta['opcoes'].length, (index) {
              return Padding(
                padding: const EdgeInsets.only(bottom: 12.0),
                child: Container(
                  constraints: const BoxConstraints(minHeight: 60),
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      foregroundColor: Colors.indigo[900],
                      padding: const EdgeInsets.all(16),
                      alignment: Alignment.centerLeft,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                        side: BorderSide(color: Colors.indigo.shade100, width: 2),
                      ),
                      elevation: 1,
                    ),
                    onPressed: () => _verificarResposta(index),
                    child: Text(
                      pergunta['opcoes'][index],
                      style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
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