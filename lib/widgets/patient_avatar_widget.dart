import 'package:flutter/material.dart';
import '../models/caso_clinico.dart';
import '../theme/cardio_theme.dart';

/// Widget de Avatar Realista para Pacientes com Badge do Protocolo Manchester
class PatientAvatarWidget extends StatelessWidget {
  final CasoClinico? caso;
  final String? assetPath;
  final String fallbackEmoji;
  final double size;
  final bool showManchesterBadge;
  final bool isSelected;
  final VoidCallback? onTap;

  const PatientAvatarWidget({
    super.key,
    this.caso,
    this.assetPath,
    this.fallbackEmoji = '👤',
    this.size = 62,
    this.showManchesterBadge = true,
    this.isSelected = false,
    this.onTap,
  });

  Color _obterCorManchester() {
    if (caso == null) return CardioTheme.primary;
    final manchester = caso!.classificacaoManchester.toLowerCase();
    if (manchester.contains('vermelho')) {
      return CardioTheme.statusGrave;
    } else if (manchester.contains('laranja')) {
      return CardioTheme.statusMuitoUrgente;
    } else if (manchester.contains('amarelo')) {
      return CardioTheme.statusUrgente;
    } else if (manchester.contains('verde')) {
      return CardioTheme.statusEstavel;
    } else {
      return CardioTheme.statusPoucoUrgente;
    }
  }

  String _obterTextoBadge() {
    if (caso == null) return '';
    final manchester = caso!.classificacaoManchester.toLowerCase();
    if (manchester.contains('vermelho')) return '0m';
    if (manchester.contains('laranja')) return '10m';
    if (manchester.contains('amarelo')) return '60m';
    if (manchester.contains('verde')) return '120m';
    return '240m';
  }

  @override
  Widget build(BuildContext context) {
    final effectiveAsset = assetPath ?? caso?.avatarAsset;
    final effectiveEmoji = caso?.avatar ?? fallbackEmoji;
    final manchesterColor = _obterCorManchester();
    final badgeSize = (size * 0.38).clamp(16.0, 24.0);

    Widget avatarContent;
    if (effectiveAsset != null && effectiveAsset.isNotEmpty) {
      avatarContent = Image.asset(
        effectiveAsset,
        width: size,
        height: size,
        fit: BoxFit.cover,
        errorBuilder: (context, error, stackTrace) {
          return Container(
            color: const Color(0xFF0F263A),
            alignment: Alignment.center,
            child: Text(
              effectiveEmoji,
              style: TextStyle(fontSize: size * 0.45),
            ),
          );
        },
      );
    } else {
      avatarContent = Container(
        color: const Color(0xFF0F263A),
        alignment: Alignment.center,
        child: Text(
          effectiveEmoji,
          style: TextStyle(fontSize: size * 0.45),
        ),
      );
    }

    Widget mainAvatar = Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        border: Border.all(
          color: isSelected ? CardioTheme.cyanAccent : manchesterColor,
          width: isSelected ? 2.5 : 2.0,
        ),
        boxShadow: [
          BoxShadow(
            color: (isSelected ? CardioTheme.cyanAccent : manchesterColor).withValues(alpha: 0.35),
            blurRadius: isSelected ? 12 : 8,
            spreadRadius: isSelected ? 1.5 : 0.5,
          ),
        ],
      ),
      child: ClipOval(
        child: avatarContent,
      ),
    );

    if (onTap != null) {
      mainAvatar = InkWell(
        onTap: onTap,
        customBorder: const CircleBorder(),
        child: mainAvatar,
      );
    }

    if (!showManchesterBadge || caso == null) {
      return mainAvatar;
    }

    return Stack(
      clipBehavior: Clip.none,
      children: [
        mainAvatar,
        // Badge Manchester posicionado no canto inferior direito
        Positioned(
          bottom: 0,
          right: 0,
          child: Container(
            padding: const EdgeInsets.all(2),
            decoration: const BoxDecoration(
              color: CardioTheme.surfaceCard,
              shape: BoxShape.circle,
            ),
            child: Container(
              width: badgeSize,
              height: badgeSize,
              decoration: BoxDecoration(
                color: manchesterColor,
                shape: BoxShape.circle,
                border: Border.all(color: Colors.white, width: 1.2),
                boxShadow: [
                  BoxShadow(
                    color: manchesterColor.withValues(alpha: 0.6),
                    blurRadius: 4,
                  ),
                ],
              ),
              alignment: Alignment.center,
              child: Text(
                _obterTextoBadge(),
                style: TextStyle(
                  color: manchesterColor == CardioTheme.statusUrgente ? Colors.black : Colors.white,
                  fontSize: badgeSize * 0.42,
                  fontWeight: FontWeight.w900,
                  letterSpacing: -0.5,
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
