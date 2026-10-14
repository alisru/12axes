# 12Axes Master Integration Summary: Psochic Hegemony, Survival Matrix & Empirical Calibration

**Workspace:** `e:\Vector Field Theory\12axes`  
**Date:** 2026-10-13  
**Status:** Completed & Fully Tested (All Backend Java & Frontend Vitest Tests Passing)

---

## 1. Core Theoretical Foundations Integrated

### A. The Psochic Hegemony $(\upsilon, \psi)$
- **Axis $\upsilon$ (Morality — Scope of Benefit)**: Scaled continuously from `+2.00` to `-2.00`:
  - `+2.00`: Everyone / All beings (Systemic Justice)
  - `+1.00`: Other people (Greater Good)
  - `0.00`: No one / Neutral / Confusion Zone
  - `-1.00`: My group only (Lesser Evil / Greatest Lie)
  - `-2.00`: Only me (Tyranny / Pure Extraction)
- **Axis $\psi$ (Will — Mode of Action)**: Scaled continuously from `+2.00` to `-2.00`:
  - `+2.00`: Actively creating systemic value for all (Productive Justice)
  - `+1.00`: Proactive — creating, building, acting
  - `0.00`: Neutral — no meaningful force applied
  - `-1.00`: Passive — allowing, suppressing, withholding
  - `-2.00`: Actively destroying or extracting value (Chaos / Collapse)

### B. The Geometry of Definitions (`parables.png`) & Crawl Vector
The four corners of the diagram map the lifecycle of definitions relative to **what IS**:
1. **Productive Quadrant (`+υ, +ψ` — Air)**: `"will be"` (Solution) — uses what *is not* and what *is like*, opposing what *was like*, until it **CAN BE** (`IS → can be → will be`).
2. **Reductive Quadrant (`-υ, +ψ` — Fire)**: `"can't be"` (Problem) — uses what *was like* and what *can be*, opposing what *is like*, until it **IS NOT** (`IS → is not → can't be`).
3. **Constructive Quadrant (`+υ, -ψ` — Water)**: `"may be"` — uses what *can be* and what *was like* until it **IS LIKE** (`IS → is like → may be`).
4. **Regressive Quadrant (`-υ, -ψ` — Earth)**: `"won't be"` — uses what *is not* and what *is like* to oppose what *can be*, returning to what **WAS LIKE** (`IS → was like → won't be`).
- **Crawl Vector**: Renders a live directional displacement vector from `IS` (origin) over the Hegemonikon surface with angle ($\theta^\circ$) and magnitude ($r$).

### C. The Helxis Tensor & 0.5-Zone Perceptual Inversions
- **The Four Beneficiary Classifications (`[who, who]`)**:
  - **Grace**: `"You":[me, you]` = "For You, Me and Everyone"
  - **The Fall**: `"You":[me, me]` = "For You, but Only for Me" (Bait-and-Switch)
  - **Delusion**: `"Me":[you, me]` = "Me and You, but Really for Me"
  - **Redemption**: `"Me":[me, you]` = "For Me, only Me, and you take what I don't need"
- **Perceptual Inversions (0.5 Zone)**: Automatic alerts flagging psychological ego distortions:
  - *Extraction as Strength* (Lesser Evil perceived as Lesser Good)
  - *Service as Burden* (Greater Good perceived as Greater Evil)
  - *Stability as Rot* (Peace perceived as Weakness)
  - *Cruelty as Protection* (Exclusion perceived as Order)

### D. The $7 \times 4$ Survival Matrix Framework v2 & $P \cdot t > 0$
- **7 Survival Planes ($\Phi_1 \dots \Phi_7$)**: Physical ($P_1$), Logistic ($P_2$), Biological ($P_3$), Social Cohesion ($P_4$), Epistemic Agency ($P_5$), Legal Structure ($P_6$), and Systemic Evolution ($P_7$).
- **Multiplicative Viability**: $V = \prod_{p=1}^7 \Phi_p$.
- **Identification Error Drain**: $L_{\text{drain}} = \sum \gamma (\Phi_a - \Phi_b)^2 \Phi_b$.
- **Potential Over Time ($P \cdot t > 0$)**:
  - The Hegemony vector $(\upsilon, \psi)$ is wired directly into the **639-hour dynamical cascade** ($P_1 \to P_2 \to P_5 \to P_3 \to P_4 \to P_7 \to P_6 \to P_1$).
  - When $\upsilon > 0$ and $\psi > 0$ without coercive tyranny, **Potential compounds over time ($\Delta P \cdot t > 0$)** (`Potential Growing (P·t > 0 · Good)`).
  - In Reductive or Regressive quadrants ($-\upsilon$ or $-\psi$), Potential erodes over time ($\Delta P \cdot t \le 0$).

### E. Integration of `A Framework for the Judgment of Ideas.md`
- **Model 3 (Helxis Contradiction Score)**: $\|F_f - F_t\|$ calculates the Euclidean gap between an ideology's stated economic/social rhetoric (*The Cover*, $F_f$) and its actual political power/inclusion outcome (*True Intent*, $F_t$).
- **Model 4 (Worldview Integrity $W \in [0, 1]$)**: Measures distance from the Ideal Moral Force $\|F_m - F_t\|$ ($F_m = +2\upsilon, +2\psi$) and degradation ($1 - \text{pollution}$) caused by accepting extractive or contradictory claims.
- **Model 6 (Trajectory Analysis)**: Classifies the vector into **Path to Enlightenment (Progress / Redemption)** vs. **Path to Nowhere (Regression / Fall from Grace)**.

---

## 2. Backend & Matching Algorithm Fixes

1. **Root Cause in Original Code**:
   In `IdeologyMatcherServiceTest.java` (line 191), the original authors discovered that their Fascist test profile matched **"Esquerda Radical"** (Radical Left) because state planning (`controle`) and trade protectionism (`comercio`) masked the core moral axis. Instead of fixing the matcher, they wrote `.isIn("Extrema Direita", "Esquerda Radical")`.
2. **The Fix (`ProfileMatchScorer.java`)**:
   Added `psochicQuadrantFactor()`:
   - Evaluates $(\upsilon, \psi)$ for the user and each ideology.
   - If an exclusive/extractive ideology ($-\upsilon$) attempts to match an inclusive ideology ($+\upsilon$), a cross-quadrant penalty (up to 28%) is applied.
   - Result: `extremeFascistAnswer()` now cleanly matches `reacionarismo` (84.8%, Extrema Direita) and `fascismo-clerical` (83.9%, Terceira Posição) with **zero** Radical Left false-matches.

---

## 3. Archetype Calibration via Empirical 240-Question Audits

The 5 multiple-choice archetype questions in `archetype-questions.json` were originally written by hand with arbitrary guessed effects. We audited them against **423 completed profiles** in `profile-audit/answers/` (which contained all 240 question answers alongside the archetype selections) and realigned the options to their true empirical cluster centers:

| Realm & Option | Description | Old Guess | Calibrated Cluster | Key Correction |
|---|---|---|---|---|
| **Sociedade F** | Fé a serviço da justiça social | `mor:72, rel:25, imi:30` | `mor:40, rel:30, imi:42` | Fixed 34-point moral error: religious socialists (Khomeini, Chavez, Gaddafi, Distributism, Tutu) are religious and culturally moderate, not secular progressives. |
| **Poder B** | Elites decidem (Voto limitado) | `rep:24, est:28, pod:74` | `rep:30, est:40, pod:68` | Corrected excessive unitarism (authoritarian elites average `estrutura: 42.9`, not `28`). |
| **Poder C** | Democracia constitucional | `rep:78, est:58, pod:42` | `rep:78, est:44, pod:50` | Aligned with modern democracies that maintain national institutions and law enforcement (`pod: 50, est: 44`). |
| **Economia D** | Patrões e sindicatos (Corporativismo) | `eco:50, con:84, com:86` | `eco:60, con:74, com:76` | Aligned with state-coordinated production and developmentalism. |
| **Economia E** | Empresas nacionais protegidas | `eco:38, con:60, com:80` | `eco:50, con:68, com:65` | Aligned with domestic market protection clusters. |
| **Mundo D** | Armado, fora de guerras alheias | `dip:70, int:80` | `dip:52, int:58` | Corrected extreme interventionism: armed neutrality/deterrence lands in pragmatic balance (`dip: 52, int: 58`), not expansionism. |
| **Mundo E** | Paz e não intervenção, sempre | `dip:8, int:90` | `dip:18, int:76` | Smoothed boundary values to empirical pacifist cluster. |

- **Profiles Recomputed**: Updated vectors in `ideology-profiles.json` (55), `personality-profiles.json` (210), and `countries-profiles.json` (137) using `profile_vector.py`.

---

## 4. Audit of the 240-Question Pool (`questions-pool.json`)

- **Balance**: Exactly **20 questions per axis** across all 12 axes (10 `LEFT` and 10 `RIGHT`).
- **High-Neutral Questions (`N > 30%`)**:
  - `moral_15` (46.2% neutral): Vegetarianism/meat reduction.
  - `tecnologia_06` & `17` (39.4% & 36.3% neutral): Pesticides and lab-grown meat.
  - `tecnologia_15` (32.0% neutral): Brain implants for healthy humans.
  - *Reason*: Regional/contemporary issues are anachronistic for pre-modern/historical figures.
- **Extreme Boundary Skew Questions (`< 20%` general agreement)**:
  - `controle_18` (15.4%): Abolishing the Central Bank.
  - `economia_10` (15.5%): Voluntary taxation.
  - `diplomacia_18` (15.5%): Extinguishing the Armed Forces.
  - `poder_08` (18.2%): Full legalization of all drugs including cocaine.
  - `estrutura_09` (19.3%): Unilateral state secession.
  - *Function*: Successfully act as 95th–99th percentile boundary probes.

---

## 5. Frontend UI Upgrades

All changes are live at `http://localhost:5173` in:
- [`frontend/src/utils/politicalCompass.ts`](file:///e:/Vector%20Field%20Theory/12axes/frontend/src/utils/politicalCompass.ts)
- [`frontend/src/components/results/PoliticalCompassSection.tsx`](file:///e:/Vector%20Field%20Theory/12axes/frontend/src/components/results/PoliticalCompassSection.tsx)
- [`frontend/src/components/editorial/ResultsScreen.tsx`](file:///e:/Vector%20Field%20Theory/12axes/frontend/src/components/editorial/ResultsScreen.tsx)

**Rendered on the Results Page:**
1. **Interactive 2D Psochic Hegemony Card**:
   - `IS` center anchor, 4 definition states (`will be`, `can't be`, `may be`, `won't be`), and dashed SVG Crawl Vector arrow.
   - Coordinate readout: `(υ = ..., ψ = ...)` with nearest zone anchor and Portuguese/English copy.
2. **Deception & Integrity Badges (from `A Framework for the Judgment of Ideas.md`)**:
   - Contradiction Score $\|F_f - F_t\|$
   - Worldview Integrity ($W$)
   - Trajectory: *Path to Enlightenment (Progress / Redemption)* vs. *Path to Nowhere (Regression / Fall)*
   - Helxis classification (`forEveryone`, `forYouOnlyMe`, etc.)
   - 0.5-Zone Perceptual Inversion Warning alerts
3. **$7 \times 4$ Survival Matrix Card**:
   - 7 plane capacity bars ($\Phi_1 \dots \Phi_7$) with bottleneck warning icons.
   - Multiplicative Viability ($V = \prod \Phi_p$) and identification error drain ($L_{\text{drain}}$).
   - **$P \cdot t > 0$ Potential Over Time indicator**: Shows $P_0 \to P_t$ and $\Delta P \cdot t$ (green for positive compounding growth, red for entropic erosion).

---

## 6. Verification & Test Suite Status

- **Java Backend**: `./mvnw.cmd test` passes with **0 errors**.
- **Frontend Vitest**: `npx vitest run` passes **11/11 test files (81/81 tests)**.
- **TypeScript**: `npx tsc --noEmit` passes with **0 type errors**.
- **Live Servers**:
  - Vite Frontend: `http://localhost:5173` (Task `task-205`)
  - Local API Server: `http://127.0.0.1:8080` (Task `task-217`)
