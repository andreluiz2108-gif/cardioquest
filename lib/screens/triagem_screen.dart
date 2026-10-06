import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../theme/cardio_theme.dart';
import '../widgets/cardio_hud_card.dart';

class TriagemScreen extends StatefulWidget {
  const TriagemScreen({super.key});

  @override
  State<TriagemScreen> createState() => _TriagemScreenState();
}

class _TriagemScreenState extends State<TriagemScreen> {
  int _perguntaAtual = 0;

  final List<Map<String, dynamic>> _perguntas = [
    {
      'titulo': 'ETAPA 1: CLASSIFICAÇÃO DE RISCO',
      'texto': 'Paciente relata dor no peito (nível 9/10) tipo aperto, iniciada há 40 minutos com irradiação para mandíbula e MSE, palidez e sudorese fria.\n\nQual a classificação de risco pelo Protocolo de Manchester?',
      'opcoes': [
        'Emergência (0 min) - Vermelho',
        'Muito Urgente (10 min) - Laranja',
        'Urgente (60 min) - Amarelo',
        'Pouco Urgente (120 min) - Verde',
        'Não Urgente (240 min) - Azul'
      ],
      'correta': 0,
      'usarCores': true,
    },
    {
      'titulo': 'ETAPA 2: CONDUTA IMEDIATA',
      'texto': 'Classificação Vermelha (Emergência) confirmada!\n\nQual deve ser a sua PRIMEIRA ação de enfermagem?',
      'opcoes': [
        'Pedir ao paciente para aguardar sentado na recepção.',
        'Encaminhar para a sala de emergência e solicitar ECG em até 10 minutos.',
        'Aferir apenas a temperatura e dar um analgésico simples.',
        'Preencher o registro de admissão completo antes de chamar o médico.'
      ],
      'correta': 1,
      'usarCores': false,
    },
    {
      'titulo': 'ETAPA 3: MONITORIZAÇÃO CONTÍNUA',
      'texto': 'O paciente está na sala de emergência aguardando a realização do ECG.\n\nAlém do traçado eletrocardiográfico, qual a monitorização prioritária?',
      'opcoes': [
        'Apenas frequência cardíaca.',
        'Medição da glicemia capilar isolada.',
        'Monitorização contínua (Sinais Vitais, Oximetria e Acesso Venoso Calibroso).',
        'Apenas a pressão arterial a cada 30 minutos.'
      ],
      'correta': 2,
      'usarCores': false,
    }
  ];

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
                'Excelente raciocínio clínico! O paciente foi classificado na Sala Vermelha e monitorizado dentro do tempo hábil.\n\nVocê conquistou +150 XP!',
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