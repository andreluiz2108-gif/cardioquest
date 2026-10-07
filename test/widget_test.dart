import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:cardioquest/main.dart';
import 'package:cardioquest/data/casos_clinicos_data.dart';
import 'package:cardioquest/data/questionarios_data.dart';
import 'package:cardioquest/screens/welcome_screen.dart';
import 'package:cardioquest/screens/prontuario_screen.dart';
import 'package:cardioquest/widgets/patient_avatar_widget.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  testWidgets('CardioQuestApp renderiza a tela de boas-vindas com os 6 avatares (3 homens / 3 mulheres)', (WidgetTester tester) async {
    await tester.pumpWidget(const CardioQuestApp(telaInicial: WelcomeScreen()));

    expect(find.text('CardioQuest'), findsOneWidget);
    expect(find.text('ACESSO AO SISTEMA • IDENTIFICAÇÃO PROFISSIONAL'), findsOneWidget);
    expect(find.text('SELECIONE SEU AVATAR (3 ENFERMEIROS / 3 ENFERMEIRAS)'), findsOneWidget);
    expect(find.text('BATER PONTO & ASSUMIR PLANTÃO'), findsOneWidget);

    // Deve haver 6 avatares clicáveis na tela inicial
    expect(find.byType(GestureDetector), findsAtLeastNWidgets(6));
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

  group('Validação do Banco Expandido de Questões e Casos Clínicos', () {
    test('Todos os 4 pacientes possuem 5 perguntas nos modulos 1, 2, 3 e 5, e 6 itens no modulo 6', () {
      expect(CasosClinicosData.casos.length, equals(4));

      for (final caso in CasosClinicosData.casos) {
        // Módulo 1: Triagem (5 perguntas por caso)
        final triagem = QuestionariosData.obterPerguntasTriagem(caso);
        expect(triagem.length, equals(5), reason: 'Triagem deve ter 5 perguntas para ${caso.nome}');
        for (final p in triagem) {
          final correta = p['correta'] as int;
          final opcoes = p['opcoes'] as List;
          expect(correta >= 0 && correta < opcoes.length, isTrue, reason: 'Índice de resposta de triagem válido em ${caso.nome}');
        }

        // Módulo 2: Anamnese (5 perguntas por caso)
        final anamnese = QuestionariosData.obterPerguntasAnamnese(caso);
        expect(anamnese.length, equals(5), reason: 'Anamnese deve ter 5 perguntas para ${caso.nome}');
        for (final p in anamnese) {
          final correta = p['correta'] as int;
          final opcoes = p['opcoes'] as List;
          expect(correta >= 0 && correta < opcoes.length, isTrue, reason: 'Índice de resposta de anamnese válido em ${caso.nome}');
        }

        // Módulo 3: ECG (5 perguntas por caso)
        final ecg = QuestionariosData.obterPerguntasEcg(caso);
        expect(ecg.length, equals(5), reason: 'ECG deve ter 5 perguntas para ${caso.nome}');
        for (final p in ecg) {
          final correta = p['correta'] as int;
          final opcoes = p['opcoes'] as List;
          expect(correta >= 0 && correta < opcoes.length, isTrue, reason: 'Índice de resposta de ECG válido em ${caso.nome}');
          expect(p['tipoTracado'], isNotNull);
          expect(p['alerta'], isNotNull);
        }

        // Módulo 4: Protocolo Farmacológico (4 corretos de 8)
        final farmaco = QuestionariosData.obterProtocoloFarmacologico(caso);
        final meds = farmaco['medicamentos'] as List<String>;
        final gabarito = farmaco['gabarito'] as List<String>;
        expect(meds.length, equals(8));
        expect(gabarito.length, equals(4));
        for (final g in gabarito) {
          expect(meds.contains(g), isTrue, reason: 'Gabarito deve estar presente na lista de medicamentos para ${caso.nome}');
        }

        // Módulo 5: Enzimas (5 perguntas por caso)
        final enzimas = QuestionariosData.obterPerguntasEnzimas(caso);
        expect(enzimas.length, equals(5), reason: 'Enzimas deve ter 5 perguntas para ${caso.nome}');
        for (final p in enzimas) {
          final correta = p['correta'] as int;
          final opcoes = p['opcoes'] as List;
          expect(correta >= 0 && correta < opcoes.length, isTrue, reason: 'Índice de resposta de enzimas válido em ${caso.nome}');
        }

        // Módulo 6: Alta e Desfecho (6 orientações por caso)
        final alta = QuestionariosData.obterPerguntasAlta(caso);
        expect(alta.length, equals(6), reason: 'Alta deve ter 6 orientações para ${caso.nome}');
        for (final item in alta) {
          expect(item['texto'], isNotEmpty);
          expect(item['bom'], isA<bool>());
        }
      }
    });
  });
}
