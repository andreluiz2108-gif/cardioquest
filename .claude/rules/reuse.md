# Rule: Reaproveitamento de Componentes e Widgets

## Quando Reaproveitar
- Reaproveitar quando houver repetição de layout ou comportamento em 2 ou mais telas (ex.: cards de módulo, botões de ação clínica, diálogos de feedback, cabeçalhos de prontuário).
- Extrair componentes para uma pasta `lib/widgets/` ou `lib/components/`.

## Parâmetros e Props
- Componentes reutilizáveis devem receber propriedades explícitas (`title`, `onPressed`, `isSelected`, `color`) e não depender de variáveis globais ou estado escondido.
