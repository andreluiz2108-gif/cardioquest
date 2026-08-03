# CardioQuest — architecture.md

## Visão Arquitetural
O **CardioQuest** é uma aplicação móvel e web baseada em **React Native**, **Expo Router (v6+)** e **TypeScript (v5.9+)**, estruturada sob os princípios de **Clean Architecture** e **Modular Design**. A camada visual e de navegação utiliza roteamento baseado em arquivos (`app/`), com separação clara de componentes reaproveitáveis, serviços de dados e gerenciamento de estado.

## Containers e Estrutura Principal
- `app/`: Estrutura de rotas do aplicativo via Expo Router (`(tabs)`, `quest/`, `profile/`, `auth/`).
- `assets/`: Recursos estáticos (imagens médicas, ECGs, ícones, fontes).
- `flutter_screens/`: Referências/telas legadas ou protótipos de interface para migração.
- `docs/specs/`: Especificações funcionais, arquiteturais e contratos do ecossistema agêntico.
- `.agents/` / `.claude/`: Configuração de sub-agentes, guardrails, regras e skills do projeto.
- `graphify-out/`: Grafo de conhecimento persistente do codebase (não versionado).

## Padrões Arquiteturais
1. **Separation of Concerns**:
   - **Views / Screens (`app/`)**: Responsáveis exclusivamente pela exibição da UI e captura de ações do usuário.
   - **Custom Hooks / Controllers**: Encapsulam lógica de apresentação e gerenciamento de estado de tela.
   - **Domain / Services**: Contêm a lógica de negócio pura (cálculo de pontuação, verificação de conquista, parsing de ECG).
   - **Data Layer / Storage**: Abstração de persistência local (AsyncStorage / SecureStore) e comunicação HTTP com a API.
2. **DTOs e Validação**:
   - Validação estrita com TypeScript (`strict: true`).
   - Validação em tempo de execução para respostas da API usando schemas Zod ou equivalentes.
3. **Gerenciamento de Estado**:
   - Estado local atômico com React State e Hooks.
   - Persistência assíncrona local para sessão e progresso offline.
4. **Resiliência e Desempenho**:
   - Carregamento sob demanda (lazy loading) e otimização de imagens SVGs / ECGs.
   - Tratamento centralizado de exceções com Error Boundaries.
