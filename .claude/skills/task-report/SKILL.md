---
name: task-report
description: Gera o documento de relatório obrigatório ao fim de cada task. Registra tokens com/sem Graphify, assertividade do grafo, arquivos alterados, testes e riscos.
---

## Quando invocar
Ao concluir qualquer tarefa ou feature — antes de finalizar a sessão.

## Passos
1. Coletar estatísticas da task (nós consultados no Graphify vs arquivos efetivamente editados).
2. Estimar consumo de tokens com Graphify vs leitura ingênua do repositório completo.
3. Criar arquivo `docs/tasks/YYYY-MM-DD-[feature].md` contendo:
   - Resumo das mudanças
   - Tabela de arquivos afetados
   - Métrica comparativa de tokens e taxa de redução (ex: 5.2x)
   - Resultados da suíte de testes (Jest / tsc / lint)
   - Avaliação de riscos remanescentes
