---
name: kanon-audit
description: Audit a personality, country/regime, or ideology against a 343 Kanon and the 7x4 Survival Matrix using verified primary-source quotes, Rhetoric vs. Actuality (Delta H), and Psochic Hegemony (upsilon, psi) coordinates.
---

# /kanon_audit <catalog> <id>

Audits a **personality**, **country/regime**, or **ideology** in `12axes` using the **343 Kanon Alignment Protocol**, **Psochic Hegemony $(\upsilon, \psi)$**, and the **$7 \times 4$ Survival Matrix**.

## Why This Replaces Blind 240-Question Roleplay

In the legacy `12axes` audit (`profile-audit/README.md`), an LLM guesses how a person or regime would answer 240 generic statements without citing a single speech, vote, or law. That causes:
- **Session Variance**: Two AI runs produce materially different vectors for the same living politician (`profile-audit/README.md`, line 82).
- **Rhetoric vs. Regime Confusion**: Authoritarian regimes with democratic constitutions score `48–87%` on Democracy (`profile-audit/README.md`, Failure Mode #5).
- **False Opposites**: Figures who reject both state socialism and bourgeois market materialism (e.g., Nietzsche, Sorel, Proudhon) get forcibly collapsed onto whichever pole the LLM dislikes less (`profile-audit/README.md`, Failure Mode #3).

The **Kanon Audit Protocol** fixes this permanently through two mechanisms:
1. **Full 343 Kanon Primary-Source Audit** (for deep national/actor audits).
2. **Dual-Vector Rhetoric vs. Actuality ($\Delta H$) + $7 \times 4$ Survival Matrix Audit** (immediately runnable on all existing `12axes` profiles via `python profile-audit/kanon_survival_engine.py`).

---

## Part A: Running the Immediate Psochic Hegemony & $7 \times 4$ Survival Matrix Audit on Any `12axes` Profile

Before or after running any 240-question audit in `12axes`, run the Kanon Survival Engine:

```powershell
# 1. Full Psochic Hegemony (upsilon, psi), 7 Survival Bodies (Phi_1..Phi_7),
#    Plane Misidentification Error (L_drain), and 639h Cascade Simulation:
python profile-audit/kanon_survival_engine.py <catalog> <id>

# 2. Compare Stated Ideal / Rhetoric vs. Actual Practice (Hypocrisy Gap Delta H & Helxis Tensor):
python profile-audit/kanon_survival_engine.py --compare <catalog1>:<id1> <catalog2>:<id2>
```

### What `kanon_survival_engine.py` Verifies:
1. **Psochic Coordinate $(\upsilon, \psi) \in [-2.0, +2.0]$ & Zone Anchor**:
   - Confirms whether the profile belongs in **Greater Good $(+1,+1)$**, **Greatest Lie $(-1,+1)$**, **Lesser Good $(+1,-1)$**, or **Greater Evil $(-1,-1)$**.
   - **Solves `BUSSOLA_VS_CATEGORIA.md`**: Unlike `compass_check.py` (where 118/261 ideologies land in the wrong compass box), $(\upsilon, \psi)$ cleanly separates *Cameralism*, *Platonism*, and *Absolute Monarchy* ($-\upsilon$, Elite/State Extraction) from *Council Communism* and *Social Democracy* ($+\upsilon$, Shared Commons).
2. **$0.5$-Zone Perceptual Inversion Detection**:
   - Flags when a profile disguises **Extraction as Liberty/Strength**, **Cruelty as Moral Protection**, **Tyranny as Collective Care**, or **Abandonment as Freedom**.
3. **Multiplicative Systemic Viability ($V = \prod_{p=1}^7 \Phi_p$) & Bottleneck Plane**:
   - Identifies which of the 7 Survival Bodies (`P1 Recognition`, `P2 Purpose`, `P3 Shelter`, `P4 Refreshment`, `P5 Power`, `P6 Moral`, `P7 Sustenance`) is starved to near-zero and traces its decay across $t = 0\text{h} \to 639\text{h}$.

---

## Part B: The 343 Kanon Node-by-Node Audit Protocol (Primary-Source Standard)

When auditing an actor (politician, thinker, party, or regime) against a 343 National Kanon, execute **Move 1** and **Move 2** for every node:

### Move 1: Identify the Ideal Expressed at `(Plane.Sense.Vector)`
Read the complete, unredacted Kanon JSON entry for the node (`address`, `name`, `description`, `coordinates`, `judgment_rationale`). Identify the **structural mechanism**:
- **Who is it meant to benefit ($\upsilon$)?**
- **What kind of energy does embodying it require ($\psi$)?**
- **Which Survival Body ($\Phi_1 \dots \Phi_7$) and Scale (`Micro`, `Meso`, `Macro`, `Total`) does it sustain?**

### Move 2: Identify How the Actor Hits or Fails the Ideal
Frame every lookup around the concrete question:
> **"In a verified primary-source quote and documented material action, how does `[actor]` hit or fail the mechanism of `[whole node JSON text]`?"**

1. **Hypothesis Generation**: Identify the specific real-world speech, parliamentary vote, bill, executive order, or historical controversy where the actor confronted this exact mechanism.
2. **Primary-Source Verification (Hard Boundary)**:
   - Fetch the verbatim quote, speaker attribution, exact date, and specific URL (never a generic homepage like `https://www.gov.br` or `https://www.pm.gov.au`).
   - **Never write `Description`, `Justification`, or `Actuality` until the verbatim quote is verified.**
3. **Separate Rhetoric (`Quote`) from Practice (`Actuality`)**:
   - **Header Quote**: The actor's stated position or landmark speech on the vector (`[^shortkey1]`).
   - **Actuality Section**: The actor's actual material output over time—bills passed, budgets cut, votes cast, or institutional actions—citing a **strictly different source and event** (`[^shortkey2]`) than the Header Quote.
   - If the actor's **Rhetoric** claims a HIT ($+\upsilon, +\psi$) while their **Actuality** delivers extraction or suppression ($-\upsilon, -\psi$), append **`TENTATIVE FAIL`** (or flip the node verdict to **`FAIL`**) and record the **Helxis Tensor `[me, me]` Bait-and-Switch**.

### Canonical Node Format
```markdown
**(Address) Vector Name (\upsilon: \+X.X, \psi: \+Y.Y): HIT/FAIL.** **Quote:** "Verbatim primary quote." -Speaker, Specific Context/Body (Year)[^key1]

Description: 4-5 sentences explaining what this vector measures, the canonical ideal, and how the actor's position relates to it. (No coordinate symbols in prose).

Justification: 4-5 sentences explaining in plain language why the quote and mechanism result in a HIT or FAIL on beneficiary scope (upsilon) and active will (psi).

Actuality: 4-5 sentences documenting concrete legislative/executive actions, dates, and outcomes with distinct citations[^key2]. End with TENTATIVE FAIL if material actions betray the stated quote.
```

### Verdict-Weighted Scoring Formula
Never use raw unweighted averages. For any plane or 343-node audit, compute alignment and effective coordinates as:
$$\text{Effective } (\upsilon_{\text{actor}}, \psi_{\text{actor}}) = \frac{1}{N} \sum_{i=1}^{N} (\upsilon_i, \psi_i) \cdot s_i, \quad \text{where } s_i = \begin{cases} +1 & \text{if HIT} \\ -1 & \text{if FAIL} \end{cases}$$

---

## Part C: Dual-Vector Upgrade for `12axes` JSON Profiles (`idealVector` vs. `actualVector`)

When auditing a `country` or `personality` in `12axes` where constitutional/campaign rhetoric diverges from institutional reality:
1. Audit `answers/<catalog>/<id>.ideal.json` (how their **manifesto, constitution, or public rhetoric** answers the 240 questions).
2. Audit `answers/<catalog>/<id>.json` (how their **actual institutional practice and voting/governing record** answers the 240 questions).
3. Run:
   ```powershell
   python profile-audit/kanon_survival_engine.py --compare <catalog>:<id_ideal> <catalog>:<id_actual>
   ```
   to output the exact **Hypocrisy Gap ($\Delta H$)** and **Helxis Tensor classification** (`GRACE [me, you]`, `THE FALL [me, me]`, `DELUSION [you, me]`, or `REDEMPTION [me, you]`).
