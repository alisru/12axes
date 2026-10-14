# Implementation Plan v11: Rotate Stance-Free "Not Sure" Scenarios Across All 39 Questions

## 1. Goal
Replace all policy-commentary `center` texts with a rotating pool of 4 genuinely stance-free neutral expressions combining "don't know", "don't care", "undecided", and "no stance":
1. `"I haven't made up my mind and don't know or care enough to take a side."`
2. `"I'm undecided; I don't know or care enough about this topic to take a stand."`
3. `"I don't have a firm opinion, and don't know or care enough to take a side."`
4. `"I don't know or care enough about this topic to take a firm stand."`

## 2. Invariants
- Zero political assertions or policy arguments in the Center card.
- True neutral (0, 0) origin semantics.
- Natural variation across the 39 questions so it doesn't feel robotic.
- Fallback generator updated with clean neutral defaults.
- Tests pass (100% pass rate).
