# Task Report: Reestruturação para 3 Níveis de Dificuldade e Remoção de Prefixos de Tratamento

**Data:** 2026-10-14  
**Responsável:** Antigravity / DeepMind Pair Programming Assistant  
**Projeto:** CardioQuest (Flutter / Dart)  

---

## 1. Resumo da Tarefa
Nesta intervenção, foram realizadas duas grandes reformulações solicitadas para o CardioQuest:
1. **Remoção de Prefixos de Tratamento ("Dona, Senhor, Sr., Sra."):**
   - Todos os prefixos informais/honoríficos foram totalmente eliminados dos modelos de dados, questionários, cabeçalhos HUD e descrições de troféus, mantendo exclusivamente o nome dos pacientes: `Carlos Mendes`, `Maria da Graça` e `Helena Souza`.
2. **Implementação de 3 Níveis de Dificuldade com Desbloqueio Progressivo:**
   - O aplicativo agora opera com uma escada pedagógica de 3 leitos de complexidade crescente:
     - **Nível 1 (Fácil):** Carlos Mendes (IAMCSST de parede anterior, dor típica 9/10, MONA, hemodinâmica) — Liberado por padrão.
     - **Nível 2 (Médio):** Maria da Graça (IAMSSST / Equivalente Isquêmico em mulher diabética) — Desbloqueado ao concluir todos os 6 módulos de Carlos Mendes.
     - **Nível 3 (Difícil):** Helena Souza (Edema Agudo de Pulmão e Choque pós-infarto com hipoxemia grave e VNI) — Desbloqueado ao concluir todos os 6 módulos de Maria da Graça.
   - Foram implementadas travas visuais no [dashboard_screen.dart](file:///c:/Users/alaol/StudioProjects/CardioQuest/lib/screens/dashboard_screen.dart) e no [prontuario_screen.dart](file:///c:/Users/alaol/StudioProjects/CardioQuest/lib/screens/prontuario_screen.dart) que impedem o acesso a leitos bloqueados, exibindo mensagens educativas e orientando a conclusão do nível anterior.
   - Ao concluir o Módulo 6 de cada nível na [alta_screen.dart](file:///c:/Users/alaol/StudioProjects/CardioQuest/lib/screens/alta_screen.dart), o diálogo de vitória notifica explicitamente a liberação do próximo nível desafiador.

---

## 2. Arquivos Alterados / Criados

| Arquivo | Operação | Descrição |
| :--- | :---: | :--- |
| [caso_clinico.dart](file:///c:/Users/alaol/StudioProjects/CardioQuest/lib/models/caso_clinico.dart) | Modificado | Adicionados campos `dificuldade` ('FÁCIL', 'MÉDIO', 'DIFÍCIL') e `nivel` (1, 2, 3). |
| [casos_clinicos_data.dart](file:///c:/Users/alaol/StudioProjects/CardioQuest/lib/data/casos_clinicos_data.dart) | Modificado | Restrito para 3 casos clínicos sem prefixos e adicionados helpers estáticos `isCasoDesbloqueado()`, `obterMensagemBloqueio()` e `isModuloConcluido()` com retrocompatibilidade (`db-migration-safe`). |
| [questionarios_data.dart](file:///c:/Users/alaol/StudioProjects/CardioQuest/lib/data/questionarios_data.dart) | Modificado | Remoção de prefixos em todas as etapas clínicas dos módulos 1 a 6 e consolidação das perguntas para os 3 casos. |
| [dashboard_screen.dart](file:///c:/Users/alaol/StudioProjects/CardioQuest/lib/screens/dashboard_screen.dart) | Modificado | Exibição de badges de dificuldade (`NÍVEL X • DIFICULDADE`), bloqueio visual com ícone de cadeado e aviso via SnackBar para leitos trancados. |
| [prontuario_screen.dart](file:///c:/Users/alaol/StudioProjects/CardioQuest/lib/screens/prontuario_screen.dart) | Modificado | Abas de filtro reorganizadas por nível (`Todos (3)`, `Fácil`, `Médio`, `Difícil`), seletor horizontal com status de bloqueio, badge de nível no HUD ativo e ajuste de título de protocolo farmacológico. |
| [alta_screen.dart](file:///c:/Users/alaol/StudioProjects/CardioQuest/lib/screens/alta_screen.dart) | Modificado | Mensagem dinâmica no diálogo de encerramento comunicando o desbloqueio do próximo nível de dificuldade. |
| [trofeus_screen.dart](file:///c:/Users/alaol/StudioProjects/CardioQuest/lib/screens/trofeus_screen.dart) | Modificado | Remoção de prefixos ("Dona") e ajuste de conquistas para refletir os 3 níveis progressivos. |
| [domain.md](file:///c:/Users/alaol/StudioProjects/CardioQuest/docs/specs/domain.md) | Modificado | Documentação atualizada da especificação de domínio clínico com os 3 níveis de dificuldade e pacientes. |
| [widget_test.dart](file:///c:/Users/alaol/StudioProjects/CardioQuest/test/widget_test.dart) | Modificado | Testes unitários e de integração cobrindo os 3 casos, integridade das perguntas, isolamento de progresso e regras de desbloqueio sequencial. |

---

## 3. Métricas de Contexto & Assertividade
- **Conformidade com Regras:** Seguidas estritamente as regras de `AGENTS.md`, `db-migration-safe` e `quality.md`.
- **Prevenção de Regressão:** Mantida retrocompatibilidade para dados legados de persistência (`venceu_caso_4_modX` mapeado com fallback transparente para `caso_3`).
- **Eliminação Total de Prefixos:** Verificado via busca global por regex/texto (`Sr.`, `Dona `, `Senhor `, `Sra.`), obtendo 0 ocorrências em todo o código-fonte da aplicação (`lib/`).

---

## 4. Testes e Validações
- **`flutter test`:**
  - `CardioQuestApp renderiza a tela de boas-vindas com os 6 avatares (3 homens / 3 mulheres)`: **Passou**
  - `PatientAvatarWidget renderiza avatar com badge Manchester do caso`: **Passou**
  - `Progresso de modulos permanece isolado por paciente`: **Passou**
  - `Validação dos 3 Níveis de Dificuldade e Desbloqueio Progressivo Configuração dos 3 casos com níveis e sem prefixos de tratamento`: **Passou**
  - `Validação dos 3 Níveis de Dificuldade e Desbloqueio Progressivo Regra de desbloqueio sequencial dos 3 níveis de dificuldade`: **Passou**
  - `Validação dos 3 Níveis de Dificuldade e Desbloqueio Progressivo Todos os 3 pacientes possuem 5 perguntas nos modulos 1, 2, 3 e 5, e 6 itens no modulo 6`: **Passou**
  - Resultado: **100% dos testes aprovados (6/6)**.
- **`flutter analyze`:**
  - Resultado: **No issues found! (0 erros, 0 warnings, 0 lints pendentes)**.

---

## 5. Riscos Remanescentes e Recomendações
- **Experiência do Usuário:** O fluxo de bloqueio progressivo incentiva a jornada pedagógica completa (Fácil -> Médio -> Difícil).
- **Próximos Passos Sugeridos:**
  - Adicionar pequenas animações luminosas ao momento de desbloqueio na transição entre o prontuário e o dashboard.
