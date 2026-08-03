---
name: graphify-context
description: Use para obter contexto preciso do codebase com custo mínimo de tokens. Consulta o grafo de conhecimento antes de ler arquivos individualmente.
---

## Quando usar
- Início de qualquer sessão de trabalho agêntico.
- Fase RESEARCH antes de implementar qualquer funcionalidade.
- Análise de impacto de mudanças no codebase.

## Passos
1. Verificar se `graphify-out/graph.json` existe. Se não existir, executar `/graphify .` ou a extração do grafo.
2. Usar consultas de busca no grafo para mapear nós vizinhos e dependências antes de carregar arquivos inteiros no contexto.
3. Ler exclusivamente os arquivos filtrados pelo grafo.

## Após implementação
Atualizar o grafo executando `graphify . --update`.
