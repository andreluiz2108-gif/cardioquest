# CardioQuest — CLAUDE.md

## Idioma de trabalho
- Responder e documentar preferencialmente em português do Brasil (pt-BR).
- Nomes de classes, variáveis, métodos e commits em padrão consistente (Dart: lowerCamelCase para variáveis/funções, PascalCase para classes).

## Antes de qualquer tarefa
1. Leia `docs/specs/main.md`.
2. Leia `docs/specs/architecture.md`.
3. Leia `docs/specs/domain.md`.
4. Leia `docs/specs/security.md`.
5. Leia `docs/specs/quality.md`.
6. Identifique regras aplicáveis em `.claude/rules/` ou `.agents/rules/`.

## Stack do projeto
- Framework: Flutter / Dart 3+
- Armazenamento: SharedPreferences
- UI / Design: Flutter Material 3 com paleta clínica/gamificada
- Linter & Testes: `analysis_options.yaml`, `flutter test`, `flutter analyze`

## Workflow obrigatório
1. **RESEARCH:** ler contexto e não editar código.
2. **PLAN:** criar plano claro com arquivos impactados.
3. **IMPLEMENT:** codar em blocos pequenos.
4. **VERIFY:** rodar `flutter analyze` e `flutter test`.
5. **REVIEW:** revisar segurança, qualidade e regressão.
6. **REPORT:** gerar relatório em `docs/tasks/YYYY-MM-DD-[feature].md`.

## Regras ativas
- @.claude/rules/agent-security.md
- @.claude/rules/dependency-security.md
- @.claude/rules/information-security.md
- @.claude/rules/authentication-security.md
- @.claude/rules/authorization-security.md
- @.claude/rules/input-validation.md
- @.claude/rules/no-injection.md
- @.claude/rules/backend-security.md
- @.claude/rules/frontend-security.md
- @.claude/rules/database-security.md
- @.claude/rules/devops-security.md
- @.claude/rules/clean-code.md
- @.claude/rules/solid.md
- @.claude/rules/reuse.md
- @.claude/rules/task-report.md
- @.claude/rules/data-structures.md

## Graphify (grafo de conhecimento)
- Se `graphify-out/graph.json` existir, consulte o grafo antes de ler arquivos individualmente.
- Após mudanças no código, execute `graphify . --update` para manter o grafo atualizado.
- Para mapear todo o projeto pela primeira vez: `graphify .`

## Critério de pronto
- Código compila sem erros (`flutter build` ou `flutter analyze`).
- Testes passam (`flutter test`).
- Não há warnings graves no linter.
- Não há segredo ou dado pessoal real exposto.
- Não há regressão no fluxo dos 6 módulos clínicos.
- Documentação e relatório de task atualizados.
