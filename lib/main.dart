import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'screens/welcome_screen.dart';
import 'screens/dashboard_screen.dart';

// O main agora é "async" para poder ler a gaveta antes de ligar a tela
void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  // Abre a gaveta e procura pelas etiquetas
  final prefs = await SharedPreferences.getInstance();
  final String? nomeSalvo = prefs.getString('nomeEnfermeiro');
  final String? avatarSalvo = prefs.getString('avatarEnfermeiro');

  // Lógica inteligente: Qual tela mostrar primeiro?
  Widget telaInicial = const WelcomeScreen(); // Por padrão, tela de bater ponto

  // Se encontrou um nome salvo, muda a tela inicial direto para o Dashboard!
  if (nomeSalvo != null && avatarSalvo != null && nomeSalvo.isNotEmpty) {
    telaInicial = DashboardScreen(
        nomeEnfermeiro: nomeSalvo,
        avatar: avatarSalvo
    );
  }

  // Passamos a tela escolhida para o aplicativo
  runApp(CardioQuestApp(telaInicial: telaInicial));
}

class CardioQuestApp extends StatelessWidget {
  final Widget telaInicial;

  // O aplicativo agora recebe a tela inicial que decidimos ali em cima
  const CardioQuestApp({super.key, required this.telaInicial});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'CardioQuest',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primaryColor: const Color(0xFF1E3A8A),
        scaffoldBackgroundColor: const Color(0xFFF8FAFC),
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF1E3A8A)),
        useMaterial3: true,
      ),
      home: telaInicial, // Usa a tela que o main() definiu
    );
  }
}