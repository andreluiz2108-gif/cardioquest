// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter_test/flutter_test.dart';

import 'package:cardioquest/main.dart';
import 'package:cardioquest/screens/welcome_screen.dart';

void main() {
  testWidgets('CardioQuestApp renderiza a tela de boas-vindas inicialmente', (WidgetTester tester) async {
    await tester.pumpWidget(const CardioQuestApp(telaInicial: WelcomeScreen()));

    expect(find.text('CardioQuest'), findsOneWidget);
    expect(find.text('ACESSO AO SISTEMA • IDENTIFICAÇÃO PROFISSIONAL'), findsOneWidget);
    expect(find.text('BATER PONTO & ASSUMIR PLANTÃO'), findsOneWidget);
  });
}
