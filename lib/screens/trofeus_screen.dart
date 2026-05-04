import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class TrofeusScreen extends StatefulWidget {
  const TrofeusScreen({super.key});

  @override
  State<TrofeusScreen> createState() => _TrofeusScreenState();
}

class _TrofeusScreenState extends State<TrofeusScreen> {
  // Variáveis para sabermos que medalhas o aluno tem
  bool _temMedalha1 = false;
  bool _temMedalha2 = false;
  bool _temMedalha3 = false;
  bool _temMedalha4 = false;
  bool _temMedalha5 = false;
  bool _temMedalha6 = false;

  @override
  void initState() {
    super.initState();
    _carregarMedalhas();
  }

  Future<void> _carregarMedalhas() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _temMedalha1 = prefs.getBool('venceu_mod1') ?? false;
      _temMedalha2 = prefs.getBool('venceu_mod2') ?? false;
      _temMedalha3 = prefs.getBool('venceu_mod3') ?? false;
      _temMedalha4 = prefs.getBool('venceu_mod4') ?? false;
      _temMedalha5 = prefs.getBool('venceu_mod5') ?? false;
      _temMedalha6 = prefs.getBool('venceu_mod5') ?? false; // Se chegou ao 6, venceu o caso
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1E3A8A),
        title: const Text(
          'Sala de Troféus',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Row(
              children: [
                Icon(Icons.emoji_events, color: Colors.amber, size: 36),
                SizedBox(width: 12),
                Text(
                  'As Suas Conquistas',
                  style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Color(0xFF1E3A8A)),
                ),
              ],
            ),
            const SizedBox(height: 8),
            const Text(
              'Complete os desafios clínicos com perfeição para colecionar as medalhas de mérito.',
              style: TextStyle(fontSize: 14, color: Colors.grey),
            ),
            const SizedBox(height: 32),

            // Grelha de Medalhas
            Expanded(
              child: GridView.count(
                crossAxisCount: 2, // Duas medalhas por linha
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                children: [
                  _buildMedalha('Olho Clínico', 'Triagem de Risco', Icons.local_hospital, Colors.orange, _temMedalha1),
                  _buildMedalha('Detetive', 'Anamnese Correta', Icons.assignment_ind, Colors.blue, _temMedalha2),
                  _buildMedalha('Águia do ECG', 'Diagnóstico de Supra', Icons.monitor_heart, Colors.green, _temMedalha3),
                  _buildMedalha('Rei do Protocolo', 'Prescrição MONA', Icons.medication, Colors.purple, _temMedalha4),
                  _buildMedalha('Mestre do Lab', 'Padrão-Ouro', Icons.science, Colors.indigo, _temMedalha5),
                  _buildMedalha('Alta Segura', 'Educação em Saúde', Icons.health_and_safety, Colors.teal, _temMedalha6),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Molde visual para cada medalha
  Widget _buildMedalha(String titulo, String subtitulo, IconData icone, Color corBase, bool desbloqueada) {
    return Container(
      decoration: BoxDecoration(
        color: desbloqueada ? Colors.white : Colors.grey[200],
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: desbloqueada ? corBase.withOpacity(0.5) : Colors.transparent,
          width: 2,
        ),
        boxShadow: desbloqueada ? [
          BoxShadow(color: corBase.withOpacity(0.2), blurRadius: 10, spreadRadius: 2)
        ] : [],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: desbloqueada ? corBase.withOpacity(0.1) : Colors.grey[300],
              shape: BoxShape.circle,
            ),
            child: Icon(
              desbloqueada ? icone : Icons.lock,
              color: desbloqueada ? corBase : Colors.grey[500],
              size: 32,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            titulo,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: desbloqueada ? Colors.black87 : Colors.grey[600],
            ),
          ),
          const SizedBox(height: 4),
          Text(
            subtitulo,
            style: TextStyle(
              fontSize: 12,
              color: desbloqueada ? Colors.grey[700] : Colors.grey[500],
            ),
          ),
        ],
      ),
    );
  }
}