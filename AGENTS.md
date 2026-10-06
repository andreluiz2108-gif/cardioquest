# CardioQuest — AGENTS.md

## Visão Geral e Idioma
- Projeto: **CardioQuest** (Simulação Clínica Gamificada em Flutter / Dart para Enfermagem em Cardiologia).
- Idioma principal de trabalho e documentação: **Português do Brasil (pt-BR)**.
- Padrão metodológico: **Spec-Driven Development (SDD) + Research-Plan-Implement (RPI)**.

## Antes de qualquer tarefa
1. Leia `docs/specs/main.md` (visão geral, regras de negócio e objetivos).
2. Leia `docs/specs/architecture.md` (arquitetura do app Flutter e padrões).
3. Leia `docs/specs/domain.md` (domínio clínico: IAM, Manchester, MONA, ECG, Enzimas).
4. Leia `docs/specs/security.md` (segurança, armazenamento local, dados sensíveis).
5. Leia `docs/specs/quality.md` (clean code, testes, widgets e manutenibilidade).
6. Consulte as regras ativas em `.agents/rules/` (ou `.claude/rules/`).

## Stack Tecnológica
- **Framework:** Flutter 3.x (Dart 3.x)
- **Plataformas:** Android, iOS, Web, Windows, macOS, Linux
- **Persistência Local:** `shared_preferences`
- **State Management & UI:** StatefulWidget / Clean Widget Composition / Material 3
- **Testes & Análise:** `flutter test`, `flutter analyze`

## Workflow Obrigatório
1. **RESEARCH:** Ler contexto, analisar arquivos afetados e identificar riscos. Não editar código.
2. **PLAN:** Criar plano detalhado com arquivos a criar/alterar, contratos e estratégia de testes.
3. **IMPLEMENT:** Codificar em blocos pequenos, modulares e reutilizáveis.
4. **VERIFY:** Executar `flutter analyze` e `flutter test`.
5. **REVIEW:** Revisar segurança, qualidade de código, responsividade e regressão.
6. **REPORT:** Gerar relatório em `docs/tasks/YYYY-MM-DD-[feature].md`.

## Regras Invioláveis
- Nunca quebrar o fluxo pedagógico dos 6 módulos clínicos sem documentação explícita.
- Nunca persistir dados médicos de pacientes reais ou segredos em código/logs.
- Nunca silenciar erros com blocos `try/catch` vazios.
- Manter widgets enxutos, desacoplando regras de pontuação/XP e estado.
- Sempre rodar `flutter analyze` antes de finalizar entregas.
