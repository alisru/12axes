# Learning Proposal: 9-Cell Hegemonic Grid, Angle-Magnitude Model & Grounded Human UI

## 1. Context & Executive Summary
This proposal captures the core architectural, mathematical, and linguistic breakthroughs established during the development of the 2-Axis Political Quiz answering engine in `12axes`. It translates the user's direct corrections and successful iterations into permanent rules and skill references.

---

## 2. Core Breakthroughs & Principles to Retain

### A. The 9-Cell Hegemonic Decision Grid Architecture ($3 \times 3$)
Instead of 1D Likert buttons or an arbitrary 4-quadrant split, questions map onto a $3 \times 3$ grid anchored strictly in the **Geometry of Definitions** and **Psochic Hegemony**:

```
                  +ψ (Active / "Do")
        TL: Civic Action  | TC: Direct Action | TR: Self-Interest Action
     ---------------------+-------------------+--------------------------
0ψ   ML: Principle-Good   | C: Not Sure / IS  | MR: Skepticism / Self-Rely
     ---------------------+-------------------+--------------------------
        BL: Protect Public| BC: Inst. Defense | BR: Anti-Exploitation
                  -ψ (Counteractive / "Do Not")
```

1. **Top Row ($+\psi$, Active / "Do")**:
   - `top-left` $(+1.15, +1.15)$: Civic / Universal Action (Fair go for all).
   - `top-center` $(0, +1.15)$: Pragmatic / Direct Action (Implementation).
   - `top-right` $(-1.15, +1.15)$: Individual / Personal Advantage Action (Autonomy / Keeping earnings).
2. **Middle Row ($0\psi$, Present / IS / Principle)**:
   - `mid-left` $(+1.15, 0)$: Goodwill in Principle (Agrees in theory, no heavy enforcement).
   - `mid-center` $(0, 0)$: **Origin Center — Honest Confusion / Uncertainty** (*"I don't know / Not sure"*).
   - `mid-right` $(-1.15, 0)$: Skepticism in Principle (Skeptical of shared promises, relies on self).
3. **Bottom Row ($-\psi$, Counteractive / "Do Not")**:
   - `bottom-left` $(+1.15, -1.15)$: Defend Public Good / Prevent Harm (Protect hospitals, roads, schools).
   - `bottom-center` $(0, -1.15)$: Institutional Defense (Compulsory laws and state stability).
   - `bottom-right` $(-1.15, -1.15)$: Anti-Exploitation / Avoid Being Exploited (Refusing to be the sucker).

---

### B. The Angle-Magnitude (Polar Sector) Answering Model
Belief is a polar vector $\vec{B} = (r, \beta)$, decomposed cleanly across the 8-sector perimeter ring:

1. **Direction / Bearing ($\beta$) Defines the Sector**:
   - The 8 perimeter anchors sit $45^\circ$ apart (North = `top-center`, North-East = `top-right`, East = `mid-right`, etc.).
   - Moving in any direction partitions belief **strictly between the 1 or 2 perimeter anchors** in that sector.
   - **Zero radial bleed**: All other 6 perimeter anchors remain strictly at **0%**.
   - Halfway between two adjacent anchors splits the directional belief **50% / 50%**.
2. **Magnitude ($m$) Governs Conviction vs. Center**:
   - Origin $(0, 0)$ is **100% Center ("I Don't Know / Not Sure")**.
   - As distance scales outward toward the anchor ring ($R = 1.15$), Center share decreases linearly as $(1 - m) \times 100\%$, transferring conviction to the perimeter sector.
   - At or beyond $R = 1.15$, Center is **0%** and the stance is fully locked in the perimeter.
3. **Strict Partition of Unity**:
   - All shares sum strictly to **100%** ($\sum \text{pct}_i = 100\%$) with zero rounding drift.

---

### C. UI Presentation: Single Dynamic Human Sentence (No Debug Telemetry)
* **Absolute Ban on Crammed Telemetry Bars**:
  - Never render 3-column debug readouts with truncated labels (`Scope: FOR EV...`, `Action: - DISA...`, `Stance: 47%...`).
  - The map already clearly labels the axes. Redundant scope/action readouts add clutter.
* **Single Fluid Sentence**:
  - Replace the telemetry bar with **a single, plain-English sentence that dynamically updates** as the dot moves:
    - Center: *"You are currently undecided or unsure about this issue."*
    - Split (e.g. `mid-left` + `bottom-left`): *"You agree with the principle in theory, but oppose the policy to protect the public good."*
    - Firm anchor: *"You firmly agree, supporting this for the common good of everyone."*
    - Leaning with doubt: *"You lean toward agreeing for everyone, but remain somewhat undecided."*

---

### D. Grounded Pub Test Persona Standards
* **A Real Person, Not a Cartoon**:
  - A real working person speaking plain English at the front bar.
  - **Ban exaggerated Crocodile Dundee stereotypes**: No forced outback slang (*"crikey"*, *"fair dinkum mate"*, *"bonzer"*, *"struth"*).
  - **Ban academic compound word-salad**: No pseudo-scientific jargon (*"epistemic substrate"*, *"praxeological divergence"*).
  - **No Meta-Labels in Option Text**: Never prepend labels like *"Agree in principle —"* or *"Reject taxation —"* into the scenario body. The only acceptable explicit label is *"I don't know / Not sure"* in the center.

---

### E. Safe Git Workflow & Repo Boundaries
1. **Never Push Upstream**:
   - Upstream repositories (e.g. `RomanCypherpunk/12axes.git`) must be quarantined under the `upstream` remote.
   - Local commits stay on the local machine or push exclusively to the user's personal remote (`alisru`).
2. **Implementation Plan History**:
   - Never overwrite implementation plans. Keep numbered logs (`implementation_plan_v1.md`, `v2.md`, etc.) and diff logs in `_kanon_pr_plans/`.
