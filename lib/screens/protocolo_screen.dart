import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../data/casos_clinicos_data.dart';
import '../data/questionarios_data.dart';
import '../models/caso_clinico.dart';
import '../theme/cardio_theme.dart';
import '../widgets/cardio_button.dart';
import '../widgets/cardio_hud_card.dart';

class ProtocoloScreen extends StatefulWidget {
  final CasoClinico? caso;

  const ProtocoloScreen({
    super.key,
    this.caso,
  });

  @override
  State<ProtocoloScreen> createState() => _ProtocoloScreenState();
}

class _ProtocoloScreenState extends State<ProtocoloScreen> {
  late CasoClinico _caso;
  late Map<String, dynamic> _dadosProtocolo;
  late List<String> _medicamentos;
  late List<String> _gabarito;
  final List<String> _selecionados = [];

  @override
  void initState() {
    super.initState();
    _caso = widget.caso ?? CasosClinicosData.casos.first;
    _dadosProtocolo = QuestionariosData.obterProtocoloFarmacologico(_caso);
    _medicamentos = List<String>.from(_dadosProtocolo['medicamentos'] as List);
    _gabarito = List<String>.from(_dadosProtocolo['gabarito'] as List);
  }

  void _alternarMedicamento(String remedio) {
    setState(() {
      if (_selecionados.contains(remedio)) {
        _selecionados.remove(remedio);
      } else {
        if (_selecionados.length < 4) {
          _selecionados.add(remedio);
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('O protocolo imediato exige exatamente 4 intervenções prioritárias.'),
              backgroundColor: CardioTheme.statusMuitoUrgente,
              duration: Duration(seconds: 2),
            ),
          );
        }
      }
    });
  }

  void _confirmarProtocolo() async {
    bool acertouTudo = _selecionados.length == 4 &&
        _selecionados.every((remedio) => _gabarito.contains(remedio));

    if (acertouTudo) {
      final prefs = await SharedPreferences.getInstance();
      int xpAtual = prefs.getInt('xpEnfermeiro') ?? 0;
      await prefs.setInt('xpEnfermeiro', xpAtual + 200);
      final casoId = widget.caso?.id ?? 'caso_1';
      await prefs.setBool('venceu_${casoId}_mod4', true);
      await prefs.setBool('venceu_mod4', true);

      if (mounted) {
        showDialog(
          context: context,
          barrierDismissible: false,
          builder: (dialogCtx) => AlertDialog(
            backgroundColor: CardioTheme.surfaceCard,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
              side: const BorderSide(color: CardioTheme.primary, width: 1.5),
            ),
            title: const Row(
              children: [
                Icon(Icons.verified, color: CardioTheme.primary, size: 28),
                SizedBox(width: 10),
                Text('Prescrição & Manejo Assertivo!', style: TextStyle(color: CardioTheme.textPrimary)),
              ],
            ),
            content: Text(
              '${_dadosProtocolo['explicacao']}\n\nVocê conquistou +200 XP!',
              style: const TextStyle(color: CardioTheme.textSecondary, fontSize: 14),
            ),
            actions: [
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: CardioTheme.primary,
                  foregroundColor: CardioTheme.textDark,
                ),
                onPressed: () {
                  Navigator.pop(dialogCtx);
                  Navigator.pop(context);
                },
                child: const Text('Continuar para Enzimas', style: TextStyle(fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        );
      }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Combinação incorreta para o caso de ${_caso.nome}. Releia a queixa clínica e fisiopatologia.'),
          backgroundColor: CardioTheme.statusGrave,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: CardioTheme.background,
      appBar: AppBar(
        backgroundColor: CardioTheme.surface,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: CardioTheme.primary, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'MÓDULO 4 • PROTOCOLO MONA',
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
                // Header com Status de Seleção HUD
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'DISPENSÁRIO FARMACOLÓGICO DE EMERGÊNCIA',
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1.1,
                        color: CardioTheme.primary,
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: _selecionados.length == 4
                            ? CardioTheme.primary.withValues(alpha: 0.2)
                            : CardioTheme.surfaceElevated,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                          color: _selecionados.length == 4 ? CardioTheme.primary : CardioTheme.borderSubtle,
                        ),
                      ),
                      child: Text(
                        '${_selecionados.length} / 4 SELECIONADOS',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: _selecionados.length == 4 ? CardioTheme.primary : CardioTheme.textMuted,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                // Cartão de Instrução Clínica
                CardioHudCard(
                  headerTitle: _dadosProtocolo['titulo'] as String,
                  headerIcon: Icons.medical_services_outlined,
                  padding: const EdgeInsets.all(18),
                  child: Text(
                    _dadosProtocolo['descricao'] as String,
                    style: const TextStyle(
                      fontSize: 14,
                      color: CardioTheme.textSecondary,
                      height: 1.4,
                    ),
                  ),
                ),
                const SizedBox(height: 20),

                // Grid de Medicamentos
                GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    childAspectRatio: 2.2,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                  ),
                  itemCount: _medicamentos.length,
                  itemBuilder: (context, index) {
                    final remedio = _medicamentos[index];
                    final isMarcado = _selecionados.contains(remedio);

                    return GestureDetector(
                      onTap: () => _alternarMedicamento(remedio),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 180),
                        decoration: BoxDecoration(
                          color: isMarcado
                              ? CardioTheme.primary.withValues(alpha: 0.15)
                              : CardioTheme.surfaceCard,
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(
                            color: isMarcado ? CardioTheme.primary : CardioTheme.borderSubtle,
                            width: isMarcado ? 2.0 : 1.0,
                          ),
                          boxShadow: isMarcado
                              ? CardioTheme.neonGlow(opacity: 0.3, blur: 12)
                              : null,
                        ),
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        child: Row(
                          children: [
                            Icon(
                              isMarcado ? Icons.check_box : Icons.check_box_outline_blank,
                              color: isMarcado ? CardioTheme.primary : CardioTheme.textMuted,
                              size: 20,
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                remedio,
                                style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: isMarcado ? FontWeight.bold : FontWeight.w500,
                                  color: isMarcado ? CardioTheme.primary : CardioTheme.textPrimary,
                                ),
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
                const SizedBox(height: 28),

                // Botão de Confirmação
                CardioButton(
                  label: 'ADMINISTRAR PROTOCOLO',
                  icon: Icons.send_rounded,
                  onPressed: _confirmarProtocolo,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}