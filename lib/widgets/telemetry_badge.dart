import 'package:flutter/material.dart';
import '../theme/cardio_theme.dart';

/// Item de Telemetria de Sinais Vitais do Paciente (Estilo Cockpit Médico)
class TelemetryBadge extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final Color accentColor;
  final bool isWarning;
  final String? trend; // "up", "down", "stable"

  const TelemetryBadge({
    super.key,
    required this.label,
    required this.value,
    required this.icon,
    this.accentColor = CardioTheme.primary,
    this.isWarning = false,
    this.trend,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: CardioTheme.surfaceElevated,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isWarning
              ? CardioTheme.statusGrave.withValues(alpha: 0.6)
              : CardioTheme.borderSubtle,
          width: 1,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            icon,
            size: 20,
            color: isWarning ? CardioTheme.statusGrave : accentColor,
          ),
          const SizedBox(width: 8),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                label.toUpperCase(),
                style: const TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 0.8,
                  color: CardioTheme.textMuted,
                ),
              ),
              Row(
                children: [
                  Text(
                    value,
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: isWarning ? CardioTheme.statusGrave : CardioTheme.textPrimary,
                    ),
                  ),
                  if (trend != null) ...[
                    const SizedBox(width: 4),
                    Icon(
                      trend == 'up'
                          ? Icons.arrow_upward
                          : trend == 'down'
                              ? Icons.arrow_downward
                              : Icons.drag_handle,
                      size: 12,
                      color: isWarning ? CardioTheme.statusGrave : CardioTheme.primary,
                    ),
                  ],
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }
}
