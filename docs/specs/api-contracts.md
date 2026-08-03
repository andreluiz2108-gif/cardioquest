# CardioQuest — api-contracts.md

## Padrão dos Contratos de API RESTful

### 1. Obter Quests por Categoria
`GET /api/v1/quests?categoria={categoria}`
- **Autenticação**: Requerida (Bearer JWT)
- **Response 200 OK**:
```json
{
  "quests": [
    {
      "id": "q-101",
      "titulo": "Arritmias Supraventriculares",
      "categoria": "ECG",
      "dificuldade": "Intermediario",
      "totalPerguntas": 5
    }
  ]
}
```

### 2. Submeter Resposta da Quest
`POST /api/v1/quests/{id}/submit`
- **Autenticação**: Requerida (Bearer JWT)
- **Request Body**:
```json
{
  "respostas": [
    { "perguntaId": "p-1", "opcaoId": "op-b", "tempoSegundos": 12 }
  ]
}
```
- **Response 200 OK**:
```json
{
  "acertos": 1,
  "total": 1,
  "xpGanha": 50,
  "novoXpTotal": 1250,
  "conquistaDesbloqueada": null
}
```

### 3. Códigos de Erro Padronizados
- `400 Bad Request`: Payload fora do schema.
- `401 Unauthorized`: Token expirado ou ausente.
- `403 Forbidden`: Permissão insuficiente.
- `429 Too Many Requests`: Rate limit excedido.
