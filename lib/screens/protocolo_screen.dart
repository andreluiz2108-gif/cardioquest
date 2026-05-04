import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ProtocoloScreen extends StatefulWidget {
  const ProtocoloScreen({super.key});

  @override
  State<ProtocoloScreen> createState() => _ProtocoloScreenState();
}

class _ProtocoloScreenState extends State<ProtocoloScreen> {
  // Nossa "Farmácia" com os remédios certos e errados misturados
  final List<String> _medicamentos = [
    "Aspirina (AAS)",
    "Adrenalina",
    "Oxigênio",
    "Furosemida",
    "Morfina",
    "Dipirona",
    "Nitrato",
    "Amoxicilina"
  ];

  // O gabarito: apenas estes 4 salvam a vida do paciente agora
  final List<String> _gabaritoMONA = [
    "Morfina",
    "Oxigênio",
    "Nitrato",
    "Aspirina (AAS)"
  ];

  // Lista para guardar o que o aluno está clicando
  final List<String> _selecionados = [];

  void _alternarMedicamento(String remedio) {
    setState(() {
      if (_selecionados.contains(remedio)) {
        _selecionados.remove(remedio); // Desmarca se já estava marcado
      } else {
        if (_selecionados.length < 4) {
          _selecionados.add(remedio); // Marca se tiver menos de 4
        } else {
          // Aviso se tentar marcar mais de 4
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('O protocolo inicial exige apenas 4 intervenções principais.'),
              duration: Duration(seconds: 2),
            ),
          );
        }
      }
    });
  }

  void _confirmarProtocolo() async {
    // Verifica se escolheu exatamente 4 e se todos estão no gabarito
    bool acertouTudo = _selecionados.length == 4 &&
        _selecionados.every((remedio) => _gabaritoMONA.contains(remedio));

    if (acertouTudo) {
      // Recompensa máxima (250 XP) por salvar o miocárdio!
      final prefs = await SharedPreferences.getInstance();
      int xpAtual = prefs.getInt('xpEnfermeiro') ?? 0;
      await prefs.setInt('xpEnfermeiro', xpAtual + 250);
      await prefs.setBool('venceu_mod4', true);
      if (mounted) {
        showDialog(
          context: context,
          barrierDismissible: false,
          builder: (context) => AlertDialog(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            title: const Row(
              children: [
                Icon(Icons.healing, color: Colors.purple, size: 30),
                SizedBox(width: 10),
                Text('Protocolo MONA!'),
              ],
            ),
            content: const Text(
              'Excelente atuação! Você administrou a medicação correta (Morfina, Oxigênio, Nitrato e AAS). A dor do paciente diminuiu e a isquemia está sendo combatida.\n\nVocê ganhou +250 XP!',
              style: TextStyle(fontSize: 16),
            ),
            actions: [
              ElevatedButton(
                style: ElevatedButton.styleFrom(backgroundColor: Colors.purple),
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
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('Conduta perigosa! Revise as medicações do protocolo inicial de Síndrome Coronariana Aguda.'),
          backgroundColor: Colors.red[800],
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1E3A8A),
        title: const Text(
          'Módulo 4: Medicação',
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
                Icon(Icons.medication, color: Colors.purple, size: 30),
                SizedBox(width: 10),
                Text(
                  'Prescrição de Emergência',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF1E3A8A)),
                ),
              ],
            ),
            const SizedBox(height: 16),
            const Text(
              'Selecione EXATAMENTE as 4 intervenções do protocolo inicial para o infarto (MONA):',
              style: TextStyle(fontSize: 16, color: Colors.black87),
            ),
            const SizedBox(height: 24),

            // Grade de medicamentos (Farmácia)
            Expanded(
              child: GridView.builder(
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2, // 2 botões por linha
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                  childAspectRatio: 2.5, // Proporção do botão (largura/altura)
                ),
                itemCount: _medicamentos.length,
                itemBuilder: (context, index) {
                  String remedio = _medicamentos[index];
                  bool isSelecionado = _selecionados.contains(remedio);

                  return ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: isSelecionado ? Colors.purple[100] : Colors.white,
                      foregroundColor: isSelecionado ? Colors.purple[900] : Colors.black87,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                        side: BorderSide(
                          color: isSelecionado ? Colors.purple : Colors.grey.shade300,
                          width: isSelecionado ? 2 : 1,
                        ),
                      ),
                      elevation: isSelecionado ? 0 : 2,
                    ),
                    onPressed: () => _alternarMedicamento(remedio),
                    child: Text(
                      remedio,
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: isSelecionado ? FontWeight.bold : FontWeight.normal,
                      ),
                    ),
                  );
                },
              ),
            ),

            // Botão de Confirmar Prescrição
            SizedBox(
              height: 56,
              child: ElevatedButton(
                onPressed: _selecionados.length == 4 ? _confirmarProtocolo : null, // Só habilita se escolher 4
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.purple,
                  disabledBackgroundColor: Colors.grey[300],
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: const Text(
                  'Confirmar Protocolo',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}