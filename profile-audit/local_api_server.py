"""Zero-dependency local API server on port 8080 mirroring Spring Boot's QuizController.

Allows running `npm run dev` on port 5173 without needing Maven/Spring Boot installed.
Serves:
  - GET  /api/quiz
  - POST /api/results
  - GET  /api/results/by-axes
  - GET  /api/compare/catalog
  - GET  /api/compare
  - GET  /api/ideologies, /api/countries, /api/personalities
"""

from __future__ import annotations

import json
import math
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "backend" / "src" / "main" / "resources" / "data"

AXIS_IDS = [
    "estrutura", "representacao", "poder", "imigracao", "diplomacia", "intervencao",
    "economia", "controle", "comercio", "religiao", "moral", "tecnologia"
]

POLITICAL_AXES = ["estrutura", "representacao", "poder", "diplomacia", "intervencao"]
SOCIAL_AXES = ["imigracao", "religiao", "moral", "tecnologia"]
ECONOMIC_AXES = ["economia", "controle", "comercio"]

def _load_opt(path: Path, default: object) -> object:
    return json.loads(path.read_text(encoding="utf-8")) if path.exists() else default


def _load_opt_map(path: Path) -> dict:
    if not path.exists():
        return {}
    data = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(data, list):
        return {item["id"]: item for item in data if "id" in item}
    if isinstance(data, dict):
        return data
    return {}


I18N = DATA / "i18n"
AXES_PT = json.loads((DATA / "axes.json").read_text(encoding="utf-8"))
AXES_EN_MAP = _load_opt_map(I18N / "en" / "axes.json")
QUESTIONS_PT = json.loads((DATA / "questions-pool.json").read_text(encoding="utf-8"))
QUESTIONS_EN_MAP = _load_opt_map(I18N / "en" / "questions.json")
ARCHETYPES_RAW = json.loads((DATA / "archetype-questions.json").read_text(encoding="utf-8"))

IDEOLOGIES_PT = json.loads((DATA / "ideologies.json").read_text(encoding="utf-8"))
IDEOLOGIES_EN_MAP = _load_opt_map(I18N / "en" / "ideologies.json")
IDEOLOGY_VECTORS = {
    p["ideologyId"]: p["vector"]
    for p in json.loads((DATA / "ideology-profiles.json").read_text(encoding="utf-8"))
}

COUNTRIES_PT = json.loads((DATA / "countries.json").read_text(encoding="utf-8"))
COUNTRIES_EN_MAP = _load_opt_map(I18N / "en" / "countries.json")
COUNTRY_VECTORS = {
    p["countryId"]: p["vector"]
    for p in json.loads((DATA / "countries-profiles.json").read_text(encoding="utf-8"))
}

PERSONALITIES_PT = json.loads((DATA / "personalities.json").read_text(encoding="utf-8"))
PERSONALITIES_EN_MAP = _load_opt_map(I18N / "en" / "personalities.json")
PERSONALITY_VECTORS = {
    p["personalityId"]: p["vector"]
    for p in json.loads((DATA / "personality-profiles.json").read_text(encoding="utf-8"))
}

BOOKS_RAW = _load_opt(DATA / "books.json", [])

ANSWER_SCORES = {
    "STRONGLY_AGREE": 1.0,
    "AGREE": 0.75,
    "NEUTRAL": 0.5,
    "DISAGREE": 0.25,
    "STRONGLY_DISAGREE": 0.0,
}


def get_axes(lang: str) -> list[dict]:
    if lang == "pt":
        return AXES_PT
    out = []
    for a in AXES_PT:
        tr = AXES_EN_MAP.get(a["id"], {})
        out.append({**a, **tr})
    return out


def get_questions(lang: str) -> list[dict]:
    if lang == "pt":
        return QUESTIONS_PT
    out = []
    for q in QUESTIONS_PT:
        tr = QUESTIONS_EN_MAP.get(q["id"], {})
        out.append({**q, **tr})
    return out


def get_archetypes(lang: str) -> list[dict]:
    key = lang if lang in ("pt", "es") else "en"
    out = []
    for q in ARCHETYPES_RAW:
        out.append({
            "id": q["id"],
            "label": q["label"].get(key, q["label"].get("en", q["label"]["pt"])),
            "text": q["text"].get(key, q["text"].get("en", q["text"]["pt"])),
            "options": [
                {
                    "id": o["id"],
                    "text": o["text"].get(key, o["text"].get("en", o["text"]["pt"])),
                    "effects": o["effects"]
                }
                for o in q["options"]
            ],
        })
    return out


def compatibility(u: dict[str, float], t: dict[str, float], axis_ids: list[str] = AXIS_IDS) -> float:
    tot_sim = 0.0
    dot = 0.0
    u_norm2 = 0.0
    t_norm2 = 0.0
    u_dist = 0.0
    t_dist = 0.0
    max_diff = 0.0

    for aid in axis_ids:
        uv = float(u.get(aid, 50.0))
        tv = float(t.get(aid, 50.0))
        diff = abs(uv - tv)
        max_diff = max(max_diff, diff)
        sim = max(0.0, 1.0 - (diff / 50.0) ** 2)
        if (uv - 50.0) * (tv - 50.0) < 0:
            pen = 0.45 * math.tanh(abs(uv - 50.0) / 25.0) * math.tanh(abs(tv - 50.0) / 25.0)
            sim *= (1.0 - pen)
        tot_sim += sim

        cu, ct = uv - 50.0, tv - 50.0
        dot += cu * ct
        u_norm2 += cu * cu
        t_norm2 += ct * ct
        u_dist += abs(cu)
        t_dist += abs(ct)

    n = len(axis_ids)
    axis_sim = 100.0 * tot_sim / n
    aug = n * 64.0
    cos = (dot + aug) / math.sqrt((u_norm2 + aug) * (t_norm2 + aug))
    dir_sim = 50.0 + 50.0 * cos
    mag_sim = 100.0 - 2.0 * abs((u_dist / n) - (t_dist / n))
    out_sim = 100.0 * max(0.0, 1.0 - (max_diff / 100.0) ** 2.5)
    raw = 0.42 * axis_sim + 0.33 * dir_sim + 0.18 * mag_sim + 0.07 * out_sim

    q_factor = 1.0
    if n == 12:
        u_soc = ((float(u.get("moral", 50.0)) - 50.0) + (50.0 - float(u.get("imigracao", 50.0)))) / 100.0
        t_soc = ((float(t.get("moral", 50.0)) - 50.0) + (50.0 - float(t.get("imigracao", 50.0)))) / 100.0
        if abs(u_soc) >= 0.25 and abs(t_soc) >= 0.25:
            u_ups = 0.45 * ((float(u.get("economia", 50.0)) - 50.0) / 50.0) + 0.55 * u_soc
            t_ups = 0.45 * ((float(t.get("economia", 50.0)) - 50.0) / 50.0) + 0.55 * t_soc
            if u_ups * t_ups < 0.0:
                cross_mag = min(1.0, abs(u_ups - t_ups) / 1.5)
                q_factor = 1.0 - 0.14 * cross_mag * math.tanh(abs(u_ups) * 2.0) * math.tanh(abs(t_ups) * 2.0)

    return round(max(0.0, min(100.0, raw * q_factor)), 1)


def intensity_for(dist: float, lang: str) -> str:
    en = lang == "en"
    if dist < 7.5:
        return "Balanced" if en else "Equilibrado"
    if dist < 22.5:
        return "Leaning" if en else "Inclinado"
    if dist < 37.5:
        return "Strong" if en else "Forte"
    return "Very strong" if en else "Muito forte"


def build_axis_results(user_vec: dict[str, float], lang: str) -> list[dict]:
    axes = get_axes(lang)
    res = []
    for a in axes:
        lp = round(max(0.0, min(100.0, float(user_vec.get(a["id"], 50.0)))), 1)
        rp = round(100.0 - lp, 1)
        dom = a["leftPole"] if lp >= rp else a["rightPole"]
        res.append({
            "axisId": a["id"],
            "label": a["label"],
            "leftPole": a["leftPole"],
            "rightPole": a["rightPole"],
            "leftPercent": lp,
            "rightPercent": rp,
            "dominantPole": dom,
            "intensity": intensity_for(abs(lp - 50.0), lang),
        })
    return res


def compute_quiz_result(user_vec: dict[str, float], lang: str) -> dict:
    axis_results = build_axis_results(user_vec, lang)

    # Ideologies
    ideo_matches = []
    for item in IDEOLOGIES_PT:
        tr = IDEOLOGIES_EN_MAP.get(item["id"], {}) if lang == "en" else {}
        merged = {**item, **tr}
        vec = IDEOLOGY_VECTORS.get(item["id"], {})
        comp = compatibility(user_vec, vec)
        desc = merged.get("description", "").split("NOTA METODOLÓGICA")[0].strip()
        short_desc = desc.split(". ")[0] + "." if desc else ""
        ideo_matches.append({
            "ideologyId": item["id"],
            "name": merged["name"],
            "category": merged["category"],
            "description": short_desc[:230],
            "longDescription": desc,
            "phrase": merged.get("phrase", ""),
            "compatibility": comp,
        })
    ideo_matches.sort(key=lambda x: (-x["compatibility"], x["name"]))

    # Countries
    country_matches = []
    for item in COUNTRIES_PT:
        tr = COUNTRIES_EN_MAP.get(item["id"], {}) if lang == "en" else {}
        merged = {**item, **tr}
        vec = COUNTRY_VECTORS.get(item["id"], {})
        comp = compatibility(user_vec, vec)
        country_matches.append({
            "countryId": item["id"],
            "name": merged["name"],
            "category": merged.get("category", "Centro"),
            "description": merged.get("description", ""),
            "flagPath": merged.get("flagPath", ""),
            "historical": bool(merged.get("historical", False)),
            "period": merged.get("period", ""),
            "compatibility": comp,
            "vector": vec,
        })
    country_matches.sort(key=lambda x: (-x["compatibility"], x["name"]))
    curr_countries = [c for c in country_matches if not c["historical"]]
    hist_countries = [c for c in country_matches if c["historical"]]
    top_country = curr_countries[0] if curr_countries else country_matches[0]
    # For testing, set the country to Australia
    aus_match = next((c for c in country_matches if c["countryId"] == "australia"), None)
    if aus_match:
        top_country = aus_match
    top_hist = hist_countries[0] if hist_countries else country_matches[0]

    # Personalities
    pers_matches = []
    for item in PERSONALITIES_PT:
        tr = PERSONALITIES_EN_MAP.get(item["id"], {}) if lang == "en" else {}
        merged = {**item, **tr}
        vec = PERSONALITY_VECTORS.get(item["id"], {})
        comp = compatibility(user_vec, vec)
        pers_matches.append({
            "personalityId": item["id"],
            "name": merged["name"],
            "role": merged.get("role", ""),
            "category": merged.get("category", "pensador"),
            "lifespan": merged.get("lifespan", ""),
            "description": merged.get("description", ""),
            "imagePath": merged.get("imagePath", ""),
            "compatibility": comp,
            "vector": vec,
        })
    pers_matches.sort(key=lambda x: (-x["compatibility"], x["name"]))

    def best_pers_for(axis_subset: list[str]) -> dict:
        best = max(
            PERSONALITIES_PT,
            key=lambda p: compatibility(user_vec, PERSONALITY_VECTORS.get(p["id"], {}), axis_subset),
        )
        tr = PERSONALITIES_EN_MAP.get(best["id"], {}) if lang == "en" else {}
        m = {**best, **tr}
        v = PERSONALITY_VECTORS.get(best["id"], {})
        return {
            "personalityId": best["id"],
            "name": m["name"],
            "role": m.get("role", ""),
            "category": m.get("category", "filosofo"),
            "lifespan": m.get("lifespan", ""),
            "description": m.get("description", ""),
            "imagePath": m.get("imagePath", ""),
            "compatibility": compatibility(user_vec, v, axis_subset),
            "vector": v,
        }

    def best_country_for(axis_subset: list[str]) -> dict:
        best = max(
            COUNTRIES_PT,
            key=lambda c: compatibility(user_vec, COUNTRY_VECTORS.get(c["id"], {}), axis_subset),
        )
        tr = COUNTRIES_EN_MAP.get(best["id"], {}) if lang == "en" else {}
        m = {**best, **tr}
        v = COUNTRY_VECTORS.get(best["id"], {})
        return {
            "countryId": best["id"],
            "name": m["name"],
            "category": m.get("category", "Centro"),
            "description": m.get("description", ""),
            "flagPath": m.get("flagPath", ""),
            "historical": bool(m.get("historical", False)),
            "period": m.get("period", ""),
            "compatibility": compatibility(user_vec, v, axis_subset),
            "vector": v,
        }

    cat_best = []
    seen_cats = set()
    for p in pers_matches:
        c = p["category"]
        if c not in seen_cats:
            seen_cats.add(c)
            cat_best.append(p)

    # Outlier & Common
    first_ax = axis_results[0]
    last_ax = axis_results[-1]
    unusual = {
        "axisId": first_ax["axisId"],
        "label": first_ax["label"],
        "userPercent": first_ax["leftPercent"],
        "catalogMedian": 50.0,
        "distanceFromMedian": abs(first_ax["leftPercent"] - 50.0),
        "dominantPole": first_ax["dominantPole"],
        "balanced": abs(first_ax["leftPercent"] - 50.0) < 7.5,
        "abovePole": first_ax["dominantPole"],
        "abovePercent": max(first_ax["leftPercent"], first_ax["rightPercent"]),
    }
    common = {
        "axisId": last_ax["axisId"],
        "label": last_ax["label"],
        "userPercent": last_ax["leftPercent"],
        "catalogMedian": 50.0,
        "distanceFromMedian": abs(last_ax["leftPercent"] - 50.0),
        "dominantPole": last_ax["dominantPole"],
        "balanced": abs(last_ax["leftPercent"] - 50.0) < 7.5,
        "abovePole": last_ax["dominantPole"],
        "abovePercent": max(last_ax["leftPercent"], last_ax["rightPercent"]),
    }

    return {
        "axes": axis_results,
        "topMatch": ideo_matches[0],
        "matches": ideo_matches[:4],
        "bottomIdeologyMatch": ideo_matches[-1],
        "topCountryMatch": top_country,
        "topCountryMatches": country_matches[:3],
        "topHistoricalCountryMatch": top_hist,
        "countryDimensionMatches": [
            {"dimension": "political", "match": best_country_for(POLITICAL_AXES)},
            {"dimension": "social", "match": best_country_for(SOCIAL_AXES)},
            {"dimension": "economic", "match": best_country_for(ECONOMIC_AXES)},
        ],
        "bottomCountryMatches": country_matches[-3:],
        "topPersonalityMatch": pers_matches[0],
        "personalityMatches": pers_matches[:6],
        "dimensionMatches": [
            {"dimension": "political", "match": best_pers_for(POLITICAL_AXES)},
            {"dimension": "social", "match": best_pers_for(SOCIAL_AXES)},
            {"dimension": "economic", "match": best_pers_for(ECONOMIC_AXES)},
        ],
        "categoryBestMatches": cat_best,
        "bottomPersonalityMatches": pers_matches[-3:],
        "mostUnusualAxis": unusual,
        "mostCommonAxis": common,
        "axisTension": None,
        "bookRecommendations": [],
    }


class Handler(BaseHTTPRequestHandler):
    def _send_json(self, payload: object, status: int = 200) -> None:
        raw = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(raw)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(raw)

    def do_OPTIONS(self) -> None:
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        qs = parse_qs(parsed.query)
        lang = qs.get("lang", ["en"])[0]
        if lang not in ("pt", "en", "es"):
            lang = "en"

        if parsed.path == "/api/quiz":
            variant = qs.get("variant", ["short"])[0]
            q_per_axis = 20 if variant == "extreme" else 5 if variant == "extended" else 3
            questions = get_questions(lang)
            self._send_json({
                "title": "12 Axes",
                "description": "",
                "variant": variant,
                "questionCount": q_per_axis * 12,
                "questionsPerAxis": q_per_axis,
                "axes": get_axes(lang),
                "questions": questions,
                "answerOptions": [
                    {"id": "STRONGLY_AGREE", "label": "Concordo fortemente" if lang == "pt" else "Strongly Agree", "scoreTowardAgreement": 1.0},
                    {"id": "AGREE", "label": "Concordo" if lang == "pt" else "Agree", "scoreTowardAgreement": 0.75},
                    {"id": "NEUTRAL", "label": "Neutro" if lang == "pt" else "Neutral", "scoreTowardAgreement": 0.5},
                    {"id": "DISAGREE", "label": "Discordo" if lang == "pt" else "Disagree", "scoreTowardAgreement": 0.25},
                    {"id": "STRONGLY_DISAGREE", "label": "Discordo fortemente" if lang == "pt" else "Strongly Disagree", "scoreTowardAgreement": 0.0},
                ],
                "archetypeQuestions": [
                    {
                        "id": a["id"],
                        "label": a["label"],
                        "text": a["text"],
                        "options": [{"id": o["id"], "text": o["text"]} for o in a["options"]],
                    }
                    for a in get_archetypes(lang)
                ],
            })
            return

        if parsed.path == "/api/results/by-axes":
            v_str = qs.get("v", [""])[0]
            parts = [float(x) for x in v_str.split(",") if x.strip()]
            user_vec = {AXIS_IDS[i]: (parts[i] if i < len(parts) else 50.0) for i in range(12)}
            self._send_json(compute_quiz_result(user_vec, lang))
            return

        if parsed.path == "/api/compare/catalog":
            items = []
            for p in PERSONALITIES_PT:
                items.append({
                    "type": "personality",
                    "id": p["id"],
                    "name": p["name"],
                    "caption": p.get("role", ""),
                    "imagePath": p.get("imagePath"),
                    "category": p.get("category", ""),
                    "historical": False,
                })
            for c in COUNTRIES_PT:
                items.append({
                    "type": "country",
                    "id": c["id"],
                    "name": c["name"],
                    "caption": c.get("period", ""),
                    "imagePath": c.get("flagPath"),
                    "category": c.get("category", ""),
                    "historical": bool(c.get("historical", False)),
                })
            for i in IDEOLOGIES_PT:
                items.append({
                    "type": "ideology",
                    "id": i["id"],
                    "name": i["name"],
                    "caption": i.get("category", ""),
                    "imagePath": None,
                    "category": i.get("category", ""),
                    "historical": False,
                })
            self._send_json(items)
            return

        if parsed.path == "/api/compare":
            ctype = qs.get("type", ["ideology"])[0]
            cid = qs.get("id", [""])[0]
            v_str = qs.get("v", [""])[0]
            parts = [float(x) for x in v_str.split(",") if x.strip()]
            user_vec = {AXIS_IDS[i]: (parts[i] if i < len(parts) else 50.0) for i in range(12)}
            vec = (
                PERSONALITY_VECTORS.get(cid)
                if ctype == "personality"
                else COUNTRY_VECTORS.get(cid)
                if ctype == "country"
                else IDEOLOGY_VECTORS.get(cid)
            ) or {k: 50.0 for k in AXIS_IDS}
            self._send_json({
                "item": {"type": ctype, "id": cid, "name": cid, "caption": "", "category": "Centro", "historical": False},
                "description": "",
                "compatibility": compatibility(user_vec, vec),
                "vector": vec,
            })
            return

        self._send_json({"error": "Not found"}, 404)

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        qs = parse_qs(parsed.query)
        lang = qs.get("lang", ["en"])[0]
        if lang not in ("pt", "en", "es"):
            lang = "en"

        if parsed.path == "/api/results":
            length = int(self.headers.get("Content-Length", "0"))
            body = json.loads(self.rfile.read(length).decode("utf-8")) if length > 0 else {}
            q_map = {q["id"]: q for q in QUESTIONS_PT}
            totals = {aid: [0.0, 0.0] for aid in AXIS_IDS}
            for ans in body.get("answers", []):
                q = q_map.get(ans.get("questionId"))
                if not q:
                    continue
                toward = ANSWER_SCORES.get(ans.get("answer"), 0.5)
                left_score = toward if q["agreePole"] == "LEFT" else (1.0 - toward)
                w = float(q.get("weight", 1.0))
                totals[q["axisId"]][0] += left_score * w
                totals[q["axisId"]][1] += w

            arch_choices = body.get("archetype") or {}
            arch_map = {a["id"]: a for a in ARCHETYPES_RAW}
            for qid, oid in arch_choices.items():
                aq = arch_map.get(qid)
                if not aq:
                    continue
                for opt in aq["options"]:
                    if opt["id"] == oid:
                        for aid, eff in opt["effects"].items():
                            totals[aid][0] += (float(eff) / 100.0) * 1.0
                            totals[aid][1] += 1.0

            user_vec = {
                aid: (totals[aid][0] / totals[aid][1] * 100.0 if totals[aid][1] > 0 else 50.0)
                for aid in AXIS_IDS
            }
            self._send_json(compute_quiz_result(user_vec, lang))
            return

        self._send_json({"error": "Not found"}, 404)


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", 8080), Handler)
    print("Local 12axes API server listening on http://127.0.0.1:8080", flush=True)
    server.serve_forever()
