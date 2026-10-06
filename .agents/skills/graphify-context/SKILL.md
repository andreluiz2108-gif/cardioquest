---
name: graphify-context
description: Consulta ao grafo de conhecimento antes de ler arquivos individualmente para maximizar assertividade e economia de contexto.
---

## Quando Utilizar
- Na fase RESEARCH de qualquer tarefa.
- Para entender dependências entre módulos ou rastrear componentes relacionados.

## Passos
1. Verificar se `graphify-out/graph.json` existe.
2. Executar `graphify query "[contexto da tarefa]"` para obter o subgrafo relevante.
3. Ler apenas os arquivos e nós identificados pelo grafo.
4. Após implementar alterações no código, atualizar o grafo com `graphify . --update`.
