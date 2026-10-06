---
name: component-reuse-audit
description: Auditoria de duplicação visual e lógica em widgets Flutter para promoção de componentes reutilizáveis.
---

## Quando Utilizar
- Durante revisões de código ou antes de criar novas telas.

## Passos
1. Buscar elementos repetidos entre telas (ex.: cabeçalhos de paciente, botões de ação principal, cartões de troféu).
2. Extrair o componente comum para um widget independente parametrizado.
3. Substituir as implementações inline pelo novo componente compartilhado.
4. Validar que o comportamento visual e interativo permaneceu idêntico.
