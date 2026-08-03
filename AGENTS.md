# CardioQuest — AGENTS.md

## Regras Globais da Workspace Agêntica

1. **Princípio do Menor Privilégio**: Todos os sub-agentes atuarão sob escopo estrito de ferramentas e permissões mínimas.
2. **Contexto Especificado**: Nenhuma funcionalidade deve ser codificada sem antes revisar `docs/specs/main.md`, `docs/specs/architecture.md` e `docs/specs/domain.md`.
3. **Workflow RPI**: Respeitar as fases de **Research -> Plan -> Implement -> Verify -> Review**.
4. **Relatório Obrigatório**: Toda tarefa concluída exige a geração de um relatório de task em `docs/tasks/YYYY-MM-DD-[feature].md`.
5. **Grafo de Conhecimento**: Sempre consultar `graphify-out/graph.json` para economizar tokens em sessões de pesquisa e manter o grafo atualizado com `graphify . --update`.
