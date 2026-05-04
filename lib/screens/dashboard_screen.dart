import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'prontuario_screen.dart';
import 'trofeus_screen.dart';
import 'welcome_screen.dart'; // Importação do ecrã de boas-vindas para podermos voltar

class DashboardScreen extends StatefulWidget {
  final String nomeEnfermeiro;
  final String avatar;

  const DashboardScreen({
    super.key,
    required this.nomeEnfermeiro,
    required this.avatar,
  });

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _xpAtual = 0;

  // A nossa "Escada" de progressão profissional rebalanceada para 1.000 XP
  final List<Map<String, dynamic>> _niveis = [
    {'nome': 'Estudante Calouro', 'minXp': 0, 'cor': Colors.grey},
    {'nome': 'Interno de Enfermagem', 'minXp': 150, 'cor': Colors.blue},
    {'nome': 'Enfermeiro Júnior', 'minXp': 300, 'cor': Colors.green},
    {'nome': 'Enfermeiro Pleno', 'minXp': 500, 'cor': Colors.purple},
    {'nome': 'Especialista em Cardio', 'minXp': 700, 'cor': Colors.red},
    {'nome': 'Mestre do Plantão', 'minXp': 850, 'cor': Colors.orange},
    {'nome': 'Lenda da Enfermagem', 'minXp': 1000, 'cor': Colors.teal},
  ];

  @override
  void initState() {
    super.initState();
    _carregarXP();
  }

  Future<void> _carregarXP() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _xpAtual = prefs.getInt('xpEnfermeiro') ?? 0;
    });
  }

  Map<String, dynamic> _obterNivelAtual() {
    Map<String, dynamic> nivelAtual = _niveis[0];
    for (var nivel in _niveis) {
      if (_xpAtual >= nivel['minXp']) {
        nivelAtual = nivel;
      } else {
        break;
      }
    }
    return nivelAtual;
  }

  int _obterProximoXp() {
    for (var nivel in _niveis) {
      if (_xpAtual < nivel['minXp']) {
        return nivel['minXp'];
      }
    }
    return _xpAtual;
  }

  Future<void> _ganharXpTeste() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _xpAtual += 250;
    });
    await prefs.setInt('xpEnfermeiro', _xpAtual);
  }

  // --- NOVA FUNÇÃO DE RESET ---
  Future<void> _sairEResetar() async {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Row(
          children: [
            Icon(Icons.warning_amber_rounded, color: Colors.red),
            SizedBox(width: 8),
            Text('Reiniciar Jogo?'),
          ],
        ),
        content: const Text('Isto irá apagar todo o seu progresso, XP, cadeados e medalhas. Tem a certeza de que quer começar de novo?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancelar', style: TextStyle(color: Colors.grey)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            onPressed: () async {
              // 1. Apaga tudo da memória!
              final prefs = await SharedPreferences.getInstance();
              await prefs.clear();

              if (mounted) {
                // 2. Fecha a janela de aviso
                Navigator.pop(context);
                // 3. Volta ao ecrã inicial
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (context) => const WelcomeScreen()),
                );
              }
            },
            child: const Text('Sim, Reiniciar', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final nivelAtual = _obterNivelAtual();
    final proximoXp = _obterProximoXp();

    double progresso = 1.0;
    if (proximoXp > nivelAtual['minXp']) {
      progresso = (_xpAtual - nivelAtual['minXp']) / (proximoXp - nivelAtual['minXp']);
    }

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1E3A8A),
        title: const Text(
          'Sala de Plantão',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        automaticallyImplyLeading: false,
        actions: [
          // Novo botão de Reset (Logout)
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.white),
            onPressed: _sairEResetar,
            tooltip: 'Reiniciar Progresso',
          ),
          // Botão de teste mantido
          IconButton(
            icon: const Icon(Icons.add_circle, color: Colors.white),
            onPressed: _ganharXpTeste,
            tooltip: 'Ganhar XP (Teste)',
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(color: Colors.grey.withOpacity(0.1), blurRadius: 10, spreadRadius: 2),
                ],
              ),
              child: Row(
                children: [
                  Container(
                    width: 70,
                    height: 70,
                    decoration: BoxDecoration(color: Colors.blue[50], borderRadius: BorderRadius.circular(16)),
                    child: Center(child: Text(widget.avatar, style: const TextStyle(fontSize: 40))),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          widget.nomeEnfermeiro,
                          style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF1E3A8A)),
                        ),
                        const SizedBox(height: 4),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: nivelAtual['cor'].withOpacity(0.2),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            nivelAtual['nome'],
                            style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: nivelAtual['cor']),
                          ),
                        ),
                        const SizedBox(height: 8),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(4),
                          child: LinearProgressIndicator(
                            value: progresso,
                            backgroundColor: Colors.grey[200],
                            color: Colors.amber,
                            minHeight: 8,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '$_xpAtual / $proximoXp XP',
                          style: const TextStyle(fontSize: 10, color: Colors.grey),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 40),
            const Text(
              'Acesso Rápido',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.black87),
            ),
            const SizedBox(height: 16),

            GestureDetector(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const ProntuarioScreen()),
                ).then((_) => _carregarXP());
              },
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(colors: [Color(0xFF1E3A8A), Color(0xFF3B82F6)]),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.assignment, color: Colors.white, size: 40),
                    SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Prontuário: Sr. Carlos', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                          Text('Paciente com dor torácica aguda.', style: TextStyle(color: Colors.white70, fontSize: 14)),
                        ],
                      ),
                    ),
                    Icon(Icons.play_circle_fill, color: Colors.white, size: 32),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 16),

            GestureDetector(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const TrofeusScreen()),
                );
              },
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.amber.shade300, width: 2),
                  boxShadow: [
                    BoxShadow(color: Colors.amber.withOpacity(0.1), blurRadius: 10, spreadRadius: 2),
                  ],
                ),
                child: const Row(
                  children: [
                    Icon(Icons.emoji_events, color: Colors.amber, size: 40),
                    SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Sala de Troféus', style: TextStyle(color: Colors.black87, fontSize: 18, fontWeight: FontWeight.bold)),
                          Text('Veja as suas conquistas clínicas.', style: TextStyle(color: Colors.grey, fontSize: 14)),
                        ],
                      ),
                    ),
                    Icon(Icons.chevron_right, color: Colors.amber, size: 32),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }
}