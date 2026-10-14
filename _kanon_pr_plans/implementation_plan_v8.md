# Implementation Plan v8: Complete 9-Cell Hegemonic Grid Rollout (Batch 5 & Fallback Unification)

## 1. Goal
Complete the migration of all 36 questions in `12axes` to the 9-cell Hegemonic Grid architecture ($3 \times 3$, $\psi \in \{+1.15, 0, -1.15\} \times \upsilon \in \{+1.15, 0, -1.15\}$).
Specifically:
- Migrate final 9 questions in `frontend/src/data/hegemonicScenarios.ts`:
  - `religiao_01`, `religiao_02`, `religiao_03`
  - `moral_01`, `moral_02`, `moral_03`
  - `tecnologia_01`, `tecnologia_02`, `tecnologia_03`
- Upgrade the fallback scenario generator in `frontend/src/components/QuestionTargetPad.tsx` (`getContextualScenarios`) so any uncurated question falls back cleanly to a 9-cell `HegemonicScenario9Set` rather than legacy 5-position `HegemonicScenarioSet`.
- Verify TypeScript compilation (`npx tsc --noEmit`) and run full Vitest test suite (`npm test`).
- Save diff logs and commit locally to git (never push to upstream).

## 2. Invariants & Pub Test Persona Rules
- Real working people language, front-bar grounded realism.
- No cartoon slang ("crikey", "fair dinkum", etc.).
- No academic pseudo-scientific jargon.
- No meta-labels in scenario strings (e.g. no "Agree in principle —").
- Exact 9 positions:
  - `topLeft`: (+1.15, +1.15) Civic / Universal Action
  - `topCenter`: (0, +1.15) Pragmatic / Direct Action
  - `topRight`: (-1.15, +1.15) Individual / Personal Advantage Action
  - `midLeft`: (+1.15, 0) Goodwill in Principle
  - `center`: (0, 0) Honest Confusion / Uncertainty ("I don't know / Not sure — ...")
  - `midRight`: (-1.15, 0) Skepticism in Principle
  - `bottomLeft`: (+1.15, -1.15) Protect Public Good / Prevent Harm
  - `bottomCenter`: (0, -1.15) Maintain State / Institutional Stability
  - `bottomRight`: (-1.15, -1.15) Anti-Freeloader / Avoid Being Exploited
- Only `center` contains "I don't know / Not sure".
