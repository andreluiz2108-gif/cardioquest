# CardioQuest — main.md

## Visão
O **CardioQuest** é uma plataforma educacional e gamificada focada no ensino e prática da cardiologia para estudantes e profissionais da área da saúde (UNICAMP). O aplicativo combina aprendizado teórico, simulação de casos clínicos, quizzes dinâmicos e rastreamento de progresso individualizado.

## Problema
O estudo da cardiologia demanda retenção de conceitos complexos (como eletrocardiogramas, farmacologia cardiovascular, diagnósticos diferenciais e condutas de emergência). A memorização tradicional por apostilas costuma ser passiva. O CardioQuest resolve essa dor transformando o aprendizado em um fluxo interativo, com desafios pontuados, feedback imediato e trilhas de conhecimento.

## Usuários Principais
- **Estudantes de Medicina / Enfermagem / Saúde (UNICAMP)**: Realizam missões, respondem quizzes e acompanham seu nível de proficiência.
- **Professores / Preceptores**: Visualizam estatísticas de turmas e organizam os módulos clínicos.
- **Residentes e Médicos**: Utilizam a ferramenta para reciclagem rápida e consulta de casos clínicos guiados.

## Métricas de Sucesso
- **Disponibilidade**: 99.9% para a API e aplicativo móvel.
- **Tempo de Resposta P95**: < 300 ms nas APIs de quiz e progresso.
- **Cobertura Mínima de Testes**: 80% nos serviços de domínio e utilitários.
- **Engajamento**: Retenção diária (DAU) e taxa de conclusão de missões > 75%.

## Escopo Inicial
1. **Trilhas de Aprendizado Agrupadas**: Módulos de Anatomia, Fisiologia, Arritmias, Insuficiência Cardíaca, DAC e Emergências.
2. **Modo Quest / Quiz Interativo**: Perguntas com tempo limitado, imagens médicas (ex: ECGs), explicações detalhadas e pontuação.
3. **Perfil e Rastreamento de Nível**: Sistema de experiência (XP), conquistas (badges), estatísticas de acerto por tema.
4. **Navegação Fluida Mobile (Expo Router / React Native)**: Interface nativa responsiva e adaptada para dispositivos móveis e web.

## Não-Escopo Inicial
- Diagnóstico médico em tempo real de pacientes reais.
- Integração direta com prontuários eletrônicos hospitalares (PEP/HIS).
- Prescrição computadorizada.

## Restrições
- **LGPD / Privacidade**: Nenhum dado real de paciente é utilizado nos casos clínicos simulados.
- **Segurança da Informação**: Dados de usuários criptografados em trânsito (HTTPS/TLS) e tokens seguros (SecureStore).
- **Acessibilidade**: Suporte a leitores de tela, alto contraste e tamanhos de fonte dinâmicos (a11y).
- **Performance**: Execução nativa offline-first para sincronização tardia de progresso quando necessário.
