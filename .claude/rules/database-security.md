# Rule: Segurança e Integridade da Persistência de Dados

## Gerenciamento de SharedPreferences e Storage Local
- Centralizar chaves de preferências em constantes bem definidas para evitar erros de digitação (ex.: `AppKeys.nomeEnfermeiro`).
- Validar tipos ao recuperar dados (`getInt`, `getString`, `getBool`) fornecendo valores padrão seguros (`?? 0`, `?? ''`, `?? false`).
- Operações de escrita devem ser tratadas assincronamente com `await` para assegurar que a gravação no disco ocorra antes de trocar de tela.
