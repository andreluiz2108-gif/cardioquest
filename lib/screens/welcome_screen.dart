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

  // Lista de Avatares Clínicos Especializados e Bem Diferenciados
  final List<Map<String, dynamic>> _avataresProfissionais = [
    {
      'emoji': '🩺',
      'papel': 'Enf. Emergência',
      'especialidade': 'Sala Vermelha',
      'cor': CardioTheme.statusGrave,
      'icone': Icons.local_hospital,
    },
    {
      'emoji': '🫀',
      'papel': 'Especialista Cardio',
      'especialidade': 'Hemodinâmica',
      'cor': CardioTheme.primary,
      'icone': Icons.monitor_heart,
    },
    {
      'emoji': '⚡',
      'papel': 'Intensivista',
      'especialidade': 'CTI Cardiológico',
      'cor': CardioTheme.cyanAccent,
      'icone': Icons.bolt,
    },
    {
      'emoji': '🚑',
      'papel': 'Socorrista',
      'especialidade': 'Resgate / SAMU',
      'cor': CardioTheme.statusMuitoUrgente,
      'icone': Icons.emergency,
    },
    {
      'emoji': '🧬',
      'papel': 'Bioquímico(a)',
      'especialidade': 'Laboratório / Biomarcadores',
      'cor': Colors.purpleAccent,
      'icone': Icons.science,
    },
    {
      'emoji': '👔',
      'papel': 'Chefe de Plantão',
      'especialidade': 'Coordenação Clínica',
      'cor': CardioTheme.statusUrgente,
      'icone': Icons.admin_panel_settings,
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

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('nomeEnfermeiro', nome);
    await prefs.setString('avatarEnfermeiro', avatarEmoji);
    await prefs.setString('cargoEnfermeiro', avatarData['papel'] as String);

    if (mounted) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (context) => DashboardScreen(
            nomeEnfermeiro: nome,
            avatar: avatarEmoji,
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
                            'NOME DO PROFISSIONAL',
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
                              hintText: 'Digite seu nome para o crachá...',
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
                            'SELECIONE SUA ESPECIALIDADE / AVATAR NO PLANTÃO',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 1.1,
                              color: CardioTheme.textMuted,
                            ),
                          ),
                          const SizedBox(height: 12),

                          // Grid de Avatares Clínicos Diferenciados
                          GridView.builder(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                              crossAxisCount: 3,
                              childAspectRatio: 1.4,
                              crossAxisSpacing: 10,
                              mainAxisSpacing: 10,
                            ),
                            itemCount: _avataresProfissionais.length,
                            itemBuilder: (context, index) {
                              final item = _avataresProfissionais[index];
                              final isSelecionado = _avatarSelecionado == index;
                              final Color corItem = item['cor'] as Color;

                              return GestureDetector(
                                onTap: () => setState(() => _avatarSelecionado = index),
                                child: AnimatedContainer(
                                  duration: const Duration(milliseconds: 180),
                                  decoration: BoxDecoration(
                                    color: isSelecionado
                                        ? corItem.withValues(alpha: 0.15)
                                        : CardioTheme.surface,
                                    borderRadius: BorderRadius.circular(12),
                                    border: Border.all(
                                      color: isSelecionado ? corItem : CardioTheme.borderSubtle,
                                      width: isSelecionado ? 2.0 : 1.0,
                                    ),
                                    boxShadow: isSelecionado
                                        ? [
                                            BoxShadow(
                                              color: corItem.withValues(alpha: 0.35),
                                              blurRadius: 10,
                                              spreadRadius: 0,
                                            )
                                          ]
                                        : null,
                                  ),
                                  padding: const EdgeInsets.all(8),
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.center,
                                        children: [
                                          Text(
                                            item['emoji'] as String,
                                            style: const TextStyle(fontSize: 22),
                                          ),
                                          const SizedBox(width: 4),
                                          Icon(
                                            item['icone'] as IconData,
                                            size: 14,
                                            color: isSelecionado ? corItem : CardioTheme.textMuted,
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        item['papel'] as String,
                                        style: TextStyle(
                                          fontSize: 10,
                                          fontWeight: FontWeight.bold,
                                          color: isSelecionado ? corItem : CardioTheme.textPrimary,
                                        ),
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                        textAlign: TextAlign.center,
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            },
                          ),
                          const SizedBox(height: 24),

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