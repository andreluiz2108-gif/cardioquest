---
name: secure-feature-implementation
description: Workflow rigoroso RPI (Research -> Plan -> Implement -> Verify -> Review) para implementação segura de novas funcionalidades no CardioQuest.
---

## Fluxo Obrigatório
1. **RESEARCH**: Ler especificações em `docs/specs/`, regras de segurança e consultar o subgrafo via Graphify. Não editar arquivos.
2. **PLAN**: Escrever um plano de implementação especificando arquivos a alterar, novos componentes e checklist de segurança.
3. **IMPLEMENT**: Codificar em incrementos curtos, reutilizando utilitários de `components/` ou `packages/`.
4. **VERIFY**: Executar verificações de tipos, testes e lint.
5. **REVIEW & REPORT**: Passar por revisão de segurança e gerar relatório em `docs/tasks/`.
