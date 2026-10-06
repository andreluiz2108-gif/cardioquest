# Rule: Segurança e Integridade na Lógica de Negócio (Backend/Services)

## Serviços e Lógica Clínica
- Garantir que cálculos de pontuação, verificação de gabarito e cálculo de patentes sejam determinísticos e protegidos contra alterações acidentais de estado.
- Isolar a lógica clínica em classes de serviço ou modelos de domínio testáveis sem dependência do contexto de renderização (`BuildContext`).
- Em caso de comunicação com backend remoto futuro:
  - Definir timeouts curtos em requisições HTTP.
  - Implementar interceptadores de erro e tratamento de falhas de conexão de rede.
