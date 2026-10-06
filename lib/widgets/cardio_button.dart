import 'package:flutter/material.dart';
import '../theme/cardio_theme.dart';

/// Botão de Alta Tecnologia com Gradiente Neon Emerald e Brilho HUD
class CardioButton extends StatelessWidget {
  final String label;
  final VoidCallback onPressed;
  final IconData? icon;
  final bool isFullWidth;
  final bool isSecondary;
  final Color? customColor;
  final double height;
  final double fontSize;

  const CardioButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.icon,
    this.isFullWidth = true,
    this.isSecondary = false,
    this.customColor,
    this.height = 56,
    this.fontSize = 16,
  });

  @override
  Widget build(BuildContext context) {
    if (isSecondary) {
      return SizedBox(
        width: isFullWidth ? double.infinity : null,
        height: height,
        child: OutlinedButton(
          onPressed: onPressed,
          style: OutlinedButton.styleFrom(
            side: BorderSide(
              color: customColor ?? CardioTheme.borderMedium,
              width: 1.5,
            ),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(14),
            ),
            backgroundColor: CardioTheme.surfaceCard,
            padding: const EdgeInsets.symmetric(horizontal: 20),
          ),
          child: Row(
            mainAxisSize: isFullWidth ? MainAxisSize.max : MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              if (icon != null) ...[
                Icon(icon, size: 20, color: customColor ?? CardioTheme.textPrimary),
                const SizedBox(width: 8),
              ],
              Text(
                label,
                style: TextStyle(
                  fontSize: fontSize,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 0.8,
                  color: customColor ?? CardioTheme.textPrimary,
                ),
              ),
            ],
          ),
        ),
      );
    }

    return Container(
      width: isFullWidth ? double.infinity : null,
      height: height,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(14),
        gradient: LinearGradient(
          colors: customColor != null
              ? [customColor!, customColor!.withValues(alpha: 0.8)]
              : const [Color(0xFF00E599), Color(0xFF059669)],
          begin: Alignment.centerLeft,
          end: Alignment.centerRight,
        ),
        boxShadow: [
          BoxShadow(
            color: (customColor ?? CardioTheme.primary).withValues(alpha: 0.4),
            blurRadius: 16,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onPressed,
          borderRadius: BorderRadius.circular(14),
          splashColor: Colors.white.withValues(alpha: 0.25),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              mainAxisSize: isFullWidth ? MainAxisSize.max : MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                if (icon != null) ...[
                  Icon(icon, size: 20, color: CardioTheme.textDark),
                  const SizedBox(width: 8),
                ],
                Flexible(
                  child: Text(
                    label,
                    style: TextStyle(
                      fontSize: fontSize,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 0.8,
                      color: CardioTheme.textDark,
                    ),
                    overflow: TextOverflow.ellipsis,
                    maxLines: 1,
                  ),
                ),
                const SizedBox(width: 6),
                const Icon(
                  Icons.arrow_forward_ios_rounded,
                  size: 14,
                  color: CardioTheme.textDark,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
