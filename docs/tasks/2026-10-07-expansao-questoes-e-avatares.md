# Task Report: Expansão do Banco de Questões por Paciente e Seleção de Avatares (3 Homens / 3 Mulheres)

**Data:** 2026-10-07  
**Responsável:** Antigravity AI  
**Projeto:** CardioQuest (Flutter / Dart)  

---

## 1. Resumo das Entregas

### 1.1 Expansão do Banco de Questões para Todos os 4 Pacientes
Expandimos e aprofundamos substancialmente o repositório de simulações clínicas [questionarios_data.dart](file:///c:/Users/alaol/StudioProjects/CardioQuest/lib/data/questionarios_data.dart):
- **Módulo 1 (Triagem - Manchester):** Expandido de 3 para **5 perguntas clínicas detalhadas por paciente** (total de 20 questões).
- **Módulo 2 (Anamnese Direcionada):** Expandido de 3 para **5 perguntas estruturadas por paciente** (total de 20 questões).
- **Módulo 3 (Eletrocardiograma - ECG):** Expandido de 3 para **5 perguntas com morfologias, traçados e alertas neon específicos por paciente** (total de 20 questões).
- **Módulo 4 (Protocolo Farmacológico):** 8 alternativas balanceadas com 4 escolhas prioritárias e justificativas clínicas completas por patologia.
- **Módulo 5 (Enzimas e Biomarcadores):** Expandido de 3 para **5 perguntas especializadas sobre cinética, delta enzimático e marcadores por paciente** (total de 20 questões).
- **Módulo 6 (Alta, Desfecho e Educação em Saúde):** Expandido de 4 para **6 orientações de autocuidado e prevenção secundária por paciente** (total de 24 orientações).

#### Cobertura dos 4 Casos Clínicos:
1. **Sr. Carlos Mendes (Leito 02 - IAMCSST Parede Anterior V1-V4):**
   - Triagem Vermelho (0m), Tempo Porta-ECG < 10m, Sinais de choque cardiogênico, Código IAM e Tempo Porta-Balão < 90m.
   - Anamnese: dor retroesternal em aperto 9/10, fatores de risco (HAS, DM, tabagismo), rastreio de inibidores de PDE-5 (sildenafil) para nitrato.
   - ECG: calibração, FV/ritmo chocável, supra anterior extenso, imagens em espelho recíprocas (DIII/aVF), derivações direitas/posteriores (V3R/V4R/V7/V8).
   - MONA completo, cinética de Troponina, CK-MB para reinfarto e desfecho pós-angioplastia.
2. **Dona Maria da Graça (Leito 06 - IAMSSST / Equivalente Isquêmico em Diabética):**
   - Triagem Laranja (10m), neuropatia autonômica, sintomas atípicos (epigastralgia, náuseas, fadiga em mulheres).
   - Anamnese: segurança no uso de Metformina pré-contraste iodado, risco na pós-menopausa, sintomas prodrômicos.
   - ECG: inversão simétrica de onda T em V5-V6, ECG serial a cada 3-6h, telemetria contínua.
   - Dupla antiagregação + anticoagulação (Enoxaparina), curva seriada de Troponina (delta 0h/3h), escores GRACE/TIMI.
3. **Lucas Almeida (Leito 09 - Miopericardite Aguda pós-viral):**
   - Triagem Laranja (10m), dor em pontada postural e ventilatório-dependente, atrito pericárdico, descarte de Tríade de Beck.
   - Anamnese: histórico gripal prévio, consumo de energéticos e estimulantes, sintomas sistêmicos.
   - ECG: supra côncavo difuso em múltiplas paredes, infra de segmento PR em DII/V5/V6, estágios de Spodick.
   - Anti-inflamatório (Ibuprofeno) + Colchicina, PCR e VHS para desmame, ecocardiograma complementar.
4. **Dona Helena Souza (Leito 12 - Edema Agudo de Pulmão Hipertensivo):**
   - Triagem Vermelho (0m), cabeceira 90°, CPAP/VNI com PEEP, restrição hídrica absoluta na fase aguda.
   - Anamnese: dispneia paroxística noturna, ortopneia, uso prévio de AINEs causando retenção de sódio, evento isquêmico disparador.
   - ECG: taquicardia sinusal, sobrecarga ventricular esquerda (Sokolow-Lyon > 35mm), padrão strain, vigilância de arritmias atriais e intervalo QTc/hipocalemia.
   - Furosemida IV + Nitroglicerina IV + CPAP/VNI, Peptídeo Natriurético (BNP > 1000 pg/mL), gasometria e vigilância de síndrome cardiorrenal.

---

### 1.2 Seleção de Avatares da Tela Inicial (3 Enfermeiros Homens / 3 Enfermeiras Mulheres)
- Em [welcome_screen.dart](file:///c:/Users/alaol/StudioProjects/CardioQuest/lib/screens/welcome_screen.dart), a lista de avatares foi atualizada para disponibilizar **3 opções masculinas e 3 femininas**, organizadas em um grid responsivo com efeito neon HUD:
  - 👨‍⚕️ **Enfermeiro André:** `assets/avatars/avatar_andre.jpg`
  - 👨‍⚕️ **Enfermeiro Roberto:** `assets/avatars/avatar_roberto.jpg`
  - 👨‍⚕️ **Enfermeiro Marcos:** `assets/avatars/avatar_marcos.jpg` *(novo)*
  - 👩‍⚕️ **Enfermeira Ana Paula:** `assets/avatars/avatar_anapaula.jpg`
  - 👩‍⚕️ **Enfermeira Juliana:** `assets/avatars/avatar_juliana.jpg` *(nova)*
  - 👩‍⚕️ **Enfermeira Beatriz:** `assets/avatars/avatar_beatriz.jpg` *(nova)*

---

## 2. Verificação de Qualidade e Testes

- **`flutter analyze`:**
  - 0 erros / 0 avisos (`No issues found!`).
- **`flutter test`:**
  - 4 testes executados com 100% de sucesso em [widget_test.dart](file:///c:/Users/alaol/StudioProjects/CardioQuest/test/widget_test.dart), incluindo validação automatizada de todas as perguntas, índices de resposta e integridade dos 6 avatares.
