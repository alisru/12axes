# Implementation Plan v3 — 2-Axis / Polar Question Answering Engine (Target Pad)

## 1. Problem Statement: The 1D Likert Scale Flaw & The False Opposite Trap
In conventional survey engines (including `12axes`'s 240 questions):
- A user is presented with a proposition $P$ and 5 scalar buttons:
  `STRONGLY_AGREE` (+1.0), `AGREE` (+0.5), `NEUTRAL` (0.0), `DISAGREE` (-0.5), `STRONGLY_DISAGREE` (-1.0).
- **Core Failure 1 (Center Conflation)**:
  `NEUTRAL` currently conflates **Zero Force / Indifference** ($\psi = 0$, "I don't care / irrelevant to me") with **Precise Balance / Golden Mean** ("I care deeply and demand a measured, structural balance").
- **Core Failure 2 (The False Opposite / Asymmetric Intent)**:
  Take `diplomacia_18`: *"The armed forces should be dismantled."*
  - **Oppose with Positive Intent ($+\upsilon, +\psi$)**: A citizen who opposes dismantling because a defensive sovereign military protects common people against imperial aggression.
  - **Oppose with Negative Intent ($-\upsilon, +\psi$)**: A militarist who opposes dismantling because they want the army to conquer neighbors and extract colonial tribute.
  *On a 1D scale, both click "Disagree" and receive the exact same score.*
  Similarly:
  - **Support with Positive Intent ($+\upsilon, +\psi$)**: A pacifist who supports dismantling for universal demilitarization and peace.
  - **Support with Negative Intent ($-\upsilon, +\psi$)**: An anarcho-capitalist warlord who supports dismantling the national military to replace it with private corporate mercenary armies.
  *On a 1D scale, both click "Agree" and receive the exact same score.*

## 2. Theoretical Architecture: 2D Polar Target Space
We unfold each question from a scalar into a 2D vector $\vec{A} = (X, Y)$ or $(r, \theta)$:

1. **Origin $(0, 0)$ = Indifference / Inaction**:
   - Radial distance $r = \sqrt{X^2 + Y^2} = 0$: Pure indifference, lack of conviction, or neutral stance ($\psi = 0$).
   - Concentric rings:
     - Ring 0 ($r < 0.2$): Indifferent / Uninvolved / Pass-through.
     - Ring 1 ($0.2 \le r < 0.6$): Moderate / Conditional.
     - Ring 2 ($0.6 \le r < 1.2$): Strong / Firm conviction.
     - Ring 3 ($1.2 \le r \le 2.0$): Radical / Absolute principle.

2. **Vertical Axis ($Y$) = Action / Policy Stance**:
   - $+Y$ (+1.0 to +2.0): Affirmative / Expand / Enforce / Implement.
   - $-Y$ (-1.0 to -2.0): Rejection / Abolish / Restrict / Dismantle.

3. **Horizontal Axis ($X$) = Conditional Scope / Beneficiary ($\upsilon$)**:
   - $+X$: Universal / Public Good / Protection ($+\upsilon$: All beings / Systemic Resilience).
   - $-X$: Factional / Private Autonomy / Extraction ($-\upsilon$: My group / Elite dominance / Exploitation).

4. **The 4 Quadrants & Parable Geometry**:
   - **Quadrant I ($+Y, +X$)**: *Affirmative for the Common Good* (`WILL BE` / Systemic Justice).
   - **Quadrant II ($+Y, -X$)**: *Affirmative for Particular Advantage* (`MAY BE` / Extractive Expansion).
   - **Quadrant III ($-Y, +X$)**: *Opposition to Protect Society* (`CAN'T BE` / Sovereign Defense / Prevention of Harm).
   - **Quadrant IV ($-Y, -X$)**: *Opposition for Factional Dominance* (`WON'T BE` / Imperialism / Hierarchical Power).

## 3. Implementation Steps

1. **Create `frontend/src/components/QuestionTargetPad.tsx`**:
   - Interactive radar / bullseye SVG with clickable & draggable crosshair.
   - 4 Quadrant target zones + Center Bullseye.
   - Contextual quadrant rationale pills tailored for key boundary-condition questions.
   - Live vector readouts: Distance ($r$), Direction Angle ($\theta$), Projected 1D 12Axes Score, and Hegemony contribution $(\Delta\upsilon, \Delta\psi)$.
   - Preset buttons around the target for one-click mobile & accessibility use.

2. **Integrate Mode Switcher into `QuestionCard.tsx`**:
   - Add a clean header toggle: "1D Clássico" / "2D Vetor (Target Pad)".
   - When in 2D mode, clicking the pad updates both the 1D compatible answer (so the quiz scoring continues to work 100% reliably) and records the 2D vector for deep Psochic Hegemony scoring.

3. **Provide Standalone Interactive Demo / Showcase**:
   - Allow users to immediately test the 2D pad against key ambiguous questions (`diplomacia_18` "Abolish military", `economia_01` "Free market", `controle_18` "Surveillance", `tecnologia_06` "Automation").

4. **Verification**:
   - Run Vitest tests (`npx vitest run`) and TypeScript build checks (`npx tsc --noEmit`).
