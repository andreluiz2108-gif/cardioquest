# Rule: Segurança da Informação e Dados em Saúde

## Classificação e Proteção de Dados
- Em aplicações de saúde e simulação clínica, garantir total conformidade com a LGPD.
- Nunca utilizar nomes, prontuários, CPFs ou históricos clínicos reais de pacientes em testes ou código.
- Todos os cenários devem utilizar pacientes sintéticos (ex.: "Sr. Carlos Mendes, 62 anos").

## Logs e Depuração
- Não registrar dados sensíveis em logs (`print`, `debugPrint`, `logger`).
- Não expor informações de infraestrutura em telas de erro do usuário final.

## Armazenamento Local
- Dados de crachá e progresso salvos em `SharedPreferences` devem conter apenas identificadores e pontuações do jogo.
- Caso dados confidenciais sejam adicionados futuramente, utilizar `flutter_secure_storage` ou criptografia de chave local.
