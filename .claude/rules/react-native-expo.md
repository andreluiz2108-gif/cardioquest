# Rule: React Native + Expo Router + TypeScript

## React Native / Expo Router
- Usar navegação declarativa baseada em arquivos dentro de `app/`.
- Proibido componentes massivos (>250 linhas); extrair sub-componentes apresentacionais.
- Usar `SafeAreaView` e tratar insets para compatibilidade iOS/Android.
- Utilizar `lucide-react-native` ou ícones vetoriais padronizados.

## TypeScript
- Proibido `any`. Usar `unknown` com asserção de tipo ou type guards.
- Usar interfaces explícitas para Props de componentes.
