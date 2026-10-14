# Implementation Plan v9: Aggressive Defaffing & Word Reduction Across All Hegemonic Scenarios

## 1. Problem Identification
- **Center ("Not Sure") Redundancy**: The UI card header already prominently displays `"Not Sure"` (and `"Em Dúvida"` / `"En Duda"`). Currently, the scenario text begins with the redundant meta-prefix `"I don't know / Not sure — "`, followed by an overly verbose essay.
- **Verbose Phrasing Across All 8 Perimeter Cells**: Many answers currently average 18–25 words, packed with rhetorical padding, compound semicolons, and bureaucratic faff.
- **Target**: Reduce all answers by 3–10 words (aiming for concise, punchy 8–14 word statements) while maintaining precise hegemonic positions and grounded pub-test authenticity.
- **Prefix Removal**: Strip all `"I don't know / Not sure — "` prefixes from `center`.

## 2. Reduction Standards by Cell
- **topLeft (Civic Action)**: Direct statement of universal collective benefit. (Target: 8–12 words)
- **topCenter (Direct Action)**: Practical policy or direct implementation step. (Target: 7–11 words)
- **topRight (Personal Advantage)**: Practical self/group benefit or personal autonomy. (Target: 8–12 words)
- **midLeft (Goodwill Principle)**: Agree in principle while noting practical tradeoffs. (Target: 8–12 words)
- **center (Uncertainty)**: Concise explanation of the core dilemma/uncertainty WITHOUT repeating "I don't know / Not sure". (Target: 6–10 words)
- **midRight (Skepticism)**: Grounded doubt about corrupt motives, cost, or inefficiency. (Target: 8–12 words)
- **bottomLeft (Harm Prevention)**: Clear statement of systemic harm or danger to the public. (Target: 8–12 words)
- **bottomCenter (Stability)**: Keep existing legal safeguards, order, or due process. (Target: 7–11 words)
- **bottomRight (Anti-Exploitation)**: Stop unfair burdens, higher bills, or being ripped off. (Target: 8–12 words)

## 3. Workflow
1. Present the before/after comparisons and rules directly to the user.
2. Apply the defaffed scenarios across all 39 questions in `frontend/src/data/hegemonicScenarios.ts`.
3. Update fallback generator in `frontend/src/components/QuestionTargetPad.tsx` to match the defaffed concise style.
4. Verify TypeScript build and Vitest suite (all 89 tests passing).
5. Archive diffs and commit locally.
