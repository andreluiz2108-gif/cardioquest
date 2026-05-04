import 'package:flutter/material.dart';
import 'dashboard_screen.dart';
import 'package:shared_preferences/shared_preferences.dart';
class WelcomeScreen extends StatefulWidget {
  const WelcomeScreen({super.key});

  @override
  State<WelcomeScreen> createState() => _WelcomeScreenState();
}

class _WelcomeScreenState extends State<WelcomeScreen> {
  // Variáveis para guardar o que o usuário digitar e escolher
  String _nomeEnfermeiro = '';
  int _avatarSelecionado = 0;

  // Lista simples de avatares (usando emojis para facilitar agora)
  final List<String> _avatares = ['👨‍⚕️', '👩‍⚕️', '🧑‍⚕️', '👨🏿‍⚕️', '👩🏽‍⚕️', '👱‍♀️'];

  // Colocamos o "async" aqui para o Flutter saber que haverá uma pequena espera
  void _baterPonto() async {
    if (_nomeEnfermeiro.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Por favor, digite seu nome no crachá.'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    // 1. Abrimos a gaveta do celular
    final prefs = await SharedPreferences.getInstance();

    // 2. Guardamos o nome e o avatar com "etiquetas" fáceis de lembrar
    await prefs.setString('nomeEnfermeiro', _nomeEnfermeiro);
    await prefs.setString('avatarEnfermeiro', _avatares[_avatarSelecionado]);

    // 3. O usuário vai para a nova tela, igualzinho antes
    // O "mounted" é uma regra de segurança do Flutter para telas que mudam após um "await"
    if (mounted) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (context) => DashboardScreen(
            nomeEnfermeiro: _nomeEnfermeiro,
            avatar: _avatares[_avatarSelecionado],
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      // SafeArea evita que o aplicativo fique escondido atrás do "notch" ou câmera do celular
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 40),
              // Cabeçalho
              Row(
                children: [
                  Icon(Icons.monitor_heart, color: Colors.red[600], size: 40),
                  const SizedBox(width: 12),
                  const Text(
                    'CardioQuest',
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF1E3A8A),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 40),
              const Text(
                'Identificação Profissional',
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.black87),
              ),
              const SizedBox(height: 8),
              const Text(
                'Configure seu crachá para iniciar o plantão.',
                style: TextStyle(fontSize: 16, color: Colors.grey),
              ),
              const SizedBox(height: 32),

              // Campo de Nome
              const Text(
                'NOME DO ENFERMEIRO(A)',
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey),
              ),
              const SizedBox(height: 8),
              TextField(
                onChanged: (valor) {
                  setState(() {
                    _nomeEnfermeiro = valor;
                  });
                },
                decoration: InputDecoration(
                  hintText: 'Digite seu nome...',
                  prefixIcon: const Icon(Icons.badge, color: Colors.grey),
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide.none,
                  ),
                ),
              ),
              const SizedBox(height: 32),

              // Escolha de Avatar
              const Text(
                'SELECIONE SEU AVATAR',
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey),
              ),
              const SizedBox(height: 16),
              Wrap(
                spacing: 16,
                runSpacing: 16,
                children: List.generate(_avatares.length, (index) {
                  final isSelecionado = _avatarSelecionado == index;
                  return GestureDetector(
                    onTap: () {
                      setState(() {
                        _avatarSelecionado = index;
                      });
                    },
                    child: Container(
                      width: 60,
                      height: 60,
                      decoration: BoxDecoration(
                        color: isSelecionado ? Colors.blue[100] : Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: isSelecionado ? Colors.blue : Colors.transparent,
                          width: 2,
                        ),
                        boxShadow: [
                          if (!isSelecionado)
                            BoxShadow(color: Colors.grey.withOpacity(0.1), blurRadius: 4, spreadRadius: 1)
                        ],
                      ),
                      child: Center(
                        child: Text(_avatares[index], style: const TextStyle(fontSize: 32)),
                      ),
                    ),
                  );
                }),
              ),
              const SizedBox(height: 60),

              // Botão Bater Ponto
              SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton(
                  onPressed: _baterPonto,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF1E3A8A),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text('Bater Ponto', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
                      SizedBox(width: 8),
                      Icon(Icons.arrow_forward, color: Colors.white),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}