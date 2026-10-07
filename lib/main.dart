import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'screens/welcome_screen.dart';
import 'screens/dashboard_screen.dart';

import 'theme/cardio_theme.dart';

// O main agora é "async" para poder ler a gaveta antes de ligar a tela
void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  final prefs = await SharedPreferences.getInstance();
  final String? nomeSalvo = prefs.getString('nomeEnfermeiro');
  final String? avatarSalvo = prefs.getString('avatarEnfermeiro');
  final String? avatarAssetSalvo = prefs.getString('avatarAssetEnfermeiro');

  // Lógica inteligente: Qual tela mostrar primeiro?
  Widget telaInicial = const WelcomeScreen(); // Por padrão, tela de identificação

  // Se encontrou um nome salvo, muda a tela inicial direto para o Dashboard!
  if (nomeSalvo != null && avatarSalvo != null && nomeSalvo.isNotEmpty) {
    telaInicial = DashboardScreen(
      nomeEnfermeiro: nomeSalvo,
      avatar: avatarSalvo,
      avatarAsset: avatarAssetSalvo,
    );
  }

  // Passamos a tela escolhida para o aplicativo
  runApp(CardioQuestApp(telaInicial: telaInicial));
}

class CardioQuestApp extends StatelessWidget {
  final Widget telaInicial;

  const CardioQuestApp({super.key, required this.telaInicial});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'CardioQuest',
      debugShowCheckedModeBanner: false,
      theme: CardioTheme.darkTheme,
      darkTheme: CardioTheme.darkTheme,
      themeMode: ThemeMode.dark,
      home: telaInicial,
    );
  }
}