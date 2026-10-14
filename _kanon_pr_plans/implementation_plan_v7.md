# Implementation Plan v7 — Full Rollout of 9-Cell Hegemonic Scenarios Across All 12 Axes

## Objective
Convert all remaining 33 questions in `frontend/src/data/hegemonicScenarios.ts` from the legacy 5-position model (`willBe`, `cantBe`, `mayBe`, `wontBe`, `indifferent`) to the full **9-Cell Hegemonic Grid ($3 \times 3$)**:
- Top Row ($+\psi$, Active / "Do"): `topLeft` (Civic), `topCenter` (Direct Action), `topRight` (Self-Advantage)
- Middle Row ($0\psi$, Present / IS / "Principle"): `midLeft` (Principle-Good), `center` (Honest Confusion), `midRight` (Skepticism/Self-Reliance)
- Bottom Row ($-\psi$, Counteractive / "Do Not"): `bottomLeft` (Defend Public Good), `bottomCenter` (Institutional Stability), `bottomRight` (Anti-Exploitation)

## Linguistic & Persona Invariants
1. **Grounded Everyday English**: Spoken by a real person at the front bar.
2. **Absolute Ban on Cartoon Caricatures**: No Hollywood Crocodile Dundee slang (*"crikey"*, *"fair dinkum"*, *"struth"*).
3. **Absolute Ban on Academic Compounds**: Plain, observable words only.
4. **No Meta-Labels**: No prepending *"Agree in principle —"* or *"Reject —"* into option text.

## Execution Batches
- [x] **Batch 0: Estrutura (01, 02, 03, 04, 05) + Economia 10** (Completed)
- [ ] **Batch 1: Economia (01, 02, 03)** & **Representação (01, 02, 03)** (6 questions)
- [ ] **Batch 2: Poder (01, 02, 03)** & **Imigração (01, 02, 03)** (6 questions)
- [ ] **Batch 3: Diplomacia (01, 02, 03)** & **Intervenção (01, 02, 03)** (6 questions)
- [ ] **Batch 4: Controle (01, 02, 03)** & **Comércio (01, 02, 03)** (6 questions)
- [ ] **Batch 5: Religião (01, 02, 03)**, **Moral (01, 02, 03)** & **Tecnologia (01, 02, 03)** (9 questions)
