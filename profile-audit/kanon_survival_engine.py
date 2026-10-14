"""Kanon, Psochic Hegemony (upsilon, psi), and 7x4 Survival Matrix Engine for 12axes.

Upgrades the flat 12-axis linear average and 2D Political Compass into:
  1. Psochic Hegemony (upsilon, psi) in [-2.0, +2.0] with Zone Anchors and
     0.5-Zone Perceptual Inversion Detection.
  2. The 7x4 Survival Matrix (7 Planes of Reality x 4 Systemic Scales):
       P1 (Who   / Metaphysical) -> Recognition  (tau_1 =  72h)
       P2 (What  / Possible)     -> Purpose      (tau_2 = 336h)
       P3 (Where / Physical)     -> Shelter      (tau_3 =   3h)
       P4 (Why   / Lyrical)      -> Refreshment  (tau_4 =  36h)
       P5 (How   / Logical)      -> Power        (tau_5 = 120h)
       P6 (Cause / Historical)   -> Moral        (tau_6 = 720h)
       P7 (Effect/ Emotive)      -> Sustenance   (tau_7 = 168h)
  3. Multiplicative Systemic Viability: V = prod_{p=1..7} Phi_p
  4. Plane Misidentification Error Drain: L_drain = gamma * (Phi_a - Phi_b)^2 * Phi_b
  5. Time-Delayed Dynamical Cascade Simulation along the closed loop:
       P1 -> P2 -> P5 -> P3 -> P4 -> P7 -> P6 -> P1
  6. Dual-Vector Hypocrisy Gap (Delta H) & Helxis Tensor [who, who] classification.

Usage (from repo root):
  python profile-audit/kanon_survival_engine.py <catalog> <id>
  python profile-audit/kanon_survival_engine.py --compare <cat1>:<id1> <cat2>:<id2>
  python profile-audit/kanon_survival_engine.py --benchmark
  python profile-audit/kanon_survival_engine.py --question-coverage
"""

from __future__ import annotations

import argparse
import json
import math
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "backend" / "src" / "main" / "resources" / "data"
ANSWERS_DIR = ROOT / "profile-audit" / "answers"

CATALOGS = {
    "ideology": ("ideology-profiles.json", "ideologyId", "ideologies.json"),
    "country": ("countries-profiles.json", "countryId", "countries.json"),
    "personality": ("personality-profiles.json", "personalityId", "personalities.json"),
}

# 7 Survival Planes (Survival Matrix Framework v2)
PLANES = [
    ("P1", "Metaphysical (c1_Who)", "Recognition", 72.0),
    ("P2", "Possible (c2_What)", "Purpose", 336.0),
    ("P3", "Physical (c3_Where)", "Shelter", 3.0),
    ("P4", "Lyrical (c4_Why)", "Refreshment", 36.0),
    ("P5", "Logical (c5_How)", "Power", 120.0),
    ("P6", "Historical (c6_Cause)", "Moral", 720.0),
    ("P7", "Emotive (c7_Effect)", "Sustenance", 168.0),
]

# Circular Dependency Loop: P1 -> P2 -> P5 -> P3 -> P4 -> P7 -> P6 -> P1
LOOP_ORDER = ["P1", "P2", "P5", "P3", "P4", "P7", "P6"]
UPSTREAM_DRIVER = {
    "P2": "P1",  # Recognition (c1) feeds Purpose (c2)
    "P5": "P2",  # Purpose (c2) feeds Power (c5)
    "P3": "P5",  # Power (c5) feeds Shelter (c3)
    "P4": "P3",  # Shelter (c3) feeds Refreshment (c4)
    "P7": "P4",  # Refreshment (c4) feeds Sustenance (c7)
    "P6": "P7",  # Sustenance (c7) feeds Moral (c6)
    "P1": "P6",  # Moral (c6) loops back to Recognition (c1)
}

SCORE_MAP = {"DT": 0.0, "D": 0.25, "N": 0.5, "C": 0.75, "CT": 1.0}


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def classify_question_plane_and_scale(q: dict) -> tuple[str, str]:
    """Deterministically maps each of the 240 questions in questions-pool.json
    onto its primary Survival Plane (P1..P7) and Systemic Scale (MICRO, MESO, MACRO, TOTAL).
    """
    qid = q["id"]
    axis = q["axisId"]
    text = q["text"].lower()

    # Scale classification based on operational target of the statement
    if any(w in text for w in ["planeta", "aquecimento global", "amazônia", "humanidade", "cidadão do mundo", "mercado global", "natureza", "animais"]):
        scale = "TOTAL"
    elif any(w in text for w in ["família", "pais", "filhos", "casamento", "casais", "comunidades", "bairros", "prefeituras", "municipais", "municípios", "cidades"]):
        scale = "MESO"
    elif any(w in text for w in ["adultos", "meu", "minha", "celular", "maconha", "eutanásia", "aborto", "nudez", "pornografia", "modo de vida", "vida simples"]):
        scale = "MICRO"
    else:
        scale = "MACRO"

    # Plane classification (c1_Who .. c7_Effect)
    if qid in {"economia_11", "economia_14", "economia_15", "tecnologia_11", "tecnologia_01", "representacao_12"}:
        plane = "P2"  # Purpose / Socioeconomic Mobility / Evolutionary Horizon
    elif qid in {"poder_11", "religiao_13", "moral_19", "tecnologia_02", "tecnologia_18", "estrutura_17", "controle_19"}:
        plane = "P4"  # Refreshment / Rest / Cultural & Somatic Peace
    elif qid in {"economia_07", "economia_09", "economia_04", "imigracao_12", "imigracao_08", "moral_07", "moral_18"}:
        plane = "P7"  # Sustenance / Nervous System Safety / Warmth & Cohesion
    elif axis in {"imigracao", "religiao"} or qid in {"estrutura_11", "moral_03", "poder_16"}:
        plane = "P1"  # Recognition / Identity / Personhood
    elif axis in {"estrutura", "economia", "comercio", "tecnologia"}:
        plane = "P3"  # Shelter / Physical Infrastructure / Biospheric Containment
    elif axis in {"representacao", "poder", "controle", "diplomacia"}:
        plane = "P5"  # Power / Executive Agency / Procedural Control
    else:
        plane = "P6"  # Moral / Historical Accountability / Sovereignty (moral, intervencao)

    return plane, scale


def compute_psochic_hegemony(v: dict[str, float]) -> dict:
    """Computes Psochic Hegemony (upsilon, psi) coordinates in [-2.0, +2.0],
    nearest zone anchor, and 0.5-Zone Perceptual Inversion flags from a 12-axis vector.

    Real 12axes polarity (from validate.py):
      estrutura:     0 = Unitary/Centralized     <-> 100 = Federal/Decentralized
      representacao: 0 = Autocracy               <-> 100 = Democracy
      poder:         0 = Civil Liberty           <-> 100 = Order/Surveillance/Coercion
      imigracao:     0 = Multicultural/Open      <-> 100 = Assimilationist/Closed
      diplomacia:    0 = Pacifist                <-> 100 = Militarist
      intervencao:   0 = Assertive Nationalist   <-> 100 = Non-interventionist
      economia:      0 = Private/Market          <-> 100 = Public/Collective
      controle:      0 = Free Market             <-> 100 = State Planning
      comercio:      0 = Globalist/Free Trade    <-> 100 = Protectionist
      religiao:      0 = Religious/Theocratic    <-> 100 = Irreligious/Secular
      moral:         0 = Traditionalist          <-> 100 = Progressive
      tecnologia:    0 = Biology/Naturalist      <-> 100 = Technophile/Industrial
    """
    # Normalize each axis to [-1.0, +1.0]
    dem = (v["representacao"] - 50.0) / 50.0          # +1 Democratic accountability, -1 Autocracy
    lib = (50.0 - v["poder"]) / 50.0                  # +1 Civil liberty, -1 Police surveillance
    fed = (v["estrutura"] - 50.0) / 50.0              # +1 Subsidiarity/local agency, -1 Central command
    open_id = (50.0 - v["imigracao"]) / 50.0          # +1 Universal inclusion, -1 Closed ethno/cultural border
    peace = (50.0 - v["diplomacia"]) / 50.0           # +1 Diplomacy/Peace, -1 Militarism/War
    non_imp = (v["intervencao"] - 50.0) / 50.0        # +1 Non-intervention, -1 Nationalist projection
    pub = (v["economia"] - 50.0) / 50.0               # +1 Public/shared commons, -1 Private monopoly
    plan = (v["controle"] - 50.0) / 50.0              # +1 Coordinated regulation, -1 Unregulated market
    bio = (50.0 - v["tecnologia"]) / 50.0             # +1 Ecological preservation, -1 Unchecked industrialism

    prog = (v["moral"] - 50.0) / 50.0
    sec = (v["religiao"] - 50.0) / 50.0
    prot = (v["comercio"] - 50.0) / 50.0
    tech = (v["tecnologia"] - 50.0) / 50.0
    ord_pow = (v["poder"] - 50.0) / 50.0
    unit = (50.0 - v["estrutura"]) / 50.0

    # Axis Upsilon (Morality / Scope of Benefit: +2 {Everyone} Inclusive <-> -2 {Only Me} Exclusive)
    # Scaled by 2.65 so the Quick (36-question) Quiz can reach the full ±2.00 outer corners.
    raw_upsilon = (
        0.22 * pub
        + 0.20 * dem
        + 0.18 * prog
        + 0.14 * open_id
        + 0.10 * non_imp
        + 0.08 * sec
        + 0.08 * peace
    )
    upsilon = max(-2.0, min(2.0, round(raw_upsilon * 2.65, 2)))

    # Axis Psi (Action of Will: +2 Do / Active Mobilization <-> -2 Do Not / Counteractive Withdrawal)
    raw_psi = (
        0.30 * plan
        + 0.25 * tech
        + 0.15 * prot
        + 0.15 * unit
        + 0.15 * ord_pow
    )
    psi = max(-2.0, min(2.0, round(raw_psi * 2.65, 2)))

    # Zone Anchor classification
    if abs(upsilon) < 0.20 and abs(psi) < 0.20:
        zone = "Center Origin (0, 0) — Neutral / Stasis"
    elif upsilon >= 1.25 and psi >= 1.25:
        zone = "Systemic / Productive Justice (+2, +2)"
    elif upsilon <= -1.25 and psi <= -1.25:
        zone = "Tyranny / Pure Extraction (-2, -2)"
    elif upsilon >= 0.0 and psi >= 0.0:
        zone = "Greater Good (+1, +1) — Productive Altruism"
    elif upsilon < 0.0 and psi >= 0.0:
        zone = "Greatest Lie (-1, +1) — Coercive / Tribal Vanguardism"
    elif upsilon >= 0.0 and psi < 0.0:
        zone = "Lesser Good (+1, -1) — Passive / Unprotected Idealism"
    else:
        zone = "Greater Evil (-1, -1) — Extractive / Regressive Hierarchy"

    # Perceptual Inversion Detection (The 0.5 Zone Warning)
    inversions = []
    if v["economia"] < 25.0 and v["controle"] < 25.0 and v["poder"] > 60.0:
        inversions.append(
            "EXTRACTION AS STRENGTH/LIBERTY: Combines deregulated private wealth (economia/controle < 25) "
            "with high state police coercion (poder > 60). Privatizes gains while socializing repression."
        )
    if (v["moral"] < 25.0 or v["religiao"] < 25.0) and v["poder"] > 70.0:
        inversions.append(
            "CRUELTY AS MORAL PROTECTION: Uses police surveillance and state punishment (poder > 70) "
            "to enforce traditional/religious conformity (moral/religiao < 25)."
        )
    if v["representacao"] < 30.0 and v["poder"] > 70.0 and v["economia"] > 65.0:
        inversions.append(
            "TYRANNY AS COLLECTIVE CARE: Claims public economic ownership (economia > 65) while "
            "stripping workers of democratic representation (< 30) and civil liberty (poder > 70)."
        )
    if v["economia"] < 20.0 and v["poder"] < 25.0 and v["controle"] < 20.0:
        inversions.append(
            "ABANDONMENT AS FREEDOM: Eliminates state coercion (poder < 25) but strips all public "
            "shelter and sustenance buffers (economia/controle < 20), leaving the vulnerable to market attrition."
        )

    return {
        "upsilon": upsilon,
        "psi": psi,
        "zone": zone,
        "inversions": inversions,
    }


def compute_survival_matrix(v: dict[str, float]) -> dict:
    """Computes the 7 Survival Plane Capacitances (Phi_1 .. Phi_7 in [0, 1]),
    Entropy Coefficients (alpha_p in [-1, 1]), Multiplicative Systemic Viability (V),
    Plane Misidentification Error Drain (L_drain), and a 639-hour Cascade Trace.
    """
    # Raw plane capacities T_p in [0, 1] and alignment coefficients alpha_p
    # P1: Recognition (Who) — Sovereign personhood, cultural dignity, freedom of conscience
    p1_raw = (
        0.35 * (v["representacao"] / 100.0)
        + 0.35 * ((100.0 - v["poder"]) / 100.0)
        + 0.20 * (1.0 - abs(v["imigracao"] - 40.0) / 60.0)
        + 0.10 * (1.0 - abs(v["religiao"] - 55.0) / 55.0)
    )
    # P2: Purpose (What) — Socioeconomic mobility, local initiative, future trajectory horizon
    p2_raw = (
        0.35 * (v["representacao"] / 100.0)
        + 0.25 * (v["estrutura"] / 100.0)
        + 0.25 * (1.0 - abs(v["economia"] - 65.0) / 65.0)
        + 0.15 * (1.0 - abs(v["tecnologia"] - 55.0) / 55.0)
    )
    # P3: Shelter (Where) — Physical infrastructure, basic material containment, biospheric habitability
    # Extreme laissez-faire (economia -> 0) destroys social shelter; extreme technophilia (tecnologia -> 100)
    # strip-mines the biosphere.
    p3_raw = (
        0.40 * (1.0 - abs(v["economia"] - 70.0) / 70.0)
        + 0.30 * ((100.0 - v["tecnologia"]) / 100.0)
        + 0.15 * (1.0 - abs(v["comercio"] - 55.0) / 55.0)
        + 0.15 * (1.0 - abs(v["controle"] - 65.0) / 65.0)
    )
    # P4: Refreshment (Why) — Somatic rest, peace from war/curfews, cultural breathing room
    p4_raw = (
        0.40 * ((100.0 - v["poder"]) / 100.0)
        + 0.35 * ((100.0 - v["diplomacia"]) / 100.0)
        + 0.25 * (v["estrutura"] / 100.0)
    )
    # P5: Power (How) — Executive agency, democratic franchise, absence of arbitrary coercion
    p5_raw = (
        0.45 * (v["representacao"] / 100.0)
        + 0.35 * ((100.0 - v["poder"]) / 100.0)
        + 0.20 * (v["estrutura"] / 100.0)
    )
    # P6: Moral (Cause) — Rule of law, non-aggression, historical/judicial accountability
    p6_raw = (
        0.35 * (v["representacao"] / 100.0)
        + 0.30 * ((100.0 - v["poder"]) / 100.0)
        + 0.20 * (v["intervencao"] / 100.0)
        + 0.15 * ((100.0 - v["diplomacia"]) / 100.0)
    )
    # P7: Sustenance (Effect) — Nervous system safety, social cohesion, protection from poverty & war
    p7_raw = (
        0.40 * (v["economia"] / 100.0)
        + 0.30 * ((100.0 - v["poder"]) / 100.0)
        + 0.30 * ((100.0 - v["diplomacia"]) / 100.0)
    )

    phi = {
        "P1": round(max(0.01, min(1.0, p1_raw)), 3),
        "P2": round(max(0.01, min(1.0, p2_raw)), 3),
        "P3": round(max(0.01, min(1.0, p3_raw)), 3),
        "P4": round(max(0.01, min(1.0, p4_raw)), 3),
        "P5": round(max(0.01, min(1.0, p5_raw)), 3),
        "P6": round(max(0.01, min(1.0, p6_raw)), 3),
        "P7": round(max(0.01, min(1.0, p7_raw)), 3),
    }

    # Entropy coefficient alpha_p in [-1, +1] (Virtue superconductor vs. Sin sink)
    alpha = {p: round(2.0 * val - 1.0, 2) for p, val in phi.items()}

    # Multiplicative Systemic Viability: V = prod_{p=1..7} Phi_p
    viability_product = 1.0
    for val in phi.values():
        viability_product *= val
    # Also compute geometric mean (normalized 0..100%) so human readers can compare alongside product
    viability_geomean = viability_product ** (1.0 / 7.0)

    # Plane Misidentification Error Drain: L_drain = gamma * (Phi_a - Phi_b)^2 * Phi_b
    # Checks classic institutional mismatches where an inflated control/hardware axis
    # substitutes for a starved survival plane.
    gamma = 1.0
    misidentifications = []

    # 1. Bureaucratic/Police Coercion (poder/controle) substituting for Recognition (P1) or Moral (P6)
    coercive_effort = (v["poder"] / 100.0 + (100.0 - v["representacao"]) / 100.0) / 2.0
    if coercive_effort > 0.60 and phi["P1"] < 0.45:
        l_drain = gamma * ((phi["P1"] - coercive_effort) ** 2) * coercive_effort
        misidentifications.append({
            "type": "P5 (Coercive Control) -> P1 (Metaphysical Recognition)",
            "l_drain": round(l_drain, 3),
            "diagnosis": "Attempts to manufacture identity/obedience via surveillance & autocracy, draining Shelter (P3) & Refreshment (P4).",
        })

    # 2. Unregulated Market Competition substituting for Physical Shelter (P3) & Sustenance (P7)
    market_dogma = ((100.0 - v["economia"]) / 100.0 + (100.0 - v["controle"]) / 100.0) / 2.0
    if market_dogma > 0.70 and phi["P7"] < 0.50:
        l_drain = gamma * ((phi["P7"] - market_dogma) ** 2) * market_dogma
        misidentifications.append({
            "type": "P5 (Market Deregulation) -> P3/P7 (Shelter & Sustenance)",
            "l_drain": round(l_drain, 3),
            "diagnosis": "Treats unregulated price signaling as a substitute for biological containment and healthcare/water access.",
        })

    # 3. Techno-Industrial Acceleration substituting for Ecological Shelter (P3) & Lyrical Rest (P4)
    tech_push = v["tecnologia"] / 100.0
    if tech_push > 0.70 and phi["P3"] < 0.55:
        l_drain = gamma * ((phi["P3"] - tech_push) ** 2) * tech_push
        misidentifications.append({
            "type": "P3/P5 (Techno-Industrial Push) -> P3/P4 (Biospheric Shelter & Rest)",
            "l_drain": round(l_drain, 3),
            "diagnosis": "Attempts to solve ecological and neurological exhaustion with heavier industrial/transhumanist hardware.",
        })

    # Dynamical Cascade Simulation over 639 hours (dt = 1 hour)
    # dPhi_p/dt = (1 / tau_p) * [ max(0, alpha_p * Phi_{p_prev}(t)) - Phi_p(t) ]
    tau = {p[0]: p[3] for p in PLANES}
    state = dict(phi)
    checkpoints = [0, 3, 39, 111, 231, 303, 639]
    trace = {}
    dt = 1.0
    for hour in range(0, 640):
        if hour in checkpoints:
            v_now = 1.0
            for val in state.values():
                v_now *= val
            trace[hour] = {
                "phi": {k: round(val, 3) for k, val in state.items()},
                "V_geomean": round((v_now ** (1.0 / 7.0)) * 100.0, 1),
            }
        next_state = {}
        for p in LOOP_ORDER:
            prev_p = UPSTREAM_DRIVER[p]
            # Effective transfer coefficient in [0, 1]
            transfer = max(0.0, phi[p])
            target = transfer * state[prev_p]
            d_phi = (dt / tau[p]) * (target - state[p])
            next_state[p] = max(0.0, min(1.0, state[p] + d_phi))
        state = next_state

    weakest_plane = min(phi.items(), key=lambda item: item[1])

    return {
        "phi": phi,
        "alpha": alpha,
        "viability_product": round(viability_product, 5),
        "viability_percent": round(viability_geomean * 100.0, 1),
        "weakest_plane": weakest_plane,
        "misidentifications": misidentifications,
        "cascade_trace": trace,
    }


def load_catalog_entry(catalog: str, pid: str) -> tuple[dict, dict[str, float]]:
    if catalog not in CATALOGS:
        raise ValueError(f"Unknown catalog '{catalog}'. Valid: {list(CATALOGS)}")
    prof_file, key_field, meta_file = CATALOGS[catalog]
    profiles = {p[key_field]: p["vector"] for p in load_json(DATA / prof_file)}
    metas = {m["id"]: m for m in load_json(DATA / meta_file)}
    if pid not in profiles:
        raise KeyError(f"Profile '{pid}' not found in {prof_file}")
    return metas.get(pid, {"id": pid, "name": pid}), profiles[pid]


def print_profile_audit(catalog: str, pid: str) -> None:
    meta, vec = load_catalog_entry(catalog, pid)
    ph = compute_psochic_hegemony(vec)
    sm = compute_survival_matrix(vec)

    print("=" * 78)
    print(f"KANON & 7x4 SURVIVAL MATRIX AUDIT — {catalog.upper()}: {meta.get('name')} ({pid})")
    if meta.get("category"):
        print(f"Registered Category: {meta['category']}")
    if meta.get("description"):
        print(f"Description: {meta['description']}")
    print("=" * 78)

    print("\n[1] PSOCHIC HEGEMONY COORDINATES (upsilon, psi)")
    print(f"  Coordinate  : (upsilon: {ph['upsilon']:+.2f}, psi: {ph['psi']:+.2f})")
    print(f"  Zone Anchor : {ph['zone']}")
    if ph["inversions"]:
        print("  0.5-Zone Perceptual Inversion Flags:")
        for inv in ph["inversions"]:
            print(f"    ! {inv}")
    else:
        print("  0.5-Zone Perceptual Inversion Flags: None detected.")

    print("\n[2] THE 7x4 SURVIVAL MATRIX CAPACITANCES (Phi_1 .. Phi_7)")
    print(f"  {'Plane':<6} {'Domain':<24} {'Target Body':<14} {'Phi_p':>7} {'alpha_p':>8} {'tau_p':>8}")
    print("  " + "-" * 70)
    for code, domain, body, tau_h in PLANES:
        p_val = sm["phi"][code]
        a_val = sm["alpha"][code]
        flag = " <-- BOTTLENECK" if code == sm["weakest_plane"][0] else ""
        print(f"  {code:<6} {domain:<24} {body:<14} {p_val:>7.3f} {a_val:>+8.2f} {tau_h:>6.0f}h{flag}")

    print(f"\n  Multiplicative Viability Product (V = prod Phi_p) : {sm['viability_product']:.5f}")
    print(f"  Systemic Viability Index (Geometric Mean)         : {sm['viability_percent']:.1f}%")

    print("\n[3] PLANE MISIDENTIFICATION ERRORS (L_drain)")
    if sm["misidentifications"]:
        for m in sm["misidentifications"]:
            print(f"  ! {m['type']}  [L_drain = {m['l_drain']:.3f}]")
            print(f"    -> {m['diagnosis']}")
    else:
        print("  None above critical drain threshold.")

    print("\n[4] DYNAMICAL CASCADE TRACE (t = 0h -> 639h Closed Loop Decay)")
    print("  Loop: P1(Who) -> P2(What) -> P5(How) -> P3(Where) -> P4(Why) -> P7(Effect) -> P6(Cause) -> P1")
    print(f"  {'Time':>6} | {'P1':>5} {'P2':>5} {'P5':>5} {'P3':>5} {'P4':>5} {'P7':>5} {'P6':>5} | {'Viability':>9}")
    print("  " + "-" * 64)
    for h, snap in sm["cascade_trace"].items():
        p = snap["phi"]
        print(
            f"  {h:>4}h | {p['P1']:>5.2f} {p['P2']:>5.2f} {p['P5']:>5.2f} "
            f"{p['P3']:>5.2f} {p['P4']:>5.2f} {p['P7']:>5.2f} {p['P6']:>5.2f} | "
            f"{snap['V_geomean']:>8.1f}%"
        )


def compare_profiles(first_spec: str, second_spec: str) -> None:
    cat1, id1 = first_spec.split(":", 1)
    cat2, id2 = second_spec.split(":", 1)
    meta1, vec1 = load_catalog_entry(cat1, id1)
    meta2, vec2 = load_catalog_entry(cat2, id2)
    ph1, ph2 = compute_psochic_hegemony(vec1), compute_psochic_hegemony(vec2)
    sm1, sm2 = compute_survival_matrix(vec1), compute_survival_matrix(vec2)

    diffs = {k: abs(vec1[k] - vec2[k]) for k in vec1}
    delta_h_axes = sum(diffs.values()) / len(diffs)
    delta_h_coord = math.hypot(ph1["upsilon"] - ph2["upsilon"], ph1["psi"] - ph2["psi"])

    print("=" * 78)
    print(f"DUAL-VECTOR / HYPOCRISY GAP (Delta H) COMPARISON")
    print(f"  Profile A (Ideal / Reference) : {meta1.get('name')} ({cat1}:{id1})")
    print(f"  Profile B (Actual / Target)   : {meta2.get('name')} ({cat2}:{id2})")
    print("=" * 78)
    print(f"  Profile A Coordinate : (upsilon: {ph1['upsilon']:+.2f}, psi: {ph1['psi']:+.2f}) -> {ph1['zone']}")
    print(f"  Profile B Coordinate : (upsilon: {ph2['upsilon']:+.2f}, psi: {ph2['psi']:+.2f}) -> {ph2['zone']}")
    print(f"  Psochic Distance     : Delta H_(u,psi) = {delta_h_coord:.2f} (on 4x4 grid)")
    print(f"  12-Axis Mean Gap     : Delta H_12      = {delta_h_axes:.1f}%")
    print(f"  Viability Shift      : {sm1['viability_percent']:.1f}% -> {sm2['viability_percent']:.1f}%")

    # Helxis Tensor Classification
    du = ph2["upsilon"] - ph1["upsilon"]
    if ph1["upsilon"] > 0.3 and ph2["upsilon"] < -0.2:
        helxis = "THE FALL [me, me] — 'For You, but Only for Me' (Bait-and-Switch Extraction)"
    elif ph1["upsilon"] > 0.3 and du < -0.35:
        helxis = "DELUSION [you, me] — 'Me and You, but Really for Me' (Partnership Cover)"
    elif ph1["upsilon"] > 0.3 and ph2["upsilon"] > 0.3:
        helxis = "GRACE [me, you] — 'For You, Me, and Everyone' (Aligned Mutual Benefit)"
    else:
        helxis = "REDEMPTION / OVERT [me, you] — Unmasked Self/Group Interest"
    print(f"  Helxis Tensor        : {helxis}")

    top_gaps = sorted(diffs.items(), key=lambda x: x[1], reverse=True)[:4]
    print("  Largest Axis Divergences:")
    for ax, gap in top_gaps:
        print(f"    - {ax:<15}: {vec1[ax]:>5.1f} vs {vec2[ax]:>5.1f}  (Delta = {gap:>5.1f})")


def run_question_coverage() -> None:
    questions = load_json(DATA / "questions-pool.json")
    matrix = {p[0]: {"MICRO": 0, "MESO": 0, "MACRO": 0, "TOTAL": 0} for p in PLANES}
    for q in questions:
        plane, scale = classify_question_plane_and_scale(q)
        matrix[plane][scale] += 1

    print("=" * 78)
    print("240-QUESTION POOL AUDIT ACROSS THE 7x4 SURVIVAL MATRIX")
    print("=" * 78)
    print(f"{'Plane':<6} {'Requirement':<14} | {'MICRO':>7} {'MESO':>7} {'MACRO':>7} {'TOTAL':>7} | {'Sum':>5} {'Share':>7}")
    print("-" * 78)
    total_q = len(questions)
    scale_totals = {"MICRO": 0, "MESO": 0, "MACRO": 0, "TOTAL": 0}
    for code, _domain, body, _tau in PLANES:
        row = matrix[code]
        r_sum = sum(row.values())
        for s in scale_totals:
            scale_totals[s] += row[s]
        print(
            f"{code:<6} {body:<14} | {row['MICRO']:>7} {row['MESO']:>7} "
            f"{row['MACRO']:>7} {row['TOTAL']:>7} | {r_sum:>5} {100.0 * r_sum / total_q:>6.1f}%"
        )
    print("-" * 78)
    print(
        f"{'TOTAL':<21} | {scale_totals['MICRO']:>7} {scale_totals['MESO']:>7} "
        f"{scale_totals['MACRO']:>7} {scale_totals['TOTAL']:>7} | {total_q:>5} 100.0%"
    )


def run_benchmark() -> None:
    """Demonstrates how Psochic Hegemony (upsilon, psi) and the 7x4 Survival Matrix
    separate the exact ideologies that 12axes's 2D compass conflated in BUSSOLA_VS_CATEGORIA.md.
    """
    print("=" * 78)
    print("BENCHMARK: RESOLVING 12AXES COMPASS FAILURES (BUSSOLA_VS_CATEGORIA.md)")
    print("=" * 78)
    showcase = [
        # Ideologies that 12axes's 2D Compass threw into "Radical Left" or "Third Position" together:
        "comunismo-de-conselhos",
        "social-democracia-nordica",
        "comunismo",
        "cameralismo",
        "platonismo",
        "monarquismo-absoluto",
        "capitalismo-autoritario",
        "anarcocapitalismo",
    ]
    print(
        f"{'Ideology ID':<26} {'Cat (12axes)':<17} {'(upsilon, psi)':<16} "
        f"{'Viability':>9} {'Weakest':>8} {'Psochic Zone'}"
    )
    print("-" * 110)
    for iid in showcase:
        try:
            meta, vec = load_catalog_entry("ideology", iid)
        except KeyError:
            continue
        ph = compute_psochic_hegemony(vec)
        sm = compute_survival_matrix(vec)
        coord_str = f"({ph['upsilon']:+.2f}, {ph['psi']:+.2f})"
        weak_str = f"{sm['weakest_plane'][0]}={sm['weakest_plane'][1]:.2f}"
        print(
            f"{iid:<26} {meta.get('category', ''):<17} {coord_str:<16} "
            f"{sm['viability_percent']:>8.1f}% {weak_str:>8} {ph['zone']}"
        )


def main() -> int:
    sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description="Kanon, Psochic Hegemony & 7x4 Survival Matrix Engine for 12axes.")
    parser.add_argument("catalog", nargs="?", help="ideology | country | personality")
    parser.add_argument("id", nargs="?", help="Profile ID")
    parser.add_argument("--compare", nargs=2, metavar=("CAT1:ID1", "CAT2:ID2"), help="Compare two profiles (Delta H & Helxis)")
    parser.add_argument("--benchmark", action="store_true", help="Run benchmark on BUSSOLA_VS_CATEGORIA.md anomalies")
    parser.add_argument("--question-coverage", action="store_true", help="Audit 240 questions across 7x4 Survival Matrix")
    args = parser.parse_args()

    if args.question_coverage:
        run_question_coverage()
        return 0
    if args.benchmark:
        run_benchmark()
        return 0
    if args.compare:
        compare_profiles(args.compare[0], args.compare[1])
        return 0
    if args.catalog and args.id:
        print_profile_audit(args.catalog, args.id)
        return 0

    parser.print_help()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
