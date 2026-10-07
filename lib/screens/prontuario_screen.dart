import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../data/casos_clinicos_data.dart';
import '../models/caso_clinico.dart';
import '../theme/cardio_theme.dart';
import '../widgets/cardio_hud_card.dart';
import '../widgets/patient_avatar_widget.dart';
import '../widgets/telemetry_badge.dart';
import 'triagem_screen.dart';
import 'anamnese_screen.dart';
import 'ecg_screen.dart';
import 'protocolo_screen.dart';
import 'enzimas_screen.dart';
import 'alta_screen.dart';

class ProntuarioScreen extends StatefulWidget {
  final String? casoInicialId;

  const ProntuarioScreen({
    super.key,
    this.casoInicialId,
  });

  @override
  State<ProntuarioScreen> createState() => _ProntuarioScreenState();
}

class _ProntuarioScreenState extends State<ProntuarioScreen> {
  late CasoClinico _casoSelecionado;
  int _tabFiltroLeitos = 0; // 0: Todos, 1: Sala Vermelha (Grave), 2: Observação

  bool _mod1Concluido = false;
  bool _mod2Liberado = false;
  bool _mod3Liberado = false;
  bool _mod4Liberado = false;
  bool _mod5Liberado = false;
  bool _mod6Liberado = false;
  bool _mod6Concluido = false;

  @override
  void initState() {
    super.initState();
    _definirCasoInicial();
    _carregarProgresso();
  }

  @override
  void didUpdateWidget(covariant ProntuarioScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.casoInicialId != widget.casoInicialId) {
      _definirCasoInicial();
      _carregarProgresso();
    }
  }

  void _definirCasoInicial() {
    if (widget.casoInicialId != null) {
      _casoSelecionado = CasosClinicosData.casos.firstWhere(
        (c) => c.id == widget.casoInicialId,
        orElse: () => CasosClinicosData.casos.first,
      );
    } else {
      _casoSelecionado = CasosClinicosData.casos.first;
    }
  }

  Future<void> _carregarProgresso() async {
    final prefs = await SharedPreferences.getInstance();
    final casoId = _casoSelecionado.id;
    if (mounted) {
      setState(() {
        _mod1Concluido = prefs.getBool('venceu_${casoId}_mod1') ?? false;
        _mod2Liberado = _mod1Concluido;
        _mod3Liberado = prefs.getBool('venceu_${casoId}_mod2') ?? false;
        _mod4Liberado = prefs.getBool('venceu_${casoId}_mod3') ?? false;
        _mod5Liberado = prefs.getBool('venceu_${casoId}_mod4') ?? false;
        _mod6Liberado = prefs.getBool('venceu_${casoId}_mod5') ?? false;
        _mod6Concluido = prefs.getBool('venceu_${casoId}_mod6') ?? false;
      });
    }
  }

  void _trocarPaciente(CasoClinico caso) {
    setState(() {
      _casoSelecionado = caso;
    });
    _carregarProgresso();
  }

  List<CasoClinico> _obterCasosFiltrados() {
    if (_tabFiltroLeitos == 1) {
      return CasosClinicosData.casos.where((c) => c.gravidade == 'GRAVE').toList();
    } else if (_tabFiltroLeitos == 2) {
      return CasosClinicosData.casos.where((c) => c.gravidade != 'GRAVE').toList();
    }
    return CasosClinicosData.casos;
  }

  @override
  Widget build(BuildContext context) {
    final casosExibidos = _obterCasosFiltrados();

    return Scaffold(
      backgroundColor: CardioTheme.background,
      appBar: AppBar(
        backgroundColor: CardioTheme.surface,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: CardioTheme.primary, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'CENTRAL DE PRONTUÁRIOS & LEITOS',
          style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, letterSpacing: 1.2),
        ),
      ),
      body: CyberGridBackground(
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(20.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // 1. Abas de Filtro de Leitos (Inspirado na Imagem 3: Todos, Em Atendimento, Concluídos)
                Row(
                  children: [
                    _buildPillTab('Todos os Leitos (4)', 0),
                    const SizedBox(width: 8),
                    _buildPillTab('Sala Vermelha (2)', 1),
                    const SizedBox(width: 8),
                    _buildPillTab('Observação (2)', 2),
                  ],
                ),
                const SizedBox(height: 14),

                // 2. Carrossel Horizontal / Seletor Rápido de Pacientes
                SizedBox(
                  height: 94,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    itemCount: casosExibidos.length,
                    separatorBuilder: (context, index) => const SizedBox(width: 10),
                    itemBuilder: (context, index) {
                      final paciente = casosExibidos[index];
                      final isSelected = paciente.id == _casoSelecionado.id;
                      final isGrave = paciente.gravidade == 'GRAVE';
                      final Color statusColor = isGrave ? CardioTheme.statusGrave : CardioTheme.statusMuitoUrgente;

                      return GestureDetector(
                        onTap: () => _trocarPaciente(paciente),
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 180),
                          width: 215,
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                          decoration: BoxDecoration(
                            color: isSelected ? CardioTheme.surfaceCard : CardioTheme.surface.withValues(alpha: 0.6),
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(
                              color: isSelected ? statusColor : CardioTheme.borderSubtle,
                              width: isSelected ? 2.0 : 1.0,
                            ),
                            boxShadow: isSelected
                                ? [
                                    BoxShadow(
                                      color: statusColor.withValues(alpha: 0.25),
                                      blurRadius: 10,
                                      spreadRadius: 0,
                                    )
                                  ]
                                : null,
                          ),
                          child: Row(
                            children: [
                              PatientAvatarWidget(
                                caso: paciente,
                                size: 52,
                                isSelected: isSelected,
                                showManchesterBadge: true,
                              ),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Text(
                                      paciente.nome,
                                      style: TextStyle(
                                        fontSize: 12,
                                        fontWeight: FontWeight.bold,
                                        color: isSelected ? CardioTheme.textPrimary : CardioTheme.textSecondary,
                                      ),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                    Text(
                                      '${paciente.leito} • ${paciente.gravidade}',
                                      style: TextStyle(
                                        fontSize: 10,
                                        fontWeight: FontWeight.w600,
                                        color: statusColor,
                                      ),
                                      maxLines: 1,
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
                const SizedBox(height: 18),

                // 3. Banner HUD do Paciente Ativo
                CardioHudCard(
                  isGlowing: true,
                  glowColor: _casoSelecionado.gravidade == 'GRAVE' ? CardioTheme.statusGrave : CardioTheme.statusMuitoUrgente,
                  padding: const EdgeInsets.all(18),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          PatientAvatarWidget(
                            caso: _casoSelecionado,
                            size: 78,
                            showManchesterBadge: true,
                            isSelected: true,
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Flexible(
                                      child: Text(
                                        _casoSelecionado.nome,
                                        style: const TextStyle(
                                          fontSize: 17,
                                          fontWeight: FontWeight.w900,
                                          letterSpacing: 0.8,
                                          color: CardioTheme.textPrimary,
                                        ),
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                      decoration: BoxDecoration(
                                        color: (_casoSelecionado.gravidade == 'GRAVE'
                                                ? CardioTheme.statusGrave
                                                : CardioTheme.statusMuitoUrgente)
                                            .withValues(alpha: 0.2),
                                        borderRadius: BorderRadius.circular(6),
                                        border: Border.all(
                                          color: _casoSelecionado.gravidade == 'GRAVE'
                                              ? CardioTheme.statusGrave
                                              : CardioTheme.statusMuitoUrgente,
                                          width: 1,
                                        ),
                                      ),
                                      child: Text(
                                        _casoSelecionado.gravidade,
                                        style: TextStyle(
                                          fontSize: 10,
                                          fontWeight: FontWeight.bold,
                                          color: _casoSelecionado.gravidade == 'GRAVE'
                                              ? CardioTheme.statusGrave
                                              : CardioTheme.statusMuitoUrgente,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  '${_casoSelecionado.idade} anos • ${_casoSelecionado.sexo} • ${_casoSelecionado.leito}',
                                  style: const TextStyle(fontSize: 12, color: CardioTheme.textSecondary),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  'Local: ${_casoSelecionado.sala}',
                                  style: const TextStyle(fontSize: 11, color: CardioTheme.cyanAccent),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  'Médico: ${_casoSelecionado.medicoResponsavel}',
                                  style: const TextStyle(fontSize: 11, color: CardioTheme.textMuted),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 14),
                      const Divider(color: CardioTheme.borderSubtle, height: 1),
                      const SizedBox(height: 10),
                      const Text(
                        'QUEIXA PRINCIPAL:',
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 1.0,
                          color: CardioTheme.textMuted,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        _casoSelecionado.queixaPrincipal,
                        style: const TextStyle(fontSize: 13, color: CardioTheme.textPrimary, height: 1.3),
                      ),
                      const SizedBox(height: 10),
                      const Text(
                        'EVOLUÇÃO CLÍNICA & CONDUTA:',
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 1.0,
                          color: CardioTheme.textMuted,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        _casoSelecionado.conduta,
                        style: const TextStyle(fontSize: 12, color: CardioTheme.textSecondary, height: 1.3),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // 4. Sinais Vitais do Paciente Selecionado
                CardioHudCard(
                  headerTitle: 'SINAIS VITAIS DO LEITO (${_casoSelecionado.leito})',
                  headerIcon: Icons.speed,
                  padding: const EdgeInsets.all(14),
                  child: SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: [
                        TelemetryBadge(
                          label: 'FC',
                          value: _casoSelecionado.frequenciaCardiaca,
                          icon: Icons.favorite,
                          isWarning: _casoSelecionado.fcCritica,
                          trend: _casoSelecionado.fcCritica ? 'up' : 'stable',
                        ),
                        const SizedBox(width: 8),
                        TelemetryBadge(
                          label: 'PA',
                          value: _casoSelecionado.pressaoArterial,
                          icon: Icons.speed,
                          isWarning: _casoSelecionado.paCritica,
                          trend: _casoSelecionado.paCritica ? 'up' : 'stable',
                        ),
                        const SizedBox(width: 8),
                        TelemetryBadge(
                          label: 'SpO2',
                          value: _casoSelecionado.saturacaoO2,
                          icon: Icons.water_drop,
                          isWarning: _casoSelecionado.spo2Critica,
                          trend: _casoSelecionado.spo2Critica ? 'down' : 'stable',
                        ),
                        const SizedBox(width: 8),
                        TelemetryBadge(
                          label: 'Temp',
                          value: _casoSelecionado.temperatura,
                          icon: Icons.thermostat,
                          isWarning: false,
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                // 5. Módulos de Decisão Clínica
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'CIRCUITO DE CONDUTAS CLÍNICAS (${_casoSelecionado.leito.toUpperCase()})',
                      style: const TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1.1,
                        color: CardioTheme.primary,
                      ),
                    ),
                    Text(
                      _casoSelecionado.classificacaoManchester.toUpperCase(),
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: _casoSelecionado.gravidade == 'GRAVE'
                            ? CardioTheme.statusGrave
                            : CardioTheme.statusMuitoUrgente,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),

                // Módulo 1: Triagem Manchester
                _buildModuloTile(
                  numero: '1',
                  titulo: 'Triagem (Protocolo Manchester)',
                  descricao: 'Classifique o risco e defina o tempo porta-atendimento de emergência.',
                  xp: '+150 XP',
                  isLiberado: true,
                  isConcluido: _mod1Concluido,
                  icon: Icons.filter_alt_outlined,
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => TriagemScreen(caso: _casoSelecionado)),
                  ).then((_) => _carregarProgresso()),
                ),

                // Módulo 2: Anamnese
                _buildModuloTile(
                  numero: '2',
                  titulo: 'Anamnese Direcionada',
                  descricao: 'Investigue fatores de risco, histórico cardiovascular e segurança medicamentosa.',
                  xp: '+150 XP',
                  isLiberado: _mod2Liberado,
                  isConcluido: _mod3Liberado,
                  icon: Icons.history_edu_outlined,
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => AnamneseScreen(caso: _casoSelecionado)),
                  ).then((_) => _carregarProgresso()),
                ),

                // Módulo 3: ECG
                _buildModuloTile(
                  numero: '3',
                  titulo: 'Eletrocardiograma (ECG)',
                  descricao: 'Avalie o traçado: ${_casoSelecionado.ecgResumo}.',
                  xp: '+200 XP',
                  isLiberado: _mod3Liberado,
                  isConcluido: _mod4Liberado,
                  icon: Icons.monitor_heart_outlined,
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => EcgScreen(caso: _casoSelecionado)),
                  ).then((_) => _carregarProgresso()),
                ),

                // Módulo 4: Protocolo MONA
                _buildModuloTile(
                  numero: '4',
                  titulo: 'Protocolo Farmacológico (${_casoSelecionado.id == 'caso_3' ? 'Anti-inflamatório' : _casoSelecionado.id == 'caso_4' ? 'Diurético/VNI' : 'Antiagregação'})',
                  descricao: 'Selecione e administre as medicações imediatas indicadas.',
                  xp: '+200 XP',
                  isLiberado: _mod4Liberado,
                  isConcluido: _mod5Liberado,
                  icon: Icons.medication_outlined,
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => ProtocoloScreen(caso: _casoSelecionado)),
                  ).then((_) => _carregarProgresso()),
                ),

                // Módulo 5: Enzimas Cardíacas
                _buildModuloTile(
                  numero: '5',
                  titulo: 'Enzimas & Biomarcadores',
                  descricao: 'Laboratório: ${_casoSelecionado.enzimasResumo}.',
                  xp: '+150 XP',
                  isLiberado: _mod5Liberado,
                  isConcluido: _mod6Liberado,
                  icon: Icons.biotech_outlined,
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => EnzimasScreen(caso: _casoSelecionado)),
                  ).then((_) => _carregarProgresso()),
                ),

                // Módulo 6: Alta e Encaminhamento
                _buildModuloTile(
                  numero: '6',
                  titulo: 'Conduta e Desfecho Clínico',
                  descricao: 'Encaminhamento adequado e plano de orientação em saúde.',
                  xp: '+150 XP',
                  isLiberado: _mod6Liberado,
                  isConcluido: _mod6Concluido,
                  icon: Icons.check_circle_outline,
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => AltaScreen(caso: _casoSelecionado)),
                  ).then((_) => _carregarProgresso()),
                ),
                const SizedBox(height: 16),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildPillTab(String label, int index) {
    final isSelected = _tabFiltroLeitos == index;
    return GestureDetector(
      onTap: () => setState(() => _tabFiltroLeitos = index),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 160),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? CardioTheme.primary.withValues(alpha: 0.2) : CardioTheme.surfaceCard,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? CardioTheme.primary : CardioTheme.borderSubtle,
            width: 1,
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.bold,
            color: isSelected ? CardioTheme.primary : CardioTheme.textMuted,
          ),
        ),
      ),
    );
  }

  Widget _buildModuloTile({
    required String numero,
    required String titulo,
    required String descricao,
    required String xp,
    required bool isLiberado,
    required bool isConcluido,
    required IconData icon,
    required VoidCallback onTap,
  }) {
    final borderColor = isConcluido
        ? CardioTheme.primary
        : isLiberado
            ? CardioTheme.cyanAccent
            : CardioTheme.borderSubtle;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: isLiberado ? CardioTheme.surfaceCard : CardioTheme.surface.withValues(alpha: 0.6),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: borderColor, width: isLiberado ? 1.5 : 1.0),
        boxShadow: isLiberado
            ? CardioTheme.neonGlow(color: borderColor, opacity: 0.15, blur: 12)
            : null,
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: isLiberado ? onTap : null,
          borderRadius: BorderRadius.circular(16),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              children: [
                Container(
                  width: 46,
                  height: 46,
                  decoration: BoxDecoration(
                    color: isLiberado
                        ? borderColor.withValues(alpha: 0.15)
                        : CardioTheme.surface,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: isLiberado ? borderColor : CardioTheme.borderSubtle,
                      width: 1,
                    ),
                  ),
                  child: Icon(
                    isLiberado ? icon : Icons.lock_outline,
                    color: isLiberado ? borderColor : CardioTheme.textMuted,
                    size: 22,
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Flexible(
                            child: Text(
                              titulo,
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.bold,
                                color: isLiberado ? CardioTheme.textPrimary : CardioTheme.textMuted,
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: isConcluido
                                  ? CardioTheme.primary.withValues(alpha: 0.2)
                                  : CardioTheme.surfaceElevated,
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              isConcluido ? 'CONCLUÍDO' : xp,
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                                color: isConcluido ? CardioTheme.primary : CardioTheme.cyanAccent,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 3),
                      Text(
                        descricao,
                        style: TextStyle(
                          fontSize: 11,
                          color: isLiberado ? CardioTheme.textSecondary : CardioTheme.textMuted.withValues(alpha: 0.6),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                Icon(
                  isLiberado ? Icons.arrow_forward_ios_rounded : Icons.lock,
                  size: 14,
                  color: isLiberado ? borderColor : CardioTheme.textMuted,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}