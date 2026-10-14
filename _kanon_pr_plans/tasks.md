# Task & Mistake Log — 12Axes Hegemony Pad

**Project:** `12axes_hegemony_pad`  
**Engine:** No More Fuckups Task Engine v5  
**Directory:** `e:\Vector Field Theory\12axes\_kanon_pr_plans`

---

## 1. Registered Mistakes & Regressions (Root Causes)

| ID | Name | Core Structural Failure | Example of What Broke |
| :--- | :--- | :--- | :--- |
| **M016** | **Notation Leaks in Public UI** | Exposing internal developer shorthand, theoretical curly braces, and Greek algebra in public test-taker views. | Showing `{Everyone}` and `Will Be (+υ, +ψ)` on the question answer pad. |
| **M017** | **Square Grid Reversion to Circle** | Reverting explicit $[-2, +2] \times [-2, +2]$ square bounds from the Geometry of Definitions into a polar/circular radar. | Drawing SVG `<circle>` and arc paths instead of outer ($\pm 2$) and inner ($\pm 1$) horizon squares. |
| **M018** | **Premature Auto-Advance Snatching Input** | Firing a 200ms advance timer on initial `pointerDown`/click while the user is trying to drag or inspect the pad. | Snatching the question card away before the user can aim or confirm. |
| **M019** | **Dropping Axis Relative Context** | Omitting the contextual explanation of which 12-axis pole agreeing/disagreeing impacts. | Hiding axis tension balance, leaving user without reference to what the question tests. |
| **M020** | **Unwanted Language Expansion and Bleed** | Adding unrequested translations and allowing bilingual mixing instead of keeping clean English for user and Portuguese for author. | Translating archetypes and mixing English/Portuguese strings. |

---

## 2. Active Task Checklist

- [x] **[Task 0] Implement Square Grid $[-2, +2] \times [-2, +2]$ in `QuestionTargetPad.tsx`**
  - Outer border: Systemic / Strategic Horizon ($\pm 2.0$)
  - Inner dashed border: Individual / Human Horizon ($\pm 1.0$)
  - Center: Neutral / Indifference $(0, 0)$
  - 4 Square Quadrant zones
  - *Completed:* Implemented exact Square Grid SVG matching the Geometry of Definitions and Psochic Hegemony chart.

- [x] **[Task 1] Replace Internal Notation with Plain Grounded Human Options**
  - Replaced `{Everyone}`, Greek letters, `WILL_BE`, `CANT_BE`, `MAY_BE`, `WONT_BE` with concrete, plain-language options:
    - Support for Everyone
    - Support for Self / Group
    - Oppose for Everyone
    - Oppose for Self / Group
    - Neutral / Indifferent
  - *Completed:* Added dynamic contextual scenarios tailored to each question and its active axis poles.

- [x] **[Task 2] Restore 12-Axis Relative Context Above Target Pad**
  - Shows active axis label and both opposing poles (e.g., `[Structure: Federalism ⟷ Centralism]`).
  - Explains: *"Agreeing moves your score toward [Agreed Pole] · Disagreeing moves your score toward [Opposing Pole]"*.
  - *Completed:* Added contextual axis header and pole impact bar in `QuestionTargetPad.tsx` and wired `axis` prop in `QuestionCard.tsx`.

- [x] **[Task 3] Decouple Drag and Click from Auto-Advance**
  - Live dragging and clicking freely updates the crosshair reticle and telemetry without triggering advance.
  - Advancing occurs exclusively when the user clicks **"Confirm & Next Question →"**.
  - *Completed:* Decoupled pointer events from advance timers; advance requires explicit confirmation.

- [x] **[Task 4] Preserve Existing Spanish Without Teardown Churn; Maintain Clean EN/PT Defaults**
  - English is default for test takers; Portuguese is fully preserved for author.
  - Kept existing Spanish translations intact to avoid token waste and churn per user instruction.
  - *Completed:* All 12 test suites and TypeScript compilation pass with 0 errors.

- [x] **[Task 5] Implement Angle-Magnitude Polar Sector Answering Model**
  - Replaced isotropic distance bleed with strict polar sectoring:
    - Bearing $\beta$ partitions directional belief exclusively between the 1 or 2 enclosing perimeter anchors (0% radial bleed to sideways/opposite anchors).
    - Radial magnitude $m$ governs conviction: origin $(0, 0)$ is 100% Center ("I Don't Know / Not Sure"); $m$ scales outward linearly to the anchor ring ($R = 1.15$), transferring share into the perimeter sector.
    - All preset buttons click directly to 100% with 0% elsewhere.
  - *Completed:* All 89 unit tests pass in `frontend/`. Exported `computeShares` with comprehensive test coverage.

- [x] **[Task 6] Establish Workspace Rules & Expand 9-Cell Scenarios (estrutura_03 to 05)**
  - Codified permanent rules in `.agent/rules/hegemonic-grid-quiz.md` and `.agents/AGENTS.md`.
  - Replaced 3-column debug telemetry with single dynamic human sentence banner.
  - Formulated full pub-tested 9-cell scenarios for:
    - `estrutura_03`: "Laws on local matters should be made by local governments."
    - `estrutura_04`: "I prefer a single national school curriculum to curricula set by each region."
    - `estrutura_05`: "Each state or province should be free to write its own constitution, without national interference."
  - *Completed:* Clean TypeScript compilation and 89/89 passing tests.
