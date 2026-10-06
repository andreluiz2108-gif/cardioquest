# Rule: Autenticação e Identificação de Usuário

## Crachá e Identificação
- Validar preenchimento obrigatório do nome do profissional antes de permitir o acesso ao plantão (`_baterPonto`).
- Sanitizar espaços em branco nas extremidades (`trim()`).

## Sessão e Reset
- A função de "Bater Ponto" e "Reiniciar Jogo" deve limpar adequadamente o estado em memória e garantir que a navegação não deixe telas empilhadas indevidamente (`pushReplacement`).
- Proteger contra estados inconsistentes em caso de reinicialização inesperada do aplicativo.
