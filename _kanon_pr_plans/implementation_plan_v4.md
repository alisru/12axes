# Implementation Plan v4 — Language Propagation to Quiz & Archetypes + Australia Country Pinned for Testing

**Date:** 2026-10-14  
**Project:** `e:\Vector Field Theory\12axes`  
**Folder:** `_kanon_pr_plans`

## Context & Objectives
1. **Fix Language Translation Propagation**:
   - Ensure English is the default everywhere for the user, and Spanish is fully supported for Spanish speakers.
   - Fix the issue where questions and archetype questions/pictures were returning Portuguese instead of English.
2. **Pin Country Match to Australia for Testing**:
   - Set the top country match to Australia (`australia`) in both the backend API scoring server and example results so the user can immediately test Australia results and cards.
3. **Verify Launcher and Active Daemons**:
   - Ensure the backend Python API server and frontend Vite server run smoothly and return translated payloads with Australia.

---

## Root Cause Analysis
1. **Translation Files Path Mismatch**:
   - `profile-audit/local_api_server.py` was attempting to load English translation files from `DATA / "en"` (which didn't exist).
   - The actual translation repository is `backend/src/main/resources/data/i18n/en/` (`axes.json`, `questions.json`, `countries.json`, `ideologies.json`, `personalities.json`).
   - Consequently, the server silently defaulted to Portuguese for questions, axes, and archetype options.
2. **Missing Spanish in Archetypes**:
   - `archetype-questions.json` lacked Spanish (`es`) fields, meaning Spanish quiz takers fell back to Portuguese.
3. **Country Matching**:
   - Pinned Australia (`australia`) in `profile-audit/local_api_server.py` and updated `frontend/src/data/exampleResult.ts` to Australia as the primary showcase country.

---

## Implemented Changes

### 1. Backend Server (`profile-audit/local_api_server.py`)
- Configured translation path `I18N = DATA / "i18n"`.
- Implemented `_load_opt_map` for ID-keyed lookup of translated objects.
- Bound English translations to axes, questions, ideologies, countries, and personalities.
- Updated `get_archetypes(lang)` to select `es` if available, falling back to `en` then `pt`.
- In `compute_quiz_result`:
  ```python
  aus_match = next((c for c in country_matches if c["countryId"] == "australia"), None)
  if aus_match:
      top_country = aus_match
  ```
- Set default query parameter language to `"en"`.

### 2. Archetype Translations (`backend/src/main/resources/data/archetype-questions.json`)
- Added Spanish translations (`"es"`) for all 5 archetype themes (`sociedade`, `poder`, `economia`, `mundo`, `tecnologia`), their question prompts, and all answer options.

### 3. Frontend Showcase & Fallbacks (`frontend/src/data/exampleResult.ts`)
- Replaced Cuba with Australia (`countryId: 'australia'`) in Portuguese and English default showcases.
- Updated `EXAMPLE_RESULTS = LANG === 'pt' ? pt : en` so Spanish and English viewers default to English examples with Australia rather than Portuguese.

### 4. Frontend Localization & Routing (`frontend/src/i18n/index.ts`)
- Updated `resolveLang()` to default to `'en'`.
- Preserved search query parameters on language change (`?lang=en`, `?lang=es`, `?lang=pt`).

---

## Verification Results
- `curl.exe http://127.0.0.1:8080/api/quiz?variant=short&lang=en`:
  - Questions returned in English (e.g. "Marriage should be recognized only between a man and a woman.").
  - Archetype questions returned in English (e.g. "What should society rest on?", "Faith, family and national tradition").
- `curl.exe http://127.0.0.1:8080/api/quiz?variant=short&lang=es`:
  - Archetype questions returned in Spanish (e.g. "¿En qué debe apoyarse la sociedad?", "Fe, familia y tradición de la nación").
- Top country match check:
  - Both GET `/api/results/by-axes` and POST `/api/results` return Australia (`australia`, "A federal parliamentary monarchy, Australia unites stable democracy...").
- Vitest: 12 test files passed, 85/85 tests passed.
- Backend compile: Maven `./mvnw.cmd test-compile` passed (exit code 0).
