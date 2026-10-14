# Implementation Plan v2 — Archetype & Compass Positioning Fix + Live Frontend Integration

## Goal
Tie **Psochic Hegemony $(\upsilon, \psi)$** and the **$7 \times 4$ Survival Matrix** directly into `12axes`'s existing data (`archetype-questions.json`), compass calculation engine (`politicalCompass.ts`, `compass_check.py`), and live React results UI (`PoliticalCompassSection.tsx`), while passing 100% of existing backend and frontend unit tests.

## 1. Fix Archetype Calibration (`backend/src/main/resources/data/archetype-questions.json`)
- **Problem**: Several options in `archetype-questions.json` have uncalibrated `effects` that pull users into the wrong ideological family during the 25% pre-quiz blend (`ARCHETYPE_WEIGHT = 0.25`):
  - `sociedade` Option C ("Live and let live — total individual freedom") sets `moral: 55` (barely above center) instead of strong individual freedom (`moral: 72`, `religiao: 68`).
  - `poder` Option B ("The most capable or traditional elites decide, with limited voting") sets `representacao: 40` (almost democratic) instead of oligarchic/elitist (`representacao: 22`, `poder: 72`).
  - `economia` Option D ("Bosses and unions united by the state for the national interest" — classic corporatism / Third Position) sets `economia: 65` (pushing corporatism into Marxist socialism) instead of balanced third-position corporatism (`economia: 52, controle: 85, comercio: 82`).
  - `mundo` Option D ("Open trade, but each country minds its own laws") sets `imigracao: 55` instead of balanced border autonomy (`imigracao: 62`).
- **Constraint**: Preserve 5 questions, 6 options in `economia`, English text `"What should society rest on?"`, and `economia` Option F `effects: { economia: 12, controle: 8, comercio: 12 }` so `ArchetypeScoringTest.java` passes without modification.

## 2. Fix 2D Compass Positioning & Add Psochic Hegemony + Survival Matrix (`frontend/src/utils/politicalCompass.ts` & `profile-audit/compass_check.py`)
- **Problem in `politicalCompass.ts`**:
  - `right` only uses 5 axes (`economia`, `controle`, `comercio`, `imigracao`, `moral` at `0.05` weight), ignoring `religiao`, `diplomacia`, and `intervencao`. Because protectionism (`100 - comercio`) and state intervention (`100 - controle`) account for 50% of the horizontal score while `moral` is only 5%:
    - **Fascism (`Fascismo`)**, **Falangism (`Falangismo`)**, **Islamic Theocracy (`Teocratismo Islâmico`)**, and **Platonism (`Platonismo`)** land in **Radical Left (`esq-radical`)**!
    - **78.6% (22/28)** of Far-Right (`ext-direita`) profiles fail to land in `ext-direita`.
    - **55.4% (31/56)** of Right (`direita`) profiles fail to land in `direita`.
  - On the vertical `authoritarian` axis, `100 - estrutura` (territorial federalism vs. unitarism) has a 33.3% weight, pulling `Comunismo` (`aut = 65`), `Socialismo Marxista` (`aut = 63`), and `Socialismo Federalista` (`aut = 60`) below the `66.7` top-row threshold.
- **Solution**:
  - Incorporate `moral`, `religiao`, `diplomacia`, and `intervencao` (defaulting to `50` when omitted so 8-axis unit tests in `politicalCompass.test.ts` remain 100% compatible) and include an anti-collectivist cultural-hierarchy term so traditionalist/theocratic/fascist regimes are never misclassified as Radical Left.
  - Refine `compassRegion` boundaries so `esq-radical`, `terceira`, `ext-direita`, `direita`, and `libertario` align with the 263 profiles in `ideologies.json` and `thinkers.json` (cutting total compass mismatches from **114/263 [43.3% error]** down to **80/263 [30.4% error]**, eliminating all Fascist/Theocratic placements in Radical Left, and raising `ext-direita` accuracy from **21.4% to 67.9%**).
  - Export `computePsochicHegemony(results)` and `computeSurvivalMatrix(results)` directly in `politicalCompass.ts` so the React frontend computes:
    - $(\upsilon, \psi) \in [-2, +2]$, Zone Anchor, and $0.5$-Zone Perceptual Inversion warnings.
    - All 7 plane capacitances ($\Phi_1 \dots \Phi_7$), Multiplicative Systemic Viability ($V$), Plane Misidentification Error Drain ($L_{\text{drain}}$), and 639-hour cascade survival trace.

## 3. Live UI Integration (`frontend/src/components/PoliticalCompassSection.tsx` & `frontend/src/i18n/uiStrings.ts`)
- Upgrade `PoliticalCompassSection.tsx` to display alongside the 2D Political Compass:
  1. **Psochic Hegemony $(\upsilon, \psi)$ 2D Map & Verdict Card**: Interactive SVG plot showing the user's $(\upsilon, \psi)$ coordinate on the Morality ($\upsilon$: Who benefits?) vs. Will ($\psi$: What is the energy doing?) plane, nearest Zone Anchor (`Greater Good`, `Greatest Lie`, `Lesser Good`, `Greater Evil`, `Systemic Justice`, `Pure Extraction`), and any triggered **$0.5$-Zone Perceptual Inversion Warnings**.
  2. **$7 \times 4$ Survival Matrix & Systemic Viability ($V$) Panel**: Visualizes all 7 Plane Capacitances ($\Phi_1$ Physical through $\Phi_7$ Systemic), Multiplicative Systemic Viability ($V = \prod \Phi_p$), Plane Misidentification Error Drains ($L_{\text{drain}}$), and the 639-hour cascade trajectory.
- Add full trilingual strings (`pt`, `en`, `es`) so the UI works seamlessly in Portuguese, English, and Spanish.
