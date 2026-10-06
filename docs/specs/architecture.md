# CardioQuest — architecture.md

## Visão Arquitetural
A aplicação é construída em **Flutter / Dart** adotando padrões modulares e responsabilidade única na organização de telas, modelos e persistência.

## Estrutura de Diretórios
```txt
CardioQuest/
├── lib/
│   ├── main.dart                  # Ponto de entrada, leitura de preferências e rota inicial
│   ├── screens/                   # Telas dos fluxos clínicos e dashboard
│   │   ├── welcome_screen.dart    # Identificação profissional / crachá
│   │   ├── dashboard_screen.dart  # Painel principal de XP e progressão
│   │   ├── prontuario_screen.dart # Hub do caso clínico e cadeados de módulos
│   │   ├── triagem_screen.dart    # Módulo 1 (Classificação de Manchester)
│   │   ├── anamnese_screen.dart   # Módulo 2 (Histórico clínico)
│   │   ├── ecg_screen.dart        # Módulo 3 (Eletrocardiograma)
│   │   ├── protocolo_screen.dart  # Módulo 4 (Protocolo MONA)
│   │   ├── enzimas_screen.dart    # Módulo 5 (Troponina / CK-MB)
│   │   ├── alta_screen.dart       # Módulo 6 (Desfecho / Encaminhamento)
│   │   └── trofeus_screen.dart    # Conquistas e medalhas
│   ├── models/                    # (Recomendado) Modelos de domínio clínico
│   ├── services/                  # (Recomendado) Serviços de persistência e cálculo de XP
│   └── widgets/                   # (Recomendado) Componentes visuais compartilhados
├── test/                          # Testes unitários e de widgets
├── docs/                          # Documentação e especificações
└── .claude/ / .agents/            # Agentes, regras e skills
```

## Padrões Técnicos
- **Material 3:** Tematização consistente utilizando azul cardiológico (`#1E3A8A`) e fundo neutro (`#F8FAFC`).
- **Persistência Assíncrona:** Operações com `SharedPreferences` sempre assíncronas com tratamento de nulidade.
- **Transição Segura de Telas:** Uso de `pushReplacement` ao bater ponto e resetar sessão para evitar histórico inconsistente.
