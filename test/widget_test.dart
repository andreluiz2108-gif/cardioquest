import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:cardioquest/main.dart';
import 'package:cardioquest/data/casos_clinicos_data.dart';
import 'package:cardioquest/screens/welcome_screen.dart';
import 'package:cardioquest/screens/prontuario_screen.dart';
import 'package:cardioquest/widgets/patient_avatar_widget.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  testWidgets('CardioQuestApp renderiza a tela de boas-vindas inicialmente', (WidgetTester tester) async {
    await tester.pumpWidget(const CardioQuestApp(telaInicial: WelcomeScreen()));

    expect(find.text('CardioQuest'), findsOneWidget);
    expect(find.text('ACESSO AO SISTEMA • IDENTIFICAÇÃO PROFISSIONAL'), findsOneWidget);
    expect(find.text('BATER PONTO & ASSUMIR PLANTÃO'), findsOneWidget);
  });

  testWidgets('PatientAvatarWidget renderiza avatar com badge Manchester do caso', (WidgetTester tester) async {
    final caso = CasosClinicosData.casos.first; // Sr. Carlos Mendes (Vermelho / 0m)

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: Center(
            child: PatientAvatarWidget(
              caso: caso,
              size: 60,
              showManchesterBadge: true,
            ),
          ),
        ),
      ),
    );

    // Deve exibir o badge de tempo de triagem do Manchester (0m para Vermelho)
    expect(find.text('0m'), findsOneWidget);
  });

  testWidgets('Progresso de modulos permanece isolado por paciente', (WidgetTester tester) async {
    SharedPreferences.setMockInitialValues({
      'venceu_caso_1_mod1': true,
    });

    // Abre prontuário de Carlos (caso_1)
    await tester.pumpWidget(
      const MaterialApp(
        home: ProntuarioScreen(casoInicialId: 'caso_1'),
      ),
    );
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 100));

    // Carlos deve ter Módulo 1 Concluído
    expect(find.text('CONCLUÍDO'), findsOneWidget);

    // Abre prontuário de Maria (caso_2) onde mod1 não foi feito
    await tester.pumpWidget(
      const MaterialApp(
        home: ProntuarioScreen(casoInicialId: 'caso_2'),
      ),
    );
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 100));

    // Dona Maria NÃO deve ter Módulo 1 Concluído nem Módulo 2 liberado antecipadamente
    expect(find.text('CONCLUÍDO'), findsNothing);
  });
}
