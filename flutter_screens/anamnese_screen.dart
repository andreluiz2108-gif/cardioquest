import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AnamneseScreen extends StatefulWidget {
  const AnamneseScreen({super.key});

  @override
  State<AnamneseScreen> createState() => _AnamneseScreenState();
}

class _AnamneseScreenState extends State<AnamneseScreen> {
  int _perguntaAtual = 0;

  // O nosso circuito de 3 perguntas para a Anamnese
  final List<Map<String, dynamic>> _perguntas = [
    {
      'titulo': 'Passo 1: Caracterização da Dor',
      'texto': 'Considerando o relato inicial do Sr. Carlos, qual característica da dor é o indicativo mais clássico de uma síndrome isquêmica miocárdica aguda?',
      'opcoes': [
        'A) Dor em pontada que piora ao inspirar fundo.',
        'B) Dor precordial opressiva (em aperto) irradiada para o membro superior esquerdo.',
        'C) Dor em queimação na boca do estômago que melhora com alimentação.',
        'D) Dor lombar com irradiação para a face posterior das pernas.'
      ],
      'correta': 1,
    },
    {
      'titulo': 'Passo 2: Fatores de Risco',
      'texto': 'A dor é típica de infarto. Durante a coleta rápida da história (Sinais e Sintomas), quais fatores de risco são cruciais investigar para o Sr. Carlos agora?',
      'opcoes': [
        'A) Histórico de asma crônica e alergias alimentares.',
        'B) Frequência de viagens recentes ou contato com doenças infecciosas.',
        'C) Hipertensão, Diabetes, Tabagismo prévio e histórico familiar de cardiopatia.',
        'D) Prática de desportos radicais ou lesões ortopédicas recentes.'
      ],
      'correta': 2,
    },
    {
      'titulo': 'Passo 3: Alergias (Segurança)',
      'texto': 'Você está prestes a avançar para os exames e a medicação.\n\nQual informação da anamnese é absolutamente VITAL confirmar agora para evitar um evento adverso grave nos próximos minutos?',
      'opcoes': [
        'A) O tipo sanguíneo e fator Rh do paciente.',
        'B) A última vez que o paciente urinou.',
        'C) O estado de vacinação anual contra a gripe.',
        'D) Histórico de alergias a medicamentos (especialmente AAS ou Iodo).'
      ],
      'correta': 3,
    }
  ];

  void _verificarResposta(int indiceEscolhido) async {
    if (indiceEscolhido == _perguntas[_perguntaAtual]['correta']) {
      // Se acertou, mas ainda há mais perguntas no circuito
      if (_perguntaAtual < _perguntas.length - 1) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Excelente investigação! Vamos para a próxima etapa.'),
            backgroundColor: Colors.blue,
            duration: Duration(seconds: 1),
          ),
        );
        setState(() {
          _perguntaAtual++;
        });
      } else {
        // Acertou a ÚLTIMA pergunta! Recebe o XP e a chave para o Módulo 3.
        final prefs = await SharedPreferences.getInstance();
        int xpAtual = prefs.getInt('xpEnfermeiro') ?? 0;
        await prefs.setInt('xpEnfermeiro', xpAtual + 150); // Dá os 150 XP
        await prefs.setBool('venceu_mod2', true); // Destranca o ECG (Módulo 3)

        if (mounted) {
          showDialog(
            context: context,
            barrierDismissible: false,
            builder: (context) => AlertDialog(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              title: const Row(
                children: [
                  Icon(Icons.assignment_ind, color: Colors.blue, size: 30),
                  SizedBox(width: 10),
                  Text('Anamnese Impecável!'),
                ],
              ),
              content: const Text(
                'Você coletou os dados vitais, confirmou os fatores de risco e garantiu a segurança medicamentosa do paciente.\n\nVocê ganhou +150 XP!',
                style: TextStyle(fontSize: 16),
              ),
              actions: [
                ElevatedButton(
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.blue),
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
      // Errou a resposta
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('Atenção! Reveja os dados clínicos e as prioridades do atendimento de emergência.'),
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
          'Módulo 2: Anamnese',
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
                color: Colors.blue[50],
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.blue.shade200, width: 2),
                boxShadow: [
                  BoxShadow(color: Colors.blue.withOpacity(0.1), blurRadius: 10, spreadRadius: 2),
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

            // Gerador de Botões Dinâmico (Usando Container com BoxConstraints)
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
                      alignment: Alignment.centerLeft,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                        side: BorderSide(color: Colors.grey.shade300),
                      ),
                      elevation: 2,
                    ),
                    onPressed: () => _verificarResposta(index),
                    child: Text(
                      pergunta['opcoes'][index],
                      style: const TextStyle(fontSize: 15),
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