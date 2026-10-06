import 'package:flutter/material.dart';

/// Design System & Theme Tokens para o CardioQuest
/// Estética: Dark Cyber-Medical HUD / High-Tech Clinical Cockpit
class CardioTheme {
  // Paleta de Cores de Fundo (Deep Navy / Cyber Slate)
  static const Color background = Color(0xFF060E18);
  static const Color surface = Color(0xFF0B1724);
  static const Color surfaceCard = Color(0xFF0D1E30);
  static const Color surfaceCardAccent = Color(0xFF10283F);
  static const Color surfaceElevated = Color(0xFF142E47);

  // Paleta de Realce Neon (Medical Emerald & Cyan Glow)
  static const Color primary = Color(0xFF00E599);
  static const Color primaryDark = Color(0xFF059669);
  static const Color primaryLight = Color(0xFF6EE7B7);
  static const Color secondary = Color(0xFF00D2B4);
  static const Color cyanAccent = Color(0xFF00F2FE);

  // Bordas e Linhas Tecnológicas
  static const Color borderSubtle = Color(0xFF16324A);
  static const Color borderMedium = Color(0xFF1E4E6F);
  static const Color borderGlow = Color(0xFF00E599);
  static const Color gridLine = Color(0x1500E599);

  // Cores Clínicas e Manchester
  static const Color statusGrave = Color(0xFFEF4444);      // Vermelho - Emergência (0 min)
  static const Color statusMuitoUrgente = Color(0xFFF97316); // Laranja (10 min)
  static const Color statusUrgente = Color(0xFFFBBF24);      // Amarelo (60 min)
  static const Color statusEstavel = Color(0xFF10B981);      // Verde (120 min)
  static const Color statusPoucoUrgente = Color(0xFF3B82F6);  // Azul (240 min)

  // Cores de Texto
  static const Color textPrimary = Color(0xFFF1F5F9);
  static const Color textSecondary = Color(0xFF94A3B8);
  static const Color textMuted = Color(0xFF64748B);
  static const Color textDark = Color(0xFF06141D);

  // Gradientes
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [Color(0xFF00E599), Color(0xFF059669)],
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
  );

  static const LinearGradient cardGradient = LinearGradient(
    colors: [Color(0xFF0C1B2B), Color(0xFF091624)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient glowingCardGradient = LinearGradient(
    colors: [Color(0xFF0E253A), Color(0xFF0B1B2C)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  // Sombras de Brilho Neon (Glow Shadows)
  static List<BoxShadow> neonGlow({Color color = primary, double opacity = 0.25, double blur = 16}) {
    return [
      BoxShadow(
        color: color.withValues(alpha: opacity),
        blurRadius: blur,
        spreadRadius: 1,
      ),
    ];
  }

  // Decorações de Cartão HUD
  static BoxDecoration hudCardDecoration({
    bool isGlowing = false,
    Color borderColor = borderSubtle,
    double radius = 16,
    Color? customBg,
  }) {
    return BoxDecoration(
      color: customBg ?? (isGlowing ? const Color(0xFF0E2438) : surfaceCard),
      borderRadius: BorderRadius.circular(radius),
      border: Border.all(
        color: isGlowing ? primary : borderColor,
        width: isGlowing ? 1.5 : 1.0,
      ),
      boxShadow: [
        if (isGlowing)
          BoxShadow(
            color: primary.withValues(alpha: 0.25),
            blurRadius: 16,
            spreadRadius: 0,
          )
        else
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.35),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
      ],
    );
  }

  // ThemeData Completo
  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      primaryColor: primary,
      scaffoldBackgroundColor: background,
      colorScheme: const ColorScheme.dark(
        primary: primary,
        secondary: secondary,
        surface: surface,
        error: statusGrave,
        onPrimary: textDark,
        onSurface: textPrimary,
      ),
      fontFamily: 'Roboto',
      appBarTheme: const AppBarTheme(
        backgroundColor: surface,
        elevation: 0,
        centerTitle: true,
        scrolledUnderElevation: 0,
        titleTextStyle: TextStyle(
          color: textPrimary,
          fontSize: 18,
          fontWeight: FontWeight.bold,
          letterSpacing: 1.2,
        ),
        iconTheme: IconThemeData(color: primary),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primary,
          foregroundColor: textDark,
          elevation: 4,
          shadowColor: primary.withValues(alpha: 0.5),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            letterSpacing: 0.8,
          ),
        ),
      ),
      snackBarTheme: SnackBarThemeData(
        backgroundColor: surfaceElevated,
        contentTextStyle: const TextStyle(color: textPrimary, fontWeight: FontWeight.w600),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: const BorderSide(color: borderMedium),
        ),
        behavior: SnackBarBehavior.floating,
      ),
      dialogTheme: DialogTheme(
        backgroundColor: surfaceCard,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: const BorderSide(color: primary, width: 1.5),
        ),
        titleTextStyle: const TextStyle(
          color: textPrimary,
          fontSize: 20,
          fontWeight: FontWeight.bold,
        ),
        contentTextStyle: const TextStyle(
          color: textSecondary,
          fontSize: 15,
        ),
      ),
    );
  }
}

/// Fundo com Grade HUD Tecnológica e Linhas Médicas
class CyberGridBackground extends StatelessWidget {
  final Widget child;
  final bool showHeartbeat;

  const CyberGridBackground({
    super.key,
    required this.child,
    this.showHeartbeat = false,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // Fundo Gradiente Deep Navy
        Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: [
                Color(0xFF040A12),
                Color(0xFF081626),
                Color(0xFF06101E),
              ],
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
            ),
          ),
        ),
        // Pintura da Grade HUD
        Positioned.fill(
          child: CustomPaint(
            painter: _CyberGridPainter(showHeartbeat: showHeartbeat),
          ),
        ),
        // Conteúdo
        child,
      ],
    );
  }
}

class _CyberGridPainter extends CustomPainter {
  final bool showHeartbeat;
  _CyberGridPainter({this.showHeartbeat = false});

  @override
  void paint(Canvas canvas, Size size) {
    final gridPaint = Paint()
      ..color = const Color(0xFF00E599).withValues(alpha: 0.04)
      ..strokeWidth = 1.0;

    const double step = 32.0;

    for (double x = 0; x < size.width; x += step) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), gridPaint);
    }
    for (double y = 0; y < size.height; y += step) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), gridPaint);
    }

    if (showHeartbeat) {
      // Linha de Telemetria de Fundo Suave
      final pulsePaint = Paint()
        ..color = const Color(0xFF00E599).withValues(alpha: 0.08)
        ..strokeWidth = 2.0
        ..style = PaintingStyle.stroke;

      final path = Path();
      final double midY = size.height * 0.45;
      path.moveTo(0, midY);
      path.lineTo(size.width * 0.2, midY);
      path.lineTo(size.width * 0.25, midY - 15);
      path.lineTo(size.width * 0.28, midY + 15);
      path.lineTo(size.width * 0.32, midY - 60);
      path.lineTo(size.width * 0.36, midY + 40);
      path.lineTo(size.width * 0.40, midY - 10);
      path.lineTo(size.width * 0.45, midY);
      path.lineTo(size.width, midY);

      canvas.drawPath(path, pulsePaint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
