# Implementation Plan v10: Fix "Not Sure" (Center) Scenarios to Actually Express Genuine Uncertainty

## 1. Problem Diagnosis
- In `hegemonicScenarios.ts`, the `center` scenarios were previously rewritten as detached, compromise policy statements (e.g., *"Keeping government secular makes sense, but many people's core morals stem from faith"*).
- The user rightly called this out: that is not an expression of being "Not Sure" or "I don't know" — it reads like a third opinion or nuanced philosophical essay.
- A user clicking **Not Sure** expects the text to clearly and honestly state their uncertainty, being torn between both sides, or lack of conviction/knowledge on that specific question.

## 2. Invariant Standard for Center ("Not Sure")
Every `center` scenario must:
1. Actually state that the person is **unsure, torn, or undecided** on the specific question.
2. Be punchy, direct, and grounded (8–13 words max).
3. Plain English pub-test phrasing (e.g. *"I'm torn on this — good points on both sides"*, *"I don't know enough to take a side here"*, *"Hard to say — both arguments have merit"*).
4. No detached sociological commentary masquerading as indecision.

## 3. Scope
Update all 39 `center` scenarios in `frontend/src/data/hegemonicScenarios.ts` and the fallback generator in `frontend/src/components/QuestionTargetPad.tsx`.
