import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'triagem_screen.dart';
import 'anamnese_screen.dart';
import 'ecg_screen.dart';
import 'protocolo_screen.dart';
import 'enzimas_screen.dart';
import 'alta_screen.dart';

class ProntuarioScreen extends StatefulWidget {
  const ProntuarioScreen({super.key});

  @override
  State<ProntuarioScreen> createState() => _ProntuarioScreenState();
}

class _ProntuarioScreenState extends State<ProntuarioScreen> {
  // Variáveis para controlar os cadeados (false = trancado)
  // O módulo 1 (Triagem) já começa destrancado por padrão!
  bool _mod2Liberado = false;
  bool _mod3Liberado = false;
  bool _mod4Liberado = false;
  bool _mod5Liberado = false;
  bool _mod6Liberado = false;

  @override
  void initState() {
    super.initState();
    _carregarProgresso();
  }

  // Função que abre a gaveta e verifica quais fases o aluno já passou
  Future<void> _carregarProgresso() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _mod2Liberado = prefs.getBool('venceu_mod1') ?? false;
      _mod3Liberado = prefs.getBool('venceu_mod2') ?? false;
      _mod4Liberado = prefs.getBool('venceu_mod3') ?? false;
      _mod5Liberado = prefs.getBool('venceu_mod4') ?? false;
      _mod6Liberado = prefs.getBool('venceu_mod5') ?? false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1E3A8A),
        title: const Text(
          'Prontuário: Sr. Carlos',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Ficha de Admissão do Paciente
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: const Border(left: BorderSide(color: Colors.red, width: 6)),
                boxShadow: [
                  BoxShadow(color: Colors.grey.withOpacity(0.1), blurRadius: 10, spreadRadius: 2),
                ],
              ),
              child: const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('ADMISSÃO', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey)),
                      Text('19:00', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.red)),
                    ],
                  ),
                  SizedBox(height: 8),
                  Text('Sr. Carlos Mendes, 62 anos', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF1E3A8A))),
                  SizedBox(height: 8),
                  Text('Motivo: Dor torácica opressiva (9/10) irradiada para membro superior esquerdo, iniciada há 40 minutos.', style: TextStyle(fontSize: 14, color: Colors.black87)),
                ],
              ),
            ),
            const SizedBox(height: 32),
            const Text(
              'Evolução Clínica',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.black87),
            ),
            const SizedBox(height: 16),

            // Módulo 1: Triagem (Sempre Liberado)
            _buildModuloDesafio(
              titulo: '1. Triagem (Manchester)',
              descricao: 'Classifique o risco deste paciente rapidamente.',
              icone: Icons.local_hospital,
              cor: Colors.orange,
              isLocked: false,
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const TriagemScreen()),
                ).then((_) => _carregarProgresso()); // Recarrega os cadeados ao voltar!
              },
            ),

            // Módulo 2: Anamnese (Depende do Módulo 1)
            _buildModuloDesafio(
              titulo: '2. Anamnese Direcionada',
              descricao: 'Colete sinais vitais e histórico médico.',
              icone: Icons.assignment_ind,
              cor: Colors.blue,
              isLocked: !_mod2Liberado,
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const AnamneseScreen()),
                ).then((_) => _carregarProgresso());
              },
            ),

            // Módulo 3: ECG (Depende do Módulo 2)
            _buildModuloDesafio(
              titulo: '3. Eletrocardiograma (ECG)',
              descricao: 'Identifique possíveis alterações isquêmicas.',
              icone: Icons.monitor_heart,
              cor: Colors.green,
              isLocked: !_mod3Liberado,
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const EcgScreen()),
                ).then((_) => _carregarProgresso());
              },
            ),

            // Módulo 4: Protocolo MONA (Depende do Módulo 3)
            _buildModuloDesafio(
              titulo: '4. Intervenção Farmacológica',
              descricao: 'Prescreva as medicações do protocolo inicial.',
              icone: Icons.medication,
              cor: Colors.purple,
              isLocked: !_mod4Liberado,
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const ProtocoloScreen()),
                ).then((_) => _carregarProgresso());
              },
            ),

            // Módulo 5: Enzimas (Depende do Módulo 4)
            _buildModuloDesafio(
              titulo: '5. Laboratório (Biomarcadores)',
              descricao: 'Avalie a curva enzimática do paciente.',
              icone: Icons.science,
              cor: Colors.indigo,
              isLocked: !_mod5Liberado,
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const EnzimasScreen()),
                ).then((_) => _carregarProgresso());
              },
            ),

            // Módulo 6: Alta Médica (Depende do Módulo 5)
            _buildModuloDesafio(
              titulo: '6. Alta e Orientações',
              descricao: 'Educação em saúde para prevenção secundária.',
              icone: Icons.health_and_safety,
              cor: Colors.teal,
              isLocked: !_mod6Liberado,
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const AltaScreen()),
                ).then((_) => _carregarProgresso());
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildModuloDesafio({
    required String titulo,
    required String descricao,
    required IconData icone,
    required Color cor,
    required bool isLocked,
    VoidCallback? onTap,
  }) {
    return GestureDetector(
      onTap: isLocked ? null : onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isLocked ? Colors.grey[200] : Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: isLocked ? Colors.transparent : cor.withOpacity(0.5), width: 2),
          boxShadow: isLocked ? [] : [
            BoxShadow(color: cor.withOpacity(0.1), blurRadius: 8, spreadRadius: 1),
          ],
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: isLocked ? Colors.grey[300] : cor.withOpacity(0.2),
                shape: BoxShape.circle,
              ),
              child: Icon(isLocked ? Icons.lock : icone, color: isLocked ? Colors.grey[500] : cor),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    titulo,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: isLocked ? Colors.grey[600] : Colors.black87,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    descricao,
                    style: TextStyle(fontSize: 12, color: isLocked ? Colors.grey[500] : Colors.grey[700]),
                  ),
                ],
              ),
            ),
            if (!isLocked)
              Icon(Icons.play_circle_fill, color: cor, size: 28),
          ],
        ),
      ),
    );
  }
}