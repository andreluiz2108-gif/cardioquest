# CardioQuest — CLAUDE.md

## Idioma de Trabalho
- Responder e documentar obrigatoriamente em Português do Brasil.
- Código, nomes de variáveis e commits seguem o padrão do projeto em inglês técnico.

## Antes de Qualquer Tarefa
1. Leia `docs/specs/main.md`.
2. Leia `docs/specs/architecture.md`.
3. Leia `docs/specs/domain.md`.
4. Leia `docs/specs/security.md`.
5. Leia `docs/specs/quality.md`.
6. Identifique regras aplicáveis em `.agents/rules/` ou `.claude/rules/`.

## Stack do Projeto
- **Frontend / Mobile**: React Native (v0.81+), Expo Router (v6+), TypeScript (v5.9+).
- **Estilização**: React Native Stylesheet / Vanilla CSS.
- **Persistência**: AsyncStorage / SecureStore / SQLite.
- **Testes**: Jest / Vitest / React Native Testing Library.

## Workflow Obrigatório
1. **RESEARCH**: Ler contexto, consultar o Graphify (`graphify-context`) e NÃO editar código nesta etapa.
2. **PLAN**: Criar um plano detalhado especificando arquivos impactados e testes.
3. **IMPLEMENT**: Codificar em pequenos blocos, reutilizando componentes existentes.
4. **VERIFY**: Rodar verificações de tipo (`tsc`), lint e testes.
5. **REVIEW & REPORT**: Executar auditoria de segurança e gerar relatório obrigatório em `docs/tasks/YYYY-MM-DD-[feature].md`.

## Regras Ativas
- @.agents/rules/agent-security.md
- @.agents/rules/dependency-security.md
- @.agents/rules/information-security.md
- @.agents/rules/authentication-security.md
- @.agents/rules/authorization-security.md
- @.agents/rules/input-validation.md
- @.agents/rules/no-injection.md
- @.agents/rules/backend-security.md
- @.agents/rules/frontend-security.md
- @.agents/rules/database-security.md
- @.agents/rules/devops-security.md
- @.agents/rules/clean-code.md
- @.agents/rules/solid.md
- @.agents/rules/reuse.md
- @.agents/rules/task-report.md
- @.agents/rules/react-native-expo.md

## Regras Invioláveis
- Nunca ler, imprimir ou versionar segredos ou arquivos `.env`.
- Nunca remover autenticação ou autorização para resolver bug.
- Nunca concatenar entrada de usuário em SQL, shell ou templates.
- Nunca adicionar dependência sem justificativa explícita.
- Nunca ignorar testes quebrados.

## Graphify (Grafo de Conhecimento)
- Se `graphify-out/graph.json` existir, consulte o grafo antes de ler arquivos individualmente (`/graphify query "[contexto]"`).
- Após mudanças no código, execute `/graphify . --update` para manter o grafo atualizado.
- Para mapear todo o projeto pela primeira vez: `/graphify .`

## Critério de Pronto
- Código compila e passa no `tsc`.
- Testes passam.
- Lint passa.
- Não há segredos expostos.
- Documentação e relatório de task gerados em `docs/tasks/`.
