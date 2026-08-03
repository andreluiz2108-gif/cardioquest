# Rule: Clean Code Universal

## Clareza e Nomenclatura
- Código deve ser legível como prosa em inglês técnico.
- Nomes de variáveis e componentes devem expressar intenção direta.
- Funções devem ter responsabilidade única e tamanho reduzido.

## Erros e Exceções
- Proibido engolir exceções com `try/catch` vazios.
- Tratar erros com retornos explícitos ou exceções tipadas.

## Complexidade e Estruturas de Dados
- Evitar loops aninhados (O(n²)) desnecessários.
- Usar `Map` e `Set` para buscas diretas (O(1)).
