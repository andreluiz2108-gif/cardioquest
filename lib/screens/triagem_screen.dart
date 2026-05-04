import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class TriagemScreen extends StatefulWidget {
  const TriagemScreen({super.key});

  @override
  State<TriagemScreen> createState() => _TriagemScreenState();
}

class _TriagemScreenState extends State<TriagemScreen> {
  int _perguntaAtual = 0;

  // O nosso circuito de 3 perguntas para a Triagem
  final List<Map<String, dynamic>> _perguntas = [
    {
      'titulo': 'Passo 1: Classificação',
      'texto': 'Paciente relata dor no peito (nível 9/10) tipo aperto, que começou há 40 minutos. A dor sobe para o pescoço e desce pelo braço esquerdo. Pálido e a suar frio.\n\nQual a classificação de risco (Manchester)?',
      'opcoes': ['Emergência (0 min) - Vermelho', 'Muito Urgente (10 min) - Laranja', 'Urgente (60 min) - Amarelo', 'Pouco Urgente (120 min) - Verde', 'Não Urgente (240 min) - Azul'],
      'correta': 0,
      'usarCores': true, // Para desenharmos os botões coloridos típicos de Manchester
    },
    {
      'titulo': 'Passo 2: Conduta Imediata',
      'texto': 'Classificação Vermelha confirmada!\n\nQual deve ser a sua PRIMEIRA ação de enfermagem?',
      'opcoes': [
        'Pedir ao paciente para aguardar sentado na receção.',
        'Encaminhar para a sala de emergência e solicitar ECG em até 10 minutos.',
        'Aferir apenas a temperatura e dar um analgésico simples.',
        'Preencher o registo de admissão completo antes de chamar o médico.'
      ],
      'correta': 1,
      'usarCores': false,
    },
    {
      'titulo': 'Passo 3: Monitorização',
      'texto': 'O paciente está na sala de emergência a aguardar o ECG.\n\nAlém do eletrocardiograma, qual a monitorização inicial prioritária?',
      'opcoes': [
        'Apenas frequência cardíaca.',
        'Medição da glicemia capilar isolada.',
        'Monitorização contínua (Sinais Vitais, Oximetria e Acesso Venoso).',
        'Apenas a pressão arterial a cada 30 minutos.'
      ],
      'correta': 2,
      'usarCores': false,
    }
  ];

  void _verificarResposta(int indiceEscolhido) async {
    if (indiceEscolhido == _perguntas[_perguntaAtual]['correta']) {
      // Se acertou, mas ainda há mais perguntas
      if (_perguntaAtual < _perguntas.length - 1) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Correto! Vamos para o próximo passo.'),
            backgroundColor: Colors.green,
            duration: Duration(seconds: 1),
          ),
        );
        setState(() {
          _perguntaAtual++;
        });
      } else {
        // Acertou a ÚLTIMA pergunta do circuito! Recebe o XP e a chave.
        final prefs = await SharedPreferences.getInstance();
        int xpAtual = prefs.getInt('xpEnfermeiro') ?? 0;
        await prefs.setInt('xpEnfermeiro', xpAtual + 150); // 150 XP pelo circuito
        await prefs.setBool('venceu_mod1', true); // Destranca a Anamnese

        if (mounted) {
          showDialog(
            context: context,
            barrierDismissible: false,
            builder: (context) => AlertDialog(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              title: const Row(
                children: [
                  Icon(Icons.check_circle, color: Colors.green, size: 30),
                  SizedBox(width: 10),
                  Text('Triagem Concluída!'),
                ],
              ),
              content: const Text(
                'Excelente raciocínio clínico em todas as etapas! O paciente foi classificado e monitorizado corretamente a tempo.\n\nGanhou +150 XP!',
                style: TextStyle(fontSize: 16),
              ),
              actions: [
                ElevatedButton(
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.green),
                  onPressed: () {
                    Navigator.pop(context);
                    Navigator.pop(context);
                  },
                  child: const Text('Continuar', style: TextStyle(color: Colors.white)),
                ),
              ],
            ),
          );
        }
      }
    } else {
      // Errou a conduta
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('Conduta incorreta. Reveja os protocolos de Síndrome Coronariana Aguda e tente novamente.'),
          backgroundColor: Colors.red[800],
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final pergunta = _perguntas[_perguntaAtual];
    final bool usarCores = pergunta['usarCores'];

    // Cores oficiais de Manchester (apenas para a pergunta 1)
    final List<Color> coresManchester = [Colors.red, Colors.orange, Colors.amber, Colors.green, Colors.blue];

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1E3A8A),
        title: const Text(
          'Módulo 1: Triagem',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Indicador de progresso (Etapa 1 de 3)
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
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.blue.shade100, width: 2),
                boxShadow: [
                  BoxShadow(color: Colors.blue.withOpacity(0.05), blurRadius: 10, spreadRadius: 2),
                ],
              ),
              child: Column(
                children: [
                  Text(
                    pergunta['titulo'],
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF1E3A8A)),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    pergunta['texto'],
                    textAlign: TextAlign.center,
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),

            // Gerador de Botões (Coloridos para Manchester, Padrão para os restantes)
            ...List.generate(pergunta['opcoes'].length, (index) {
              return Padding(
                padding: const EdgeInsets.only(bottom: 12.0),
                child: Container( // Trocamos SizedBox por Container
                  constraints: const BoxConstraints(minHeight: 60), // Adicionamos a regra corretamente
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: usarCores ? coresManchester[index] : Colors.white,
                      foregroundColor: usarCores ? Colors.white : Colors.black87,
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                      alignment: usarCores ? Alignment.center : Alignment.centerLeft,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                        side: BorderSide(color: usarCores ? Colors.transparent : Colors.grey.shade300),
                      ),
                    ),
                    onPressed: () => _verificarResposta(index),
                    child: Text(
                      pergunta['opcoes'][index],
                      style: TextStyle(
                        fontSize: usarCores ? 18 : 15,
                        fontWeight: usarCores ? FontWeight.bold : FontWeight.normal,
                      ),
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