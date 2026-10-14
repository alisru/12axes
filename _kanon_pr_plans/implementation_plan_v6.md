# Implementation Plan v6 — Angle-Magnitude Polar Sector Answering Model

## Objective
Replace isotropic Euclidean distance kernel weighting with the **Angle-Magnitude (Polar Sector) Model** for the 2-Axis 9-Cell Decision Grid:
1. **Bearing / Direction ($\beta$)**: Angle Determines the Sector between the 8 perimeter anchors.
   - Pointing along an anchor ray gives **100% directional belief** to that stance and **0%** to all other perimeter anchors (no radial bleed).
   - Pointing halfway between two adjacent anchors splits the directional belief **50% / 50%**.
   - No opposite or sideways anchors receive bleed share.
2. **Magnitude ($m$)**: Radial conviction away from the origin Center $(0, 0)$.
   - At center origin ($m \le 0.05$): Center ("I Don't Know / Not Sure") is **100%**.
   - As $m$ scales outward from 0 to 1.0 (reaching the anchor ring at $R_{\text{anchor}} = 1.15$): Center share decreases linearly as $(1 - m) \times 100\%$, transferring conviction into the active perimeter sector.
   - At or beyond $1.15$: Center share is **0%** and 100% of the stance is distributed across the 1 or 2 sector anchors.
3. **Strict Partition of Unity**: All active shares sum to strictly **100%**.

## Perimeter Anchor Sequence (Clockwise from North)
| Index | Key | Bearing | Stance / Role |
| :---: | :--- | :---: | :--- |
| 0 | `top-center` | 0° (North) | Direct Action / Agree (+ψ, 0υ) |
| 1 | `top-right` | 45° (North-East) | Agree for Self / Group (+ψ, -υ) |
| 2 | `mid-right` | 90° (East) | Disagree in Principle (0ψ, -υ) |
| 3 | `bottom-right` | 135° (South-East) | Anti-Exploitation / Disagree for Self (-ψ, -υ) |
| 4 | `bottom-center` | 180° (South) | Institutional Defense / Disagree (-ψ, 0υ) |
| 5 | `bottom-left` | 225° (South-West) | Defend Public Good / Disagree for Everyone (-ψ, +υ) |
| 6 | `mid-left` | 270° (West) | Agree in Principle (0ψ, +υ) |
| 7 | `top-left` | 315° (North-West) | Universal / Agree for Everyone (+ψ, +υ) |

## Test Verification
- All 89 unit tests pass in `frontend/`.
- Dedicated automated tests in `test/questionTargetPad.test.ts` verify:
  1. 100% Center allocation at $(0, 0)$.
  2. 50% Agree for Self + 50% Center at $m = 0.50$ along ray, with 0% to all 7 other anchors.
  3. 50% / 50% split between adjacent perimeter anchors at full magnitude, with 0% to Center and 0% to the other 6 anchors.
  4. 100% allocation on all 9 preset button clicks.
