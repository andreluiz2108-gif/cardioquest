# Rule: Segurança e Resiliência na Camada de Apresentação (Frontend)

## Widgets e Renderização
- Proteger contra referências nulas e dados ausentes usando operadores null-aware do Dart (`?.`, `??`).
- Não renderizar widgets sem verificar se o estado da tela ainda está ativo (`mounted`) após conclusões assíncronas.
- Prevenir vazamento de memória cancelando `TextEditingController`, `AnimationController` e `StreamSubscription` no método `dispose()`.

## Estados de Tela
- Nunca confiar apenas na desabilitação de botões na UI: validar os pré-requisitos antes de salvar ou disparar transições de módulo.
