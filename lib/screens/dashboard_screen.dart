import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../data/casos_clinicos_data.dart';
import '../models/caso_clinico.dart';
import '../theme/cardio_theme.dart';
import '../widgets/cardio_button.dart';
import '../widgets/cardio_hud_card.dart';
import '../widgets/patient_avatar_widget.dart';
import '../widgets/telemetry_badge.dart';
import 'prontuario_screen.dart';
import 'trofeus_screen.dart';
import 'welcome_screen.dart';

class DashboardScreen extends StatefulWidget {
  final String nomeEnfermeiro;
  final String avatar;
  final String? avatarAsset;

  const DashboardScreen({
    super.key,
    required this.nomeEnfermeiro,
    required this.avatar,
    this.avatarAsset,
  });

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _xpAtual = 0;
  int _modulosCompletos = 0;
  String _cargoEnfermeiro = 'Enfermeiro(a) de Plantão';
  SharedPreferences? _prefs;

  final List<Map<String, dynamic>> _niveis = [
    {'nome': 'Estudante Calouro', 'minXp': 0, 'cor': Colors.grey},
    {'nome': 'Interno de Enfermagem', 'minXp': 150, 'cor': Colors.blue},
    {'nome': 'Enfermeiro Júnior', 'minXp': 300, 'cor': CardioTheme.primary},
    {'nome': 'Enfermeiro Pleno', 'minXp': 500, 'cor': Colors.purpleAccent},
    {'nome': 'Especialista em Cardio', 'minXp': 700, 'cor': CardioTheme.statusGrave},
    {'nome': 'Mestre do Plantão', 'minXp': 850, 'cor': CardioTheme.statusMuitoUrgente},
    {'nome': 'Lenda da Enfermagem', 'minXp': 1000, 'cor': CardioTheme.secondary},
  ];

  @override
  void initState() {
    super.initState();
    _carregarDados();
  }

  Future<void> _carregarDados() async {
    final prefs = await SharedPreferences.getInstance();
    int xp = prefs.getInt('xpEnfermeiro') ?? 0;
    String cargo = prefs.getString('cargoEnfermeiro') ?? 'Enfermeiro(a) de Plantão';
    int concluidos = 0;
    for (var c in CasosClinicosData.casos) {
      for (int m = 1; m <= 6; m++) {
        if (CasosClinicosData.isModuloConcluido(c.id, m, prefs)) {
          concluidos++;
        }
      }
    }
    if (concluidos == 0) {
      if (prefs.getBool('venceu_mod1') == true) concluidos++;
      if (prefs.getBool('venceu_mod2') == true) concluidos++;
      if (prefs.getBool('venceu_mod3') == true) concluidos++;
      if (prefs.getBool('venceu_mod4') == true) concluidos++;
      if (prefs.getBool('venceu_mod5') == true) concluidos++;
      if (prefs.getBool('venceu_mod6') == true) concluidos++;
    }

    if (mounted) {
      setState(() {
        _prefs = prefs;
        _xpAtual = xp;
        _modulosCompletos = concluidos;
        _cargoEnfermeiro = cargo;
      });
    }
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
    return 1000;
  }

  Future<void> _sairEResetar() async {
    showDialog(
      context: context,
      builder: (dialogCtx) => AlertDialog(
        backgroundColor: CardioTheme.surfaceCard,
        title: const Row(
          children: [
            Icon(Icons.warning_amber_rounded, color: CardioTheme.statusGrave, size: 28),
            SizedBox(width: 10),
            Text('Reiniciar Plantão?', style: TextStyle(color: CardioTheme.textPrimary)),
          ],
        ),
        content: const Text(
          'Isto irá apagar todo o seu progresso, XP, cadeados e medalhas salvas. Deseja reiniciar?',
          style: TextStyle(color: CardioTheme.textSecondary),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogCtx),
            child: const Text('Cancelar', style: TextStyle(color: CardioTheme.textMuted)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: CardioTheme.statusGrave),
            onPressed: () async {
              final navigator = Navigator.of(context);
              Navigator.pop(dialogCtx);
              final prefs = await SharedPreferences.getInstance();
              await prefs.clear();

              if (!mounted) return;
              navigator.pushReplacement(
                MaterialPageRoute(builder: (context) => const WelcomeScreen()),
              );
            },
            child: const Text('Sim, Reiniciar', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  void _abrirProntuario(String casoId) {
    final desbloqueado = _prefs == null ? (casoId == 'caso_1') : CasosClinicosData.isCasoDesbloqueado(casoId, _prefs!);
    if (!desbloqueado) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Row(
            children: [
              const Icon(Icons.lock_outline, color: Colors.white, size: 20),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  CasosClinicosData.obterMensagemBloqueio(casoId),
                  style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
                ),
              ),
            ],
          ),
          backgroundColor: CardioTheme.statusGrave,
          behavior: SnackBarBehavior.floating,
          duration: const Duration(seconds: 4),
        ),
      );
      return;
    }

    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => ProntuarioScreen(casoInicialId: casoId),
      ),
    ).then((_) => _carregarDados());
  }

  @override
  Widget build(BuildContext context) {
    final nivelAtual = _obterNivelAtual();
    final proximoXp = _obterProximoXp();
    final progresso = (_xpAtual / (proximoXp == 0 ? 1 : proximoXp)).clamp(0.0, 1.0);

    return Scaffold(
      backgroundColor: CardioTheme.background,
      appBar: AppBar(
        backgroundColor: CardioTheme.surface,
        automaticallyImplyLeading: false,
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: CardioTheme.primary.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.monitor_heart, color: CardioTheme.primary, size: 22),
            ),
            const SizedBox(width: 10),
            const Text(
              'CENTRAL DO PLANTÃO MÉDICO',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                letterSpacing: 1.2,
                color: CardioTheme.textPrimary,
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.emoji_events_outlined, color: CardioTheme.primary),
            tooltip: 'Galeria de Troféus',
            onPressed: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const TrofeusScreen()),
            ).then((_) => _carregarDados()),
          ),
          IconButton(
            icon: const Icon(Icons.refresh, color: CardioTheme.textSecondary),
            tooltip: 'Reiniciar Plantão',
            onPressed: _sairEResetar,
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: CyberGridBackground(
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(20.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // 1. Perfil do Profissional & Status do Turno (HUD)
                CardioHudCard(
                  isGlowing: true,
                  padding: const EdgeInsets.all(18),
                  child: Column(
                    children: [
                      Row(
                        children: [
                          Container(
                            width: 82,
                            height: 82,
                            decoration: BoxDecoration(
                              color: CardioTheme.surfaceElevated,
                              borderRadius: BorderRadius.circular(18),
                              border: Border.all(color: CardioTheme.primary, width: 2),
                              boxShadow: CardioTheme.neonGlow(opacity: 0.35, blur: 12),
                            ),
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(16),
                              child: (widget.avatarAsset != null && widget.avatarAsset!.isNotEmpty)
                                  ? Image.asset(
                                      widget.avatarAsset!,
                                      fit: BoxFit.cover,
                                      errorBuilder: (context, error, stackTrace) => Center(
                                        child: Text(widget.avatar, style: const TextStyle(fontSize: 44)),
                                      ),
                                    )
                                  : Center(
                                      child: Text(widget.avatar, style: const TextStyle(fontSize: 44)),
                                    ),
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Flexible(
                                      child: Text(
                                        widget.nomeEnfermeiro.toUpperCase(),
                                        style: const TextStyle(
                                          fontSize: 20,
                                          fontWeight: FontWeight.w900,
                                          letterSpacing: 1.1,
                                          color: CardioTheme.textPrimary,
                                        ),
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
                                      decoration: BoxDecoration(
                                        color: CardioTheme.primary.withValues(alpha: 0.15),
                                        borderRadius: BorderRadius.circular(8),
                                        border: Border.all(color: CardioTheme.primary, width: 1),
                                      ),
                                      child: Text(
                                        '$_xpAtual XP',
                                        style: const TextStyle(
                                          fontSize: 13,
                                          fontWeight: FontWeight.bold,
                                          color: CardioTheme.primary,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 3),
                                Text(
                                  _cargoEnfermeiro,
                                  style: const TextStyle(fontSize: 13, color: CardioTheme.cyanAccent),
                                ),
                                const SizedBox(height: 3),
                                Text(
                                  nivelAtual['nome'],
                                  style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.bold,
                                    color: nivelAtual['cor'],
                                  ),
                                ),
                                const SizedBox(height: 8),
                                ClipRRect(
                                  borderRadius: BorderRadius.circular(6),
                                  child: LinearProgressIndicator(
                                    value: progresso,
                                    minHeight: 8,
                                    backgroundColor: CardioTheme.surface,
                                    valueColor: const AlwaysStoppedAnimation<Color>(CardioTheme.primary),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 14),
                      const Divider(color: CardioTheme.borderSubtle, height: 1),
                      const SizedBox(height: 10),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          _buildStatItem('MÓDULOS CONCLUÍDOS', '$_modulosCompletos / 6', Icons.task_alt),
                          _buildStatItem('LEITOS ATIVOS', '${CasosClinicosData.casos.length} PACIENTES', Icons.hotel_outlined),
                          _buildStatItem('EFICIÊNCIA DO TURNO', _xpAtual > 0 ? '96%' : '--', Icons.bolt),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 18),

                // 2. Acesso Rápido a Prontuários & Conquistas
                Row(
                  children: [
                    Expanded(
                      child: CardioHudCard(
                        onTap: () => _abrirProntuario('caso_1'),
                        isGlowing: true,
                        glowColor: CardioTheme.cyanAccent,
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                        child: Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(9),
                              decoration: BoxDecoration(
                                color: CardioTheme.cyanAccent.withValues(alpha: 0.15),
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: const Icon(Icons.assignment_outlined, color: CardioTheme.cyanAccent, size: 24),
                            ),
                            const SizedBox(width: 10),
                            const Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'PRONTUÁRIOS',
                                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: CardioTheme.textPrimary),
                                  ),
                                  Text(
                                    '3 Níveis de Dificuldade',
                                    style: TextStyle(fontSize: 11.5, color: CardioTheme.textMuted),
                                  ),
                                ],
                              ),
                            ),
                            const Icon(Icons.arrow_forward_ios, size: 13, color: CardioTheme.cyanAccent),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: CardioHudCard(
                        onTap: () => Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) => const TrofeusScreen()),
                        ).then((_) => _carregarDados()),
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                        child: Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(9),
                              decoration: BoxDecoration(
                                color: CardioTheme.statusUrgente.withValues(alpha: 0.15),
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: const Icon(Icons.emoji_events_outlined, color: CardioTheme.statusUrgente, size: 24),
                            ),
                            const SizedBox(width: 10),
                            const Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'CONQUISTAS',
                                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: CardioTheme.textPrimary),
                                  ),
                                  Text(
                                    'Galeria de Medalhas',
                                    style: TextStyle(fontSize: 11.5, color: CardioTheme.textMuted),
                                  ),
                                ],
                              ),
                            ),
                            const Icon(Icons.arrow_forward_ios, size: 13, color: CardioTheme.textMuted),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),

                // 3. Telemetria do Leito 02 (Admissão Rápida)
                CardioHudCard(
                  headerTitle: 'TELEMETRIA EM TEMPO REAL • LEITO 02 (SALA VERMELHA)',
                  headerIcon: Icons.monitor_heart_outlined,
                  padding: const EdgeInsets.all(14),
                  child: SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: const [
                        TelemetryBadge(
                          label: 'FC',
                          value: '118 bpm',
                          icon: Icons.favorite,
                          accentColor: CardioTheme.statusGrave,
                          isWarning: true,
                          trend: 'up',
                        ),
                        SizedBox(width: 8),
                        TelemetryBadge(
                          label: 'PA',
                          value: '160/100',
                          icon: Icons.speed,
                          accentColor: CardioTheme.statusGrave,
                          isWarning: true,
                          trend: 'up',
                        ),
                        SizedBox(width: 8),
                        TelemetryBadge(
                          label: 'SpO2',
                          value: '92%',
                          icon: Icons.water_drop,
                          accentColor: CardioTheme.statusMuitoUrgente,
                          isWarning: true,
                          trend: 'down',
                        ),
                        SizedBox(width: 8),
                        TelemetryBadge(
                          label: 'Temp',
                          value: '37.8 °C',
                          icon: Icons.thermostat,
                          accentColor: CardioTheme.statusUrgente,
                          trend: 'stable',
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 22),

                // 4. Lista Completa de Pacientes em Atendimento (Inspirado na Imagem 2)
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'PACIENTES EM ATENDIMENTO NO PLANTÃO (3)',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1.1,
                        color: CardioTheme.primary,
                      ),
                    ),
                    Text(
                      'TOQUE PARA ATENDER',
                      style: TextStyle(
                        fontSize: 11.5,
                        fontWeight: FontWeight.bold,
                        color: CardioTheme.cyanAccent.withValues(alpha: 0.8),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),

                // Cards de Pacientes
                ...CasosClinicosData.casos.map((caso) => _buildPacienteCard(caso)),

                const SizedBox(height: 20),

                // 5. Botão de Ação Principal
                CardioButton(
                  label: 'ACESSAR CENTRAL DE LEITOS & CONDUTAS',
                  icon: Icons.play_arrow_rounded,
                  onPressed: () => _abrirProntuario('caso_1'),
                ),
                const SizedBox(height: 12),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildPacienteCard(CasoClinico caso) {
    final isDesbloqueado = _prefs == null ? (caso.id == 'caso_1') : CasosClinicosData.isCasoDesbloqueado(caso.id, _prefs!);
    final bool isGrave = caso.gravidade == 'GRAVE';
    final Color statusColor = isGrave ? CardioTheme.statusGrave : CardioTheme.statusMuitoUrgente;
    final Color diffColor = caso.dificuldade == 'FÁCIL'
        ? CardioTheme.primary
        : caso.dificuldade == 'MÉDIO'
            ? CardioTheme.statusMuitoUrgente
            : CardioTheme.statusGrave;

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: isDesbloqueado ? CardioTheme.surfaceCard : CardioTheme.surface.withValues(alpha: 0.5),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: isDesbloqueado
              ? (isGrave ? statusColor.withValues(alpha: 0.6) : CardioTheme.borderSubtle)
              : CardioTheme.borderSubtle.withValues(alpha: 0.4),
          width: 1,
        ),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () => _abrirProntuario(caso.id),
          borderRadius: BorderRadius.circular(14),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            child: Row(
              children: [
                Opacity(
                  opacity: isDesbloqueado ? 1.0 : 0.45,
                  child: PatientAvatarWidget(
                    caso: caso,
                    size: 62,
                    showManchesterBadge: isDesbloqueado,
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Flexible(
                            child: Text(
                              caso.nome,
                              style: TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.bold,
                                color: isDesbloqueado ? CardioTheme.textPrimary : CardioTheme.textMuted,
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                            decoration: BoxDecoration(
                              color: isDesbloqueado ? diffColor.withValues(alpha: 0.18) : Colors.white10,
                              borderRadius: BorderRadius.circular(4),
                              border: Border.all(
                                color: isDesbloqueado ? diffColor.withValues(alpha: 0.6) : Colors.white24,
                                width: 0.8,
                              ),
                            ),
                            child: Text(
                              'NÍVEL ${caso.nivel} • ${caso.dificuldade}',
                              style: TextStyle(
                                fontSize: 10.5,
                                fontWeight: FontWeight.bold,
                                color: isDesbloqueado ? diffColor : CardioTheme.textMuted,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 3),
                      Text(
                        isDesbloqueado
                            ? '${caso.leito} • ${caso.sala}'
                            : 'Bloqueado • Conclua o Nível ${caso.nivel - 1} para liberar',
                        style: TextStyle(
                          fontSize: 12.5,
                          color: isDesbloqueado ? CardioTheme.textMuted : CardioTheme.statusUrgente.withValues(alpha: 0.8),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                Icon(
                  isDesbloqueado ? Icons.arrow_forward_ios : Icons.lock_outline,
                  size: isDesbloqueado ? 15 : 19,
                  color: isDesbloqueado ? CardioTheme.primary : CardioTheme.textMuted,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildStatItem(String label, String value, IconData icon) {
    return Column(
      children: [
        Icon(icon, size: 19, color: CardioTheme.primary),
        const SizedBox(height: 4),
        Text(
          value,
          style: const TextStyle(
            fontSize: 14.5,
            fontWeight: FontWeight.bold,
            color: CardioTheme.textPrimary,
          ),
        ),
        Text(
          label,
          style: const TextStyle(
            fontSize: 10.5,
            fontWeight: FontWeight.w700,
            letterSpacing: 0.5,
            color: CardioTheme.textMuted,
          ),
        ),
      ],
    );
  }
}