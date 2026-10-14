# Implementation Plan v5 — Square Grid Hegemony Pad & 12-Axis Relative Question Context

**Date:** 2026-10-14  
**Project:** `e:\Vector Field Theory\12axes`  
**Folder:** `_kanon_pr_plans`

## Context & Objectives
1. **Drop Spanish Requirement**:
   - Zero tokens spent on Spanish. Strictly 2 clean, isolated languages:
     - **English (`en`)** as default for the user.
     - **Portuguese (`pt`)** for the author.
2. **Strict Square Grid $[-2, +2] \times [-2, +2]$**:
   - SVG is an exact square with outer border ($\pm 2.0$) and inner dashed square ($\pm 1.0$).
   - Horizontal Axis: Left is Positive Scope ($+2$ Everyone / Public Good), Right is Negative Scope ($-2$ Self / My Group).
   - Vertical Axis: Top is Positive Action ($+2$ Support / Agree), Bottom is Negative Action ($-2$ Oppose / Disagree).
   - Center: $(0, 0)$ Neutral / Indifference.
3. **Restore 12-Axis Relative Question Context**:
   - Every question displays the explicit 12-axis tension it measures:
     - Active Axis name and both poles (e.g., `[Economy: Collective Ownership ⟷ Private Enterprise]`).
     - Clear explanation: "Agreeing moves toward [Left Pole]; Disagreeing moves toward [Right Pole]".
4. **Public-Facing Language (Zero Developer Notation / Jargon)**:
   - Remove `{Everyone}`, Greek letters ($\upsilon, \psi$), and esoteric labels ("Will Be / Can't Be").
   - Replace with plain, observable actions:
     - **Support for Everyone** (Agree for collective / public good)
     - **Support for Self / Group** (Agree for personal / group advantage)
     - **Oppose for Everyone** (Disagree to protect public / common good)
     - **Oppose for Self / Group** (Disagree because it harms me / my group)
     - **Neutral / Indifferent** (No conviction / no stake)
5. **Interaction & Advancing**:
   - Dragging or clicking on the pad updates reticle and telemetry live.
   - Advance occurs exclusively when the user clicks **"Confirm & Next Question →"**.

---

## Proposed Changes

### 1. `frontend/src/components/QuestionTargetPad.tsx`
- Replace circular SVG paths and arcs with SVG `<rect>` and square boundary lines:
  - Outer square: $[-2, +2]$ (Systemic / Strategic Horizon).
  - Inner square: $[-1, +1]$ (Individual / Human Horizon).
  - Crosshair lines along $x = 0$ and $y = 0$.
- Retain only `en` and `pt` strings. Strip out all `es` references.
- Display 12-axis relative explanation directly on the pad header / context box.

### 2. `frontend/src/components/QuestionCard.tsx`
- Pass `axis` details and pole meanings into `QuestionTargetPad`.
- Ensure language toggle cleanly cycles between `EN` and `PT` only.

### 3. Verification & Tests
- Run `npm test` / Vitest to ensure all tests pass.
- Verify live server display at `http://localhost:5173/`.
