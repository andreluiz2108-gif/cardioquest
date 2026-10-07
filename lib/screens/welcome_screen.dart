import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../theme/cardio_theme.dart';
import '../widgets/cardio_button.dart';
import '../widgets/cardio_hud_card.dart';
import 'dashboard_screen.dart';

class WelcomeScreen extends StatefulWidget {
  const WelcomeScreen({super.key});

  @override
  State<WelcomeScreen> createState() => _WelcomeScreenState();
}

class _WelcomeScreenState extends State<WelcomeScreen> {
  String _nomeEnfermeiro = '';
  int _avatarSelecionado = 0;

  // Lista de Avatares Clínicos (3 Homens e 3 Mulheres Enfermeiros)
  final List<Map<String, dynamic>> _avataresProfissionais = [
    {
      'emoji': '👨‍⚕️',
      'asset': 'assets/avatars/avatar_andre.jpg',
      'cor': CardioTheme.primary,
    },
    {
      'emoji': '👨‍⚕️',
      'asset': 'assets/avatars/avatar_roberto.jpg',
      'cor': CardioTheme.statusGrave,
    },
    {
      'emoji': '👨‍⚕️',
      'asset': 'assets/avatars/avatar_marcos.jpg',
      'cor': CardioTheme.cyanAccent,
    },
    {
      'emoji': '👩‍⚕️',
      'asset': 'assets/avatars/avatar_anapaula.jpg',
      'cor': CardioTheme.cyanAccent,
    },
    {
      'emoji': '👩‍⚕️',
      'asset': 'assets/avatars/avatar_juliana.jpg',
      'cor': CardioTheme.primary,
    },
    {
      'emoji': '👩‍⚕️',
      'asset': 'assets/avatars/avatar_beatriz.jpg',
      'cor': CardioTheme.statusMuitoUrgente,
    },
  ];

  final TextEditingController _controller = TextEditingController();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _baterPonto() async {
    final nome = _nomeEnfermeiro.trim();
    if (nome.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Por favor, digite seu nome no crachá para assumir o plantão.'),
          backgroundColor: CardioTheme.statusGrave,
        ),
      );
      return;
    }

    final avatarData = _avataresProfissionais[_avatarSelecionado];
    final avatarEmoji = avatarData['emoji'] as String;
    final avatarAsset = avatarData['asset'] as String?;

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('nomeEnfermeiro', nome);
    await prefs.setString('avatarEnfermeiro', avatarEmoji);
    if (avatarAsset != null) {
      await prefs.setString('avatarAssetEnfermeiro', avatarAsset);
    }
    await prefs.setString('cargoEnfermeiro', 'Enfermeiro(a) de Plantão');

    if (mounted) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (context) => DashboardScreen(
            nomeEnfermeiro: nome,
            avatar: avatarEmoji,
            avatarAsset: avatarAsset,
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: CardioTheme.background,
      body: CyberGridBackground(
        showHeartbeat: true,
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 32.0),
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 580),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Cabeçalho da Marca
                    Center(
                      child: Column(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(14),
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: CardioTheme.surfaceElevated,
                              border: Border.all(color: CardioTheme.primary, width: 2),
                              boxShadow: CardioTheme.neonGlow(opacity: 0.4, blur: 20),
                            ),
                            child: const Icon(
                              Icons.monitor_heart,
                              color: CardioTheme.primary,
                              size: 44,
                            ),
                          ),
                          const SizedBox(height: 16),
                          const Text(
                            'CardioQuest',
                            style: TextStyle(
                              fontSize: 34,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 1.5,
                              color: CardioTheme.textPrimary,
                            ),
                          ),
                          const SizedBox(height: 6),
                          const Text(
                            'TECNOLOGIA A SERVIÇO DA VIDA',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 2.2,
                              color: CardioTheme.primary,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 32),

                    // Painel Central HUD
                    CardioHudCard(
                      isGlowing: true,
                      headerTitle: 'ACESSO AO SISTEMA • IDENTIFICAÇÃO PROFISSIONAL',
                      headerIcon: Icons.badge_outlined,
                      padding: const EdgeInsets.all(22),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'SEU NOME NO CRACHÁ',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 1.1,
                              color: CardioTheme.textMuted,
                            ),
                          ),
                          const SizedBox(height: 8),
                          TextField(
                            controller: _controller,
                            style: const TextStyle(color: CardioTheme.textPrimary, fontWeight: FontWeight.w600),
                            onChanged: (valor) => setState(() => _nomeEnfermeiro = valor),
                            decoration: InputDecoration(
                              hintText: 'Digite seu nome para o crachá do plantão...',
                              hintStyle: const TextStyle(color: CardioTheme.textMuted, fontSize: 14),
                              prefixIcon: const Icon(Icons.person_outline, color: CardioTheme.primary),
                              filled: true,
                              fillColor: CardioTheme.surface,
                              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                              enabledBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: const BorderSide(color: CardioTheme.borderSubtle, width: 1.2),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: const BorderSide(color: CardioTheme.primary, width: 1.8),
                              ),
                            ),
                          ),
                          const SizedBox(height: 22),

                          const Text(
                            'SELECIONE SEU AVATAR (3 ENFERMEIROS / 3 ENFERMEIRAS)',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 1.1,
                              color: CardioTheme.textMuted,
                            ),
                          ),
                          const SizedBox(height: 14),

                          // Grade Flexível de Imagens dos Avatares (3 Homens e 3 Mulheres)
                          Center(
                            child: Wrap(
                              spacing: 14,
                              runSpacing: 14,
                              alignment: WrapAlignment.center,
                              children: List.generate(_avataresProfissionais.length, (index) {
                                final item = _avataresProfissionais[index];
                                final isSelecionado = _avatarSelecionado == index;
                                final Color corItem = isSelecionado ? CardioTheme.cyanAccent : CardioTheme.borderSubtle;

                                return GestureDetector(
                                  onTap: () => setState(() => _avatarSelecionado = index),
                                  child: Stack(
                                    clipBehavior: Clip.none,
                                    children: [
                                      AnimatedContainer(
                                        duration: const Duration(milliseconds: 200),
                                        width: 66,
                                        height: 66,
                                        decoration: BoxDecoration(
                                          shape: BoxShape.circle,
                                          border: Border.all(
                                            color: corItem,
                                            width: isSelecionado ? 2.8 : 1.5,
                                          ),
                                          boxShadow: isSelecionado
                                              ? [
                                                  BoxShadow(
                                                    color: CardioTheme.cyanAccent.withValues(alpha: 0.4),
                                                    blurRadius: 14,
                                                    spreadRadius: 2,
                                                  )
                                                ]
                                              : null,
                                        ),
                                        child: ClipOval(
                                          child: item['asset'] != null
                                              ? Image.asset(
                                                  item['asset'] as String,
                                                  width: 66,
                                                  height: 66,
                                                  fit: BoxFit.cover,
                                                  errorBuilder: (context, error, stackTrace) => Center(
                                                    child: Text(
                                                      item['emoji'] as String,
                                                      style: const TextStyle(fontSize: 30),
                                                    ),
                                                  ),
                                                )
                                              : Center(
                                                  child: Text(
                                                    item['emoji'] as String,
                                                    style: const TextStyle(fontSize: 30),
                                                  ),
                                                ),
                                        ),
                                      ),
                                      if (isSelecionado)
                                        Positioned(
                                          right: -2,
                                          bottom: -2,
                                          child: Container(
                                            padding: const EdgeInsets.all(3),
                                            decoration: const BoxDecoration(
                                              color: CardioTheme.surfaceCard,
                                              shape: BoxShape.circle,
                                            ),
                                            child: Container(
                                              width: 20,
                                              height: 20,
                                              decoration: const BoxDecoration(
                                                color: CardioTheme.cyanAccent,
                                                shape: BoxShape.circle,
                                              ),
                                              child: const Icon(
                                                Icons.check,
                                                size: 13,
                                                color: CardioTheme.textDark,
                                              ),
                                            ),
                                          ),
                                        ),
                                    ],
                                  ),
                                );
                              }),
                            ),
                          ),
                          const SizedBox(height: 26),

                          // Botão Bater Ponto & Assumir Plantão
                          CardioButton(
                            label: 'BATER PONTO & ASSUMIR PLANTÃO',
                            icon: Icons.local_hospital_outlined,
                            onPressed: _baterPonto,
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 28),

                    // Rodapé com pilares
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: const [
                        Text(
                          'AGILIDADE',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 1.5,
                            color: CardioTheme.textMuted,
                          ),
                        ),
                        Padding(
                          padding: EdgeInsets.symmetric(horizontal: 10),
                          child: Icon(Icons.circle, size: 5, color: CardioTheme.primary),
                        ),
                        Text(
                          'PRECISÃO',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 1.5,
                            color: CardioTheme.textMuted,
                          ),
                        ),
                        Padding(
                          padding: EdgeInsets.symmetric(horizontal: 10),
                          child: Icon(Icons.circle, size: 5, color: CardioTheme.primary),
                        ),
                        Text(
                          'VIDAS',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 1.5,
                            color: CardioTheme.textMuted,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}