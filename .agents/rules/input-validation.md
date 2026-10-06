# Rule: Validação e Sanitização de Entradas

## Entradas do Usuário
- Validar tipo, limite de caracteres e formato em campos de texto (`TextField`, `TextFormField`).
- Sanitizar strings de entrada contra caracteres de controle inválidos.
- Prover feedback visual amigável e acessível caso a entrada não atenda aos critérios exigidos.

## Seleção de Múltipla Escolha e Protocolos
- Validar se o número de opções selecionadas respeita os limites do protocolo clínico (ex.: limite estrito de 4 intervenções no protocolo MONA).
- Impedir que o usuário avance ou submeta estados intermediários corrompidos.
