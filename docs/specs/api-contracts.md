# CardioQuest — api-contracts.md

## Contratos de Dados e Persistência Local (SharedPreferences)

| Chave | Tipo | Descrição | Exemplo de Valor |
|---|---|---|---|
| `nomeEnfermeiro` | `String` | Nome do profissional no crachá | `"Mariana Souza"` |
| `avatarEnfermeiro` | `String` | Emoji/Avatar selecionado | `"👩‍⚕️"` |
| `xpEnfermeiro` | `int` | Quantidade total de XP acumulado | `650` |
| `venceu_mod1` | `bool` | Módulo 1 (Triagem) concluído | `true` |
| `venceu_mod2` | `bool` | Módulo 2 (Anamnese) concluído | `true` |
| `venceu_mod3` | `bool` | Módulo 3 (ECG) concluído | `true` |
| `venceu_mod4` | `bool` | Módulo 4 (Protocolo) concluído | `true` |
| `venceu_mod5` | `bool` | Módulo 5 (Enzimas) concluído | `true` |
| `venceu_mod6` | `bool` | Módulo 6 (Alta) concluído | `true` |

## Futuras Integrações com API Externa
Caso o sistema venha a sincronizar pontuações com um backend:
- `POST /api/v1/sessions/sync`
  - **Payload:** `{ "nurseName": string, "xp": int, "completedModules": number[] }`
  - **Response 200:** `{ "status": "synced", "leaderboardRank": int }`
