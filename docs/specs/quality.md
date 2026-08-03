# CardioQuest — quality.md

## Padrões de Qualidade e Código
- **TypeScript Strict Mode**: Configuração `"strict": true` no `tsconfig.json`. Proibido o uso de `any` implícito ou explícito sem justificativa formal.
- **Clean Code & SOLID**: Componentes de UI desacoplados de regras de negócio; uso de hooks customizados para abstração de lógica.
- **Complexidade de Estruturas de Dados**: Para coleções em memória, buscas rápidas usam `Map` ou `Set` (O(1)) em vez de varreduras lineares em arrays (O(n)).

## Estratégia de Testes
- **Testes Unitários**: Jest / Vitest para serviços de domínio, hooks e utilitários.
- **Testes de Componentes**: React Native Testing Library para validação visual e comportamental de telas e botões.
- **Lint e Formatação**: ESLint + Prettier configurados com regras estritas.

## Cobertura Mínima Exigida
- Módulos de Cálculo de XP/Streak: 100% de cobertura.
- Services e Parsers de Quiz: ≥ 85% de cobertura.
- Componentes Reutilizáveis de UI: ≥ 70% de cobertura.
