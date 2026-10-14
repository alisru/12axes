# Walkthough & Progress Log — 12Axes Kanon & Survival Matrix Upgrade

**Project Folder:** `e:\Vector Field Theory\12axes`
**Plans Directory:** `e:\Vector Field Theory\12axes\_kanon_pr_plans`

## Completed Steps

1. **Deep Audit of `12axes` Codebase (`PSOQUIC_SURVIVAL_MATRIX_ANALYSIS.md`)**:
   - Audited `ScoringService.java`, `ProfileMatchScorer.java`, `AxisTensionService.java`, `DimensionMatcherService.java`, `AxisOutlierService.java`, `politicalCompass.ts`, `questions-pool.json`, `archetype-questions.json`, `BUSSOLA_VS_CATEGORIA.md`, `profile-audit/README.md`, and `validate.py`.
   - Identified the 7 core structural flaws of `12axes`, including the 45.2% 2D compass misclassification rate (118/261 ideologies), the `DimensionMatcherService` 12-axis duplication bug (`DimensionMatcherServiceTest.java` line 81), the 80.8% Macro scale skew, and the near-zero coverage of Survival Planes $P_2$ (Purpose, 2.5%), $P_4$ (Refreshment, 2.9%), and $P_7$ (Sustenance, 2.9%).

2. **Drop-In Claude Code Skills & Commands Created in `.claude/`**:
   - [`.claude/skills/kanon-build/SKILL.md`](file:///e:/Vector%20Field%20Theory/12axes/.claude/skills/kanon-build/SKILL.md) + [`.claude/commands/kanon_build.md`](file:///e:/Vector%20Field%20Theory/12axes/.claude/commands/kanon_build.md)
   - [`.claude/skills/kanon-audit/SKILL.md`](file:///e:/Vector%20Field%20Theory/12axes/.claude/skills/kanon-audit/SKILL.md) + [`.claude/commands/kanon_audit.md`](file:///e:/Vector%20Field%20Theory/12axes/.claude/commands/kanon_audit.md)
   - [`.claude/skills/survival-matrix-audit/SKILL.md`](file:///e:/Vector%20Field%20Theory/12axes/.claude/skills/survival-matrix-audit/SKILL.md) + [`.claude/commands/survival_matrix_audit.md`](file:///e:/Vector%20Field%20Theory/12axes/.claude/commands/survival_matrix_audit.md)

3. **Executable Python Engine Created (`profile-audit/kanon_survival_engine.py`)**:
   - Implements Psochic Hegemony $(\upsilon, \psi)$ coordinate calculation, Zone Anchor classification, $0.5$-Zone Perceptual Inversion detection, $7 \times 4$ Survival Matrix capacitance scoring ($\Phi_1 \dots \Phi_7$), Multiplicative Systemic Viability ($V = \prod \Phi_p$), Plane Misidentification Error Drain ($L_{\text{drain}}$), 639-hour dynamical cascade simulation ($\tau_p$), and Dual-Vector Hypocrisy Gap ($\Delta H$ / Helxis Tensor) comparison.
   - Tested and verified on the live `12axes` catalog data.

4. **Master Pull Request Package Written (`PR_FOR_THE_LOVE_OF_GOD.md`)**:
   - Ready-to-submit PR narrative and documentation with live benchmarks from the repo's own data.


## Session Log Update — 2026-10-13 (Archetype & Compass Calibration + Live UI Integration)
- Saved `implementation_plan_v2.md` in `_kanon_pr_plans/` (preserving `implementation_plan_v1.md`) and archived `psochic_hegemony_chart.png` and `geometry_of_definitions_square.png`.
- Fixed `backend/src/main/resources/data/archetype-questions.json`:
  - `sociedade` Option C ("Live and let live"): `moral: 55 -> 70, religiao: 60 -> 72, imigracao: 40 -> 38`
  - `poder` Option B ("Elites decide, with limited voting"): `representacao: 40 -> 24, estrutura: 38 -> 28, poder: 65 -> 74`
  - `poder` Option C ("Democracy with checks and balances"): `estrutura: 45 -> 58`
  - `economia` Option D ("Bosses and unions united by the state"): `economia: 65 -> 50, comercio: 88 -> 86`
  - Preserved `economia` Option F (`{12, 8, 12}`) and 5-question/6-option invariants for `ArchetypeScoringTest.java`.
- Upgraded `frontend/src/utils/politicalCompass.ts` and `profile-audit/compass_check.py`:
  - Integrated the Inclusive/Exclusive ($\upsilon$) and Productive/Reductive/Constructive/Regressive ($\psi$, `will be` / `can't be` / `may be` / `won't be`) Geometry of Definitions correction so Fascism (`Fascismo`), Falangism (`Falangismo`), Communism (`Comunismo`), and Marxist Socialism (`Socialismo Marxista`) all match their true compass regions (`coincide`) and Islamic Theocracy / Platonism are no longer placed in Radical Left.
  - Added `computePsochicHegemony` and `computeSurvivalMatrix` exports to `politicalCompass.ts`.
- Upgraded `frontend/src/components/results/PoliticalCompassSection.tsx` and `frontend/src/components/editorial/ResultsScreen.tsx`:
  - Rendered the live 2D Psochic Hegemony $(\upsilon, \psi)$ map, Zone Anchor, Geometry of Definitions modal process, Helxis vector (`[who, who]`), $0.5$-Zone Perceptual Inversion warnings, and $7 \times 4$ Survival Matrix ($\Phi_1 \dots \Phi_7$, Multiplicative Viability $V$, Plane Error Drain $L_{\text{drain}}$, and 639h cascade retention) directly on the Results screen.

## Phase 10 — Integration of `A Framework for the Judgment of Ideas.md` & Potential Over Time ($P \cdot t > 0$)
- Connected the Psochic Hegemony $(\upsilon, \psi)$ directly into `computeSurvivalMatrix` (`frontend/src/utils/politicalCompass.ts`) so the 639-hour dynamical cascade computes **Potential Over Time ($P_0 \to P_t$, $\Delta P = P_t - P_0$, $P \cdot t > 0$)** driven by the Hegemony vector rather than passive status-quo centrist decay.
- Added **Model 3 (Helxis Contradiction Score `||F_f - F_t||`)**, **Model 4 (Worldview Integrity $W \in [0, 1]$ & Euclidean distance from Ideal Moral Force `||F_m - F_t||`)**, and **Model 6 (Trajectory: Path to Enlightenment / Redemption vs. Path to Nowhere / Regression)** from `_VFT MD/Actualism/A Framework for the Judgment of Ideas.md` into `computePsochicHegemony` and `PoliticalCompassSection.tsx`.

## Phase 11 — Archetype Calibration via Empirical 240-Q Audits & Question Pool Audit
- Audited the 5 multiple-choice archetype questions (`archetype-questions.json`) against the actual 240-question answers of 423 profiles in `profile-audit/answers/`.
- Corrected major miscalibrations in `archetype-questions.json`:
  - `sociedade F` ("Fé a serviço da justiça social"): moral corrected from `72` down to `40` (empirical cluster `37.9`), religião to `30`, imigração to `42`. Religious socialists (Khomeini, Chavez, Gaddafi, Distributism, Islamic Socialism) are no longer artificially mapped to secular progressivism.
  - `poder B` ("Elites decidem"): estrutura shifted from `28` to `42` (empirical cluster `42.9`).
  - `poder C` ("Democracia constitucional"): estrutura shifted from `58` to `44` (empirical cluster `43.2`), poder to `50` (empirical `51.4`).
  - `economia D & E`: adjusted to match national protectionism and state intervention cluster centers (`comercio: 76` and `65`).
  - `mundo D` ("Armado, mas fora de guerras alheias"): diplomacia adjusted from extreme `70` to `52` and intervenção from `80` to `58` (empirical cluster `51.9 / 56.1`).
- Recomputed profile vectors in `ideology-profiles.json` (55 profiles), `personality-profiles.json` (210 profiles), and `countries-profiles.json` (137 profiles) with calibrated archetypes.
- Verified all backend Java tests pass (`./mvnw.cmd test` exit code 0).

## Phase 12 — 2-Axis Polar Question Answering Engine (Target Pad & Elimination of the False Opposite)
- Developed the 2-axis question answering component [`QuestionTargetPad.tsx`](file:///e:/Vector%20Field%20Theory/12axes/frontend/src/components/QuestionTargetPad.tsx) and styling [`targetPad.css`](file:///e:/Vector%20Field%20Theory/12axes/frontend/src/styles/targetPad.css).
- Modeled the space:
  - Center $(0, 0)$ = Pure Indifference / Zero Will ($\psi = 0$).
  - Radial distance $r \in [0, 2]$ = Conviction magnitude ($\psi$ force: Indifferent $\to$ Moderate $\to$ Firm $\to$ Radical).
  - Vertical Axis $Y$ = Action/Stance toward proposition (+Y Affirmative / Implement $\longleftrightarrow$ -Y Rejection / Oppose).
  - Horizontal Axis $X$ = Conditional / Moral Scope $\upsilon$ (+X Universal Flourishing / Common Good $\longleftrightarrow$ -X Factional Advantage / Private Extraction).
- Integrated into [`QuestionCard.tsx`](file:///e:/Vector%20Field%20Theory/12axes/frontend/src/components/QuestionCard.tsx) with a 1-click toggle (`[1D Clássico]` vs `[Radar 2D]`) and wired vector state up to [`App.tsx`](file:///e:/Vector%20Field%20Theory/12axes/frontend/src/App.tsx).
- Created automated test suite [`frontend/test/questionTargetPad.test.ts`](file:///e:/Vector%20Field%20Theory/12axes/frontend/test/questionTargetPad.test.ts) proving resolution of the "False Opposite" on `diplomacia_18` ("Abolish armed forces") and magnitude scaling. All 12 test files (85/85 tests) pass.

## Phase 13 — Full English Default & Spanish Language Version
- Updated [`QuestionTargetPad.tsx`](file:///e:/Vector%20Field%20Theory/12axes/frontend/src/components/QuestionTargetPad.tsx) to default to plain, grounded English (`en`) for all labels, telemetries, quadrants, and contextual questions, while providing a full Spanish (`es`) translation alongside Portuguese (`pt`).
- Expanded i18n system in [`frontend/src/i18n/index.ts`](file:///e:/Vector%20Field%20Theory/12axes/frontend/src/i18n/index.ts):
  - `Lang` type updated to `'pt' | 'en' | 'es'`.
  - Added full Spanish dictionary `es` and URL route support (`/es`, `?lang=es`).
  - Updated navigation toggle in [`frontend/src/App.tsx`](file:///e:/Vector%20Field%20Theory/12axes/frontend/src/App.tsx) and [`QuestionCard.tsx`](file:///e:/Vector%20Field%20Theory/12axes/frontend/src/components/QuestionCard.tsx) to cycle between English, Spanish, and Portuguese with a single click.
- Passed 100% of TypeScript checks (`npx tsc --noEmit`) and Vitest suites (12/12 files, 85/85 tests).

## Phase 14 — Server Launcher (`run_servers.bat`) & Live Verification
- Created [`run_servers.bat`](file:///e:/Vector%20Field%20Theory/12axes/run_servers.bat) in repository root for 1-click startup of both the backend API and frontend dev server.
- Started background daemons:
  - Local API backend listening on `http://127.0.0.1:8080` (HTTP 200).
  - Vite frontend server listening on `http://localhost:5173/` (HTTP 200).
- Launched the default browser directly to `http://localhost:5173/`.

## Phase 15 — Language Propagation to Quiz/Archetypes & Australia Country Pinned for Testing
- Fixed data path in `profile-audit/local_api_server.py` to point to `backend/src/main/resources/data/i18n/en/` so that English translation files (`axes.json`, `questions.json`, `ideologies.json`, `countries.json`, `personalities.json`) are correctly loaded.
- Verified `/api/quiz?variant=short&lang=en` now serves all questions, answer options, and archetype questions in English.
- Added Spanish translations (`"es"`) directly to `backend/src/main/resources/data/archetype-questions.json` across all 5 themes (`sociedade`, `poder`, `economia`, `mundo`, `tecnologia`) and all options; updated server `get_archetypes(lang)` to select `es` when requested.
- In `profile-audit/local_api_server.py`, pinned Australia (`countryId == "australia"`) as `top_country` on quiz calculation.
- In `frontend/src/data/exampleResult.ts`, set Australia as the primary showcase country and updated fallback to English for non-Portuguese languages (`LANG === 'pt' ? pt : en`).
- Verified all 85 Vitest tests pass (12/12 test suites) and Maven test-compile passes.

## Phase 16 — Square Grid Hegemony Pad & Contextual Relative Scenarios
- Implemented exact **Square Grid $[-2, +2] \times [-2, +2]$** in [`QuestionTargetPad.tsx`](file:///e:/Vector%20Field%20Theory/12axes/frontend/src/components/QuestionTargetPad.tsx) matching the Geometry of Definitions and Psochic Hegemony chart:
  - Outer square ($\pm 2.0$): Systemic Horizon.
  - Inner dashed square ($\pm 1.0$): Human Horizon.
  - 4 Square Quadrant zones with distinct soft fills.
  - Central origin $(0, 0)$ circle for Indifference / Neutrality.
- Restored **12-Axis Relative Question Context**:
  - Displays active axis name and poles (e.g., `[Structure: Federalism ⟷ Centralism]`).
  - Added clear impact sentence: `Agreeing moves your score toward [Agreed Pole] · Disagreeing moves your score toward [Opposing Pole]`.
- Replaced internal theoretical notation (`{Everyone}`, Greek letters, `WILL_BE`) with **grounded, plain-language contextual scenarios**:
  - **Support for Everyone**: Support the policy to advance the agreed pole for the collective good and public benefit.
  - **Support for Self / Group**: Support the policy because it brings direct advantages to me or my group.
  - **Oppose for Everyone**: Oppose the policy to defend the opposing pole and protect society from systemic damage.
  - **Oppose for Self / Group**: Oppose the policy to defend the opposing pole and protect my group's resources and freedoms.
  - **Neutral / Indifferent**: No stake or balances both sides equally.
- Decoupled dragging from auto-advance: dragging updates reticle position and telemetry without advancing; advance requires clicking **"Confirm & Next Question →"**.
- Preserved existing Spanish translations to prevent teardown churn.
- Verified: All 12 test suites (85/85 tests) pass, TypeScript passes with 0 errors.

## Phase 17 — Ban on Mad-Libs Templates & Grounded Hegemonic Question Options
- Diagnosed the root cause of robotic question text: `questions-pool.json` had 0 `help` objects, causing every question to fall back to an ungrammatical mad-libs template (`Support this to advance ${poleA}...`).
- Replaced the template function in [`QuestionTargetPad.tsx`](file:///e:/Vector%20Field%20Theory/12axes/frontend/src/components/QuestionTargetPad.tsx) with:
  1. Specific, authentic Hegemony-grounded scenarios for `economia_10` ("Taxes should be voluntary"):
     - **Top-Left $(+\upsilon, +\psi)$**: Civic duty and community funding replacing state coercion.
     - **Top-Right $(-\upsilon, +\psi)$**: Private income defense against funding foreign wars or programs.
     - **Bottom-Left $(+\upsilon, -\psi)$**: Systemic protection of public safety nets, hospitals, and schools.
     - **Bottom-Right $(-\upsilon, -\psi)$**: Anti-sucker cynicism against honest workers bearing the burden while elites evade.
     - **Center $(0, 0)$**: Genuine confusion / uncertainty (*"I don't know / Not sure"*).
  2. Clean, natural human universal fallbacks for all other questions in English, Portuguese, and Spanish without raw pole string interpolation.
  3. Mapped the "selective opt-out" compromise to its true structural coordinate $(-0.8, -0.6)$ (passive extraction), keeping origin $(0, 0)$ strictly as Confusion / Indifference.
- Created `/learn` proposal artifact in [`learning_proposal.md`](file:///C:/Users/hungh/.gemini/antigravity/brain/1d5cf756-9868-4b0b-862c-663c2bd1d481/learning_proposal.md).
- Verified: All 85 unit tests pass, TypeScript compiler passes cleanly with 0 errors.

## Phase 18 — Layout Normalization (Zero Layout Shift During Drag) & Learning Rule Codification
- Codified and committed the workspace rule [`.agent/rules/hegemonic-coordinates-no-madlibs.md`](file:///e:/Vector%20Field%20Theory/VFT%20Docs/.agent/rules/hegemonic-coordinates-no-madlibs.md) in `VFT Docs`.
- Fixed the layout jitter / height shifting shown in user screenshots when moving the handle:
  - Replaced the wrapping flex container in `.target-telemetry` with a fixed CSS Grid (`grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr) minmax(0, 1fr)`) with a strict `height: 42px; min-height: 42px; max-height: 42px; overflow: hidden;`.
  - Added `white-space: nowrap; overflow: hidden; text-overflow: ellipsis;` to all telemetry rows and values.
  - Normalized `centerNeutral` string to `'Neutral / Indifferent'` to prevent boundary overflow.
  - Set `min-height: 112px;` on `.target-quadrant-btn` and `min-height: 28px;` on `.target-quadrant-title` so that title wrapping differences never cause the button grid to jump or change size.
- Verified: All 12 test suites (85/85 tests) pass, TypeScript compiler passes with 0 errors.

## Phase 19 — Aussie Pub Test Review & 36-Question Curated Hegemonic Scenarios
- Defined and invoked the `pub_tester` subagent ("Aussie farmer/tradie running the front-bar pub test") to ruthlessly filter out academic wankery, corporate LinkedIn buzzwords, and Americanisms across the Hegemonic stances.
- Created [`frontend/src/data/hegemonicScenarios.ts`](file:///e:/Vector%20Field%20Theory/12axes/frontend/src/data/hegemonicScenarios.ts) housing pub-tested, authentic Hegemonic answer sets across all 36 short-quiz questions (spanning all 12 axes) plus `economia_10`:
  - **Agree for Everyone**: Civic duty, fair go, community protection.
  - **Agree for Self / Group**: Pragmatic self-interest, protecting one's hard-earned money/mates/family.
  - **Disagree for Everyone**: Calling out real systemic harm, collapse of public hospitals/schools, and corporate gouging.
  - **Disagree for Self / Group**: Defensive self-interest against being ripped off by tax-dodgers, corrupt elites, or unfair burdens.
  - **I Don't Know / Not Sure**: Honest uncertainty and confusion without fake centrist policy compromises.
- Removed all slash/slash indecisive wording:
  - Cleaned badges to `+ AGREE` and `- DISAGREE` (removing `+ SUPPORT / AGREE` and `- OPPOSE / DISAGREE`).
  - Cleaned button titles to `Agree for Everyone`, `Agree for Self / Group`, `Disagree for Everyone`, `Disagree for Self / Group`, and `I Don't Know / Not Sure`.
  - Replaced circle SVG icon with a square grid icon in the 1D/2D mode toggle.
- Connected `QuestionTargetPad.tsx` to automatically pull curated scenarios from `HEGEMONIC_SCENARIOS`.
- Verified: All 12 test suites (85/85 tests) pass, TypeScript compilation passes with 0 errors.




