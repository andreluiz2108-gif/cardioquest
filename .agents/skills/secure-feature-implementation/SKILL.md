---
name: secure-feature-implementation
description: Workflow para implementar novas funcionalidades garantindo validação de entrada, segurança da informação, aderência aos padrões de domínio e testes.
---

## Quando Utilizar
- Ao implementar uma nova funcionalidade, nova tela clínica ou fluxo de jogo no CardioQuest.

## Passos Obrigatórios
1. **Specs & Domain:** Ler `docs/specs/main.md`, `architecture.md` e `domain.md`.
2. **Design de Dados:** Definir os modelos, parâmetros de entrada e tipos de dados.
3. **Implementação de Negócio:** Criar a lógica clínica/pontuação isolada de widgets de UI.
4. **Implementação Visual:** Criar a tela e widgets com tratamento de erros, validação e responsividade.
5. **Testes:** Criar testes unitários e de widget cobrindo cenários válidos e inválidos.
6. **Revisão:** Executar `flutter analyze` e `flutter test`.
7. **Documentação:** Atualizar `docs/specs/` se o domínio ou contratos mudaram e gerar o Task Report.
