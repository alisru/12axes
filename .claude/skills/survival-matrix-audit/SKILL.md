---
name: survival-matrix-audit
description: Run the 7x4 Survival Matrix and Psochic Hegemony (upsilon, psi) diagnostic on any 12axes profile, compare Rhetoric vs. Actuality (Delta H), or benchmark the 240-question pool.
---

# /survival_matrix_audit <catalog> <id>

Runs the **$7 \times 4$ Survival Matrix Framework v2** and **Psochic Hegemony $(\upsilon, \psi)$** diagnostic engine (`profile-audit/kanon_survival_engine.py`) on any profile in `12axes`.

## Commands

```powershell
# 1. Audit a single ideology, country, or personality:
python profile-audit/kanon_survival_engine.py <ideology|country|personality> <id>

# 2. Compare two profiles (Hypocrisy Gap Delta H & Helxis Tensor Deception Detection):
python profile-audit/kanon_survival_engine.py --compare <cat1>:<id1> <cat2>:<id2>

# 3. Run the BUSSOLA_VS_CATEGORIA.md resolution benchmark:
python profile-audit/kanon_survival_engine.py --benchmark

# 4. Audit the 240-question pool across the 7 Planes x 4 Scales:
python profile-audit/kanon_survival_engine.py --question-coverage
```

## What It Measures

1. **Psochic Hegemony Coordinates $(\upsilon, \psi) \in [-2.0, +2.0]$**:
   - **$\upsilon$ (Morality — Who benefits?)**: `+2` Everyone $\to$ `+1` Others $\to$ `0` Neutral $\to$ `-1` My Group $\to$ `-2` Only Me / Pure Extraction.
   - **$\psi$ (Will — What is the energy doing?)**: `+2` Productive Justice $\to$ `+1` Proactive $\to$ `0` Stasis $\to$ `-1` Passive Withholding $\to$ `-2` Active Destruction.
   - **$0.5$-Zone Perceptual Inversion Flag**: Detects when a profile disguises oligarchic extraction as "liberty", police cruelty as "moral order", or totalitarian control as "collective care".
2. **The 7 Survival Bodies ($\Phi_1 \dots \Phi_7$) & Multiplicative Viability ($V = \prod_{p=1}^7 \Phi_p$)**:
   - **$\Phi_1$ Recognition (`Who`)** — Metaphysical Body ($\tau_1 = 72\text{h}$)
   - **$\Phi_2$ Purpose (`What`)** — Possible Body ($\tau_2 = 336\text{h}$)
   - **$\Phi_3$ Shelter (`Where`)** — Physical Body ($\tau_3 = 3\text{h}$)
   - **$\Phi_4$ Refreshment (`Why`)** — Lyrical Body ($\tau_4 = 36\text{h}$)
   - **$\Phi_5$ Power (`How`)** — Logical Body ($\tau_5 = 120\text{h}$)
   - **$\Phi_6$ Moral (`Cause`)** — Historical Body ($\tau_6 = 720\text{h}$)
   - **$\Phi_7$ Sustenance (`Effect`)** — Emotive Body ($\tau_7 = 168\text{h}$)
3. **Plane Misidentification Error ($L_{\text{drain}} = \gamma (\Phi_a - \Phi_b)^2 \Phi_b$)**:
   - Identifies when an ideology tries to solve a crisis on Plane $a$ using the coercive or market tools of Plane $b$, draining physical and lyrical capacitance ($\Phi_3, \Phi_4$).
4. **Dynamical Cascade Simulation ($t = 0\text{h} \to 639\text{h}$)**:
   - Simulates the first-order lag differential equation around the closed loop $P_1 \to P_2 \to P_5 \to P_3 \to P_4 \to P_7 \to P_6 \to P_1$ to show how the profile's bottleneck plane drags down total systemic viability over time.
