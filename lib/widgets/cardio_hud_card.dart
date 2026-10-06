import 'package:flutter/material.dart';
import '../theme/cardio_theme.dart';

/// Cartão com estilo de Interface HUD Médica de Alta Tecnologia
class CardioHudCard extends StatelessWidget {
  final Widget child;
  final String? headerTitle;
  final IconData? headerIcon;
  final Widget? trailing;
  final bool isGlowing;
  final Color? glowColor;
  final EdgeInsetsGeometry padding;
  final EdgeInsetsGeometry? margin;
  final VoidCallback? onTap;

  const CardioHudCard({
    super.key,
    required this.child,
    this.headerTitle,
    this.headerIcon,
    this.trailing,
    this.isGlowing = false,
    this.glowColor,
    this.padding = const EdgeInsets.all(16),
    this.margin,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final borderColor = isGlowing
        ? (glowColor ?? CardioTheme.primary)
        : CardioTheme.borderSubtle;

    Widget cardContent = Container(
      margin: margin,
      padding: padding,
      decoration: BoxDecoration(
        color: CardioTheme.surfaceCard,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: borderColor,
          width: isGlowing ? 1.5 : 1.0,
        ),
        boxShadow: [
          if (isGlowing)
            BoxShadow(
              color: (glowColor ?? CardioTheme.primary).withValues(alpha: 0.25),
              blurRadius: 16,
              spreadRadius: 0,
            )
          else
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.4),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          if (headerTitle != null) ...[
            Row(
              children: [
                if (headerIcon != null) ...[
                  Icon(
                    headerIcon,
                    size: 16,
                    color: glowColor ?? CardioTheme.primary,
                  ),
                  const SizedBox(width: 8),
                ],
                Expanded(
                  child: Text(
                    headerTitle!.toUpperCase(),
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.2,
                      color: glowColor ?? CardioTheme.textSecondary,
                    ),
                  ),
                ),
                if (trailing != null) trailing!,
              ],
            ),
            const SizedBox(height: 12),
          ],
          child,
        ],
      ),
    );

    if (onTap != null) {
      return Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(16),
          splashColor: CardioTheme.primary.withValues(alpha: 0.2),
          highlightColor: CardioTheme.primary.withValues(alpha: 0.1),
          child: cardContent,
        ),
      );
    }

    return cardContent;
  }
}
