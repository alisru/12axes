import type { AxisResult } from '../types/quiz';
import type { IdeologyColorKey } from './ideologyColors';

/** Posição do usuário na bússola política, cada valor de 0 a 100. */
export interface CompassPosition {
  /** 0 = esquerda, 100 = direita. */
  right: number;
  /** 0 = libertário, 100 = autoritário. */
  authoritarian: number;
  /** 0 = progressista, 100 = tradicionalista. */
  traditional: number;
}

export type HegemonyQuadrantKey = 'productive' | 'reductive' | 'constructive' | 'regressive';
export type HegemonyAnchorKey =
  | 'systemicJustice'
  | 'greaterGood'
  | 'greatestLie'
  | 'lesserGood'
  | 'greaterEvil'
  | 'pureExtraction'
  | 'goodPreference'
  | 'badPreference'
  | 'confusionZone';
export type DefinitionModeKey = 'willBe' | 'cantBe' | 'mayBe' | 'wontBe';
export type HelxisKey = 'forEveryone' | 'forYouOnlyMe' | 'meAndYouForMe' | 'forMeOnlyMe';
export type TrajectoryKey = 'redemption' | 'regression';
export type InversionFlagKey =
  | 'extractionAsStrength'
  | 'serviceAsBurden'
  | 'stabilityAsRot'
  | 'crueltyAsProtection';

export interface PsochicHegemonyPosition {
  /** Eixo υ (Moralidade — Quem se beneficia?): +2 = Todos ({Everyone}), 0 = Ninguém, -2 = Só Eu (Only Me). */
  upsilon: number;
  /** Eixo ψ (Vontade — O que a energia faz?): +2 = Criar/Agir (Do), -2 = Extrair/Suprimir (Do Not). */
  psi: number;
  /** Vetor unitário de deslocamento (crawl direction) sobre a Hegemonia maior a partir do estado IS. */
  crawlAngleDeg: number;
  crawlMagnitude: number;
  quadrant: HegemonyQuadrantKey;
  anchor: HegemonyAnchorKey;
  definitionMode: DefinitionModeKey;
  helxis: HelxisKey;
  /** Model 3 (Helxis Tensor): ||F_f - F_t|| — Distância entre o discurso econômico/social e o efeito real de poder. */
  contradictionScore: number;
  /** Model 4 (Worldview Integrity): Distância euclidiana até a Força Moral Ideal (+2υ, +2ψ) e integridade W ∈ [0, 1]. */
  idealDistance: number;
  worldviewIntegrity: number;
  /** Model 6 (Trajectory Analysis): 'redemption' (Caminho do Esclarecimento) vs 'regression' (Caminho para o Nada). */
  trajectory: TrajectoryKey;
  inInversionZone: boolean;
  inversions: InversionFlagKey[];
}

export interface PlaneMetric {
  id: 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6' | 'P7';
  phi: number;
  alpha: number;
}

export interface SurvivalMatrixPosition {
  planes: PlaneMetric[];
  viability: number;
  viable: boolean;
  weakestPlane: PlaneMetric['id'];
  totalDrain: number;
  cascadeFinalMean: number;
  initialPotential: number;
  finalPotential: number;
  potentialDelta: number;
  potentialGrowing: boolean;
}

const mean = (values: number[]): number => values.reduce((sum, value) => sum + value, 0) / values.length;
const clampRange = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));

// Pesos calibrados com a Geometria das Definições (Inclusivo/Exclusivo × Ativo/Contra-ativo):
// - Eixos econômicos: `economia` (propriedade), `controle` (planejamento vs mercado) e `comercio`
//   (protecionismo vs livre comércio).
// - Eixos sociais/culturais: `imigracao` (assimilação vs multiculturalismo) e `moral` (progressista
//   vs tradicionalista).
// - Correção corporativista/teocrática (Geometria das Definições): quando alto planejamento estatal
//   (`controle > 52`) se combina com forte exclusivismo tradicionalista/nacionalista (`excl > 58`)
//   sem abolição da propriedade privada (`economia < 75`), o Estado opera em modo Redutivo/Regressivo
//   ("Only My Group" / Terceira Posição / Extrema Direita), impedindo que Fascismo, Falangismo ou
//   Teocracia caiam na Esquerda Radical.
const WEIGHT_ECONOMIA = 0.21;
const WEIGHT_CONTROLE = 0.25;
const WEIGHT_COMERCIO = 0.18;
const WEIGHT_IMIGRACAO = 0.22;
const WEIGHT_MORAL = 0.10;
const WEIGHT_CULTURAL_EXTRA = 0.04;

const GAIN_LEFT = 1.75;
const GAIN_RIGHT = 2.55;

function stretch(average: number): number {
  const distance = average - 50;
  const gain = distance < 0 ? GAIN_LEFT : GAIN_RIGHT;
  return 50 + 50 * Math.tanh((distance * gain) / 50);
}

/**
 * Compõe a bússola a partir dos eixos do quiz.
 * Devolve null se algum dos 8 eixos base faltar no resultado.
 */
export function computeCompass(results: Map<string, AxisResult>): CompassPosition | null {
  const left = (axisId: string): number | null => results.get(axisId)?.leftPercent ?? null;
  const ids = ['economia', 'controle', 'comercio', 'imigracao', 'moral', 'poder', 'representacao', 'estrutura'] as const;
  const values: Record<string, number> = {};
  for (const id of ids) {
    const value = left(id);
    if (value === null) return null;
    values[id] = value;
  }
  const religiao = left('religiao') ?? 50;
  const diplomacia = left('diplomacia') ?? 50;
  const intervencao = left('intervencao') ?? 50;

  const culturalExtra = 0.45 * (100 - religiao) + 0.35 * diplomacia + 0.20 * (100 - intervencao);
  const exclusivity =
    0.38 * (100 - values.moral) +
    0.28 * values.imigracao +
    0.14 * (100 - religiao) +
    0.12 * diplomacia +
    0.08 * (100 - intervencao);

  let rawRight =
    WEIGHT_ECONOMIA * (100 - values.economia) +
    WEIGHT_CONTROLE * (100 - values.controle) +
    WEIGHT_COMERCIO * (100 - values.comercio) +
    WEIGHT_IMIGRACAO * values.imigracao +
    WEIGHT_MORAL * (100 - values.moral) +
    WEIGHT_CULTURAL_EXTRA * culturalExtra;

  // Correção Redutiva/Regressiva (Terceira Posição / Corporativismo / Teocracia):
  // Planejamento estatal a serviço de hierarquia exclusiva ("was like" / "Only My Group")
  // desloca a coordenada horizontal da esquerda radical para o centro-direita autoritário.
  if (exclusivity > 58 && values.controle > 52 && values.economia < 75) {
    const exclFactor = (exclusivity - 58) / 42;
    const ctrlFactor = (values.controle - 52) / 48;
    const propFactor = values.economia < 60 ? 11.5 : 6.0;
    rawRight += exclFactor * ctrlFactor * propFactor;
  }

  return {
    right: stretch(rawRight),
    authoritarian: mean([values.poder, 100 - values.representacao, 100 - values.estrutura]),
    traditional: 100 - values.moral
  };
}

export type SocialKey = 'veryProgressive' | 'progressive' | 'moderate' | 'traditional' | 'veryTraditional';

export function socialLevel(traditional: number): SocialKey {
  if (traditional < 20) return 'veryProgressive';
  if (traditional < 40) return 'progressive';
  if (traditional <= 60) return 'moderate';
  if (traditional <= 80) return 'traditional';
  return 'veryTraditional';
}

const GRID_SIZE = 9;

const toCell = (percent: number): number => Math.max(0, Math.min(GRID_SIZE - 1, Math.floor((percent / 100) * GRID_SIZE)));

/**
 * Região da grade da bússola em que a posição cai.
 * Usa `traditional` quando disponível para separar regimes teocráticos/fascistas (`traditional >= 72`)
 * da Esquerda Radical na faixa superior autoritária.
 */
export function compassRegion({ right, authoritarian, traditional = 50 }: CompassPosition): IdeologyColorKey {
  const column = toCell(right);
  const row = toCell(100 - authoritarian);
  if (row <= 2 || (authoritarian >= 62 && right < 28)) {
    if (right < 28 || (column <= 2 && traditional < 72)) return 'esq-radical';
    if (column <= 4 || (column === 5 && right < 56)) return 'terceira';
    return 'ext-direita';
  }
  if (row <= 6) {
    return column <= 2 ? 'esquerda' : column <= 5 ? 'centro' : 'direita';
  }
  if (column <= 3) return 'anarquismo';
  if (column >= 5) return 'libertario';
  return right < 50 ? 'anarquismo' : 'libertario';
}

export function centerSide(first: IdeologyColorKey, second: IdeologyColorKey): 'esquerda' | 'direita' | null {
  if (first === second) return null;
  const keys = [first, second];
  if (!keys.includes('centro')) return null;
  if (keys.includes('esquerda')) return 'esquerda';
  if (keys.includes('direita')) return 'direita';
  return null;
}

/**
 * Calcula a coordenada na Hegemonia Psóquica (υ, ψ) em [-2, +2], o Quadrante da Geometria das
 * Definições (will be / can't be / may be / won't be), o Vetor Helxis ([who, who]) e os alertas
 * da Zona de Inversão Perceptual (0.5 Zone).
 */
export function computePsochicHegemony(results: Map<string, AxisResult>): PsochicHegemonyPosition | null {
  const v = (id: string, fallback = 50): number => results.get(id)?.leftPercent ?? fallback;
  if (!results.has('economia') || !results.has('poder') || !results.has('moral')) {
    return null;
  }

  const est = v('estrutura');
  const rep = v('representacao');
  const pod = v('poder');
  const imi = v('imigracao');
  const dip = v('diplomacia');
  const intv = v('intervencao');
  const eco = v('economia');
  const con = v('controle');
  const com = v('comercio');
  const rel = v('religiao');
  const mor = v('moral');
  const tec = v('tecnologia');

  // υ (Moralidade — Quem se beneficia?): +2 = Todos ({Everyone} · Inclusivo), -2 = Só Eu ({Only Me} · Exclusivo)
  // Multiplicador 2.65 garante que o quiz rápido (3 perguntas + 1 arquétipo, máx ~88-92%) alcance ±2.00.
  const upsilonRaw =
    0.22 * ((eco - 50) / 50) +
    0.20 * ((rep - 50) / 50) +
    0.18 * ((mor - 50) / 50) +
    0.14 * (((100 - imi) - 50) / 50) +
    0.10 * ((intv - 50) / 50) +
    0.08 * ((rel - 50) / 50) +
    0.08 * (((100 - dip) - 50) / 50);
  const upsilon = Number(clampRange(upsilonRaw * 2.65, -2.0, 2.0).toFixed(2));

  // ψ (Vontade — O que a energia faz?): +2 = Do (Ativo: planejar, construir, acelerar, mobilizar),
  // -2 = Do Not (Contra-ativo: reter, desregulamentar, retrair, descentralizar).
  const psiRaw =
    0.30 * ((con - 50) / 50) +
    0.25 * ((tec - 50) / 50) +
    0.15 * ((com - 50) / 50) +
    0.15 * (((100 - est) - 50) / 50) +
    0.15 * ((pod - 50) / 50);
  const psi = Number(clampRange(psiRaw * 2.65, -2.0, 2.0).toFixed(2));

  const quadrant: HegemonyQuadrantKey =
    upsilon >= 0 && psi >= 0
      ? 'productive'
      : upsilon < 0 && psi >= 0
        ? 'reductive'
        : upsilon >= 0 && psi < 0
          ? 'constructive'
          : 'regressive';

  const definitionMode: DefinitionModeKey =
    quadrant === 'productive'
      ? 'willBe'
      : quadrant === 'reductive'
        ? 'cantBe'
        : quadrant === 'constructive'
          ? 'mayBe'
          : 'wontBe';

  const helxis: HelxisKey =
    upsilon >= 0.45
      ? 'forEveryone'
      : upsilon >= 0
        ? 'forYouOnlyMe'
        : psi >= 0
          ? 'meAndYouForMe'
          : 'forMeOnlyMe';

  let anchor: HegemonyAnchorKey;
  if (Math.abs(upsilon) < 0.25 && Math.abs(psi) < 0.25) {
    anchor = 'confusionZone';
  } else if (upsilon >= 1.25 && psi >= 1.25) {
    anchor = 'systemicJustice';
  } else if (upsilon <= -1.25 && psi <= -1.25) {
    anchor = 'pureExtraction';
  } else if (Math.abs(psi) < 0.35 && upsilon >= 0.35) {
    anchor = 'goodPreference';
  } else if (Math.abs(psi) < 0.35 && upsilon <= -0.35) {
    anchor = 'badPreference';
  } else if (upsilon >= 0 && psi >= 0) {
    anchor = 'greaterGood';
  } else if (upsilon < 0 && psi >= 0) {
    anchor = 'greatestLie';
  } else if (upsilon >= 0 && psi < 0) {
    anchor = 'lesserGood';
  } else {
    anchor = 'greaterEvil';
  }

  const inInversionZone =
    (Math.abs(upsilon) <= 0.75 && Math.abs(psi) <= 0.75) || (upsilon < -0.15 && psi > 0.15);
  const inversions: InversionFlagKey[] = [];
  if (pod > 62 && rep < 45) {
    inversions.push('extractionAsStrength');
  }
  if (eco < 32 && con < 32 && upsilon < 0.15) {
    inversions.push('serviceAsBurden');
  }
  if ((100 - intv > 60 && dip > 60) || tec > 82 || tec < 18) {
    inversions.push('stabilityAsRot');
  }
  if (imi > 65 && mor < 38) {
    inversions.push('crueltyAsProtection');
  }

  // No mapa 2D: +υ aponta para a esquerda (-X visual) e +ψ aponta para cima (-Y visual).
  const crawlAngleDeg = Number(((Math.atan2(-psi, -upsilon) * 180) / Math.PI).toFixed(1));
  const crawlMagnitude = Number(Math.min(2.83, Math.hypot(upsilon, psi)).toFixed(2));

  // Model 3 (Helxis Tensor Contradiction Score = ||F_f - F_t||):
  // Compara a promessa econômica/social de benefício ("The Cover": economia coletiva ou liberdade formal)
  // com o efeito estrutural real de poder e inclusão ("True Intent": democracia direta vs concentração de poder/exclusão).
  const framedUpsilon = clampRange(
    ((0.55 * (eco - 50) + 0.45 * (con - 50)) / 50) * 2.4,
    -2.0,
    2.0
  );
  const actualPowerUpsilon = clampRange(
    ((0.40 * (rep - 50) + 0.35 * ((100 - pod) - 50) + 0.25 * ((100 - imi) - 50)) / 50) * 2.4,
    -2.0,
    2.0
  );
  const contradictionScore = Number(Math.abs(framedUpsilon - actualPowerUpsilon).toFixed(2));

  // Model 4 (Worldview Integrity Simulation):
  // Distância até a Força Moral Ideal F_m = (+2υ, +2ψ) e integridade W ∈ [0, 1] (poluição por mentiras/extração).
  const idealDistance = Number(Math.hypot(2.0 - upsilon, 2.0 - psi).toFixed(2));
  const pollution = clampRange(
    Math.max(0, -upsilon) * 0.28 + contradictionScore * 0.14 + Math.max(0, -psi) * 0.08,
    0,
    0.95
  );
  const worldviewIntegrity = Number((1.0 - pollution).toFixed(2));

  // Model 6 (Trajectory Analysis — Path to Enlightenment / Redemption vs Path to Nowhere / Regression):
  const trajectory: TrajectoryKey = upsilon >= 0 && (psi >= -0.35 || worldviewIntegrity >= 0.72) ? 'redemption' : 'regression';

  return {
    upsilon,
    psi,
    crawlAngleDeg,
    crawlMagnitude,
    quadrant,
    anchor,
    definitionMode,
    helxis,
    contradictionScore,
    idealDistance,
    worldviewIntegrity,
    trajectory,
    inInversionZone,
    inversions
  };
}

/**
 * Calcula a Matriz de Sobrevivência 7×4 (Capacitâncias Φ₁..Φ₇, Viabilidade Sistêmica V = ∏ Φ_p,
 * Dreno de Erro de Plano L_drain e Cascata Dinâmica de 639h).
 */
export function computeSurvivalMatrix(results: Map<string, AxisResult>): SurvivalMatrixPosition | null {
  const v = (id: string, fallback = 50): number => results.get(id)?.leftPercent ?? fallback;
  const hegemony = computePsochicHegemony(results);
  if (!hegemony) {
    return null;
  }

  const est = v('estrutura') / 100;
  const rep = v('representacao') / 100;
  const pod = v('poder') / 100;
  const imi = v('imigracao') / 100;
  const dip = v('diplomacia') / 100;
  const intv = v('intervencao') / 100;
  const eco = v('economia') / 100;
  const con = v('controle') / 100;
  const com = v('comercio') / 100;
  const rel = v('religiao') / 100;
  const mor = v('moral') / 100;
  const tec = v('tecnologia') / 100;

  // Capacidade construtiva por plano (ancorada na direção construtiva +υ, +ψ sem tirania coercitiva):
  const balance = (x: number, center = 0.65, width = 0.55): number =>
    clampRange(1.0 - Math.pow((x - center) / width, 2) * 0.55, 0.1, 1.0);
  const coercionPenalty = Math.max(0, pod - 0.62) * 0.55;

  const phi1 = clampRange(0.45 * balance(eco, 0.68, 0.55) + 0.35 * balance(con, 0.65, 0.55) + 0.20 * balance(tec, 0.65, 0.52) - coercionPenalty * 0.4, 0.08, 0.98);
  const phi2 = clampRange(0.40 * balance(con, 0.64, 0.55) + 0.35 * balance(com, 0.58, 0.55) + 0.25 * (1.0 - Math.abs(pod - 0.45)) - coercionPenalty * 0.4, 0.08, 0.98);
  const phi3 = clampRange(0.42 * intv + 0.33 * (1.0 - pod * 0.72) + 0.25 * balance(tec, 0.60, 0.52), 0.08, 0.98);
  const phi4 = clampRange(0.38 * (0.30 + 0.70 * mor) + 0.37 * (0.30 + 0.70 * (1.0 - imi)) + 0.25 * (0.35 + 0.65 * rel) - coercionPenalty * 0.5, 0.08, 0.98);
  const phi5 = clampRange(0.42 * rep + 0.33 * (0.30 + 0.70 * rel) + 0.25 * (1.0 - pod * 0.68), 0.08, 0.98);
  const phi6 = clampRange(0.42 * rep + 0.33 * balance(est, 0.62, 0.55) + 0.25 * balance(pod, 0.42, 0.48), 0.08, 0.98);
  const phi7 = clampRange(0.38 * intv + 0.32 * (0.35 + 0.65 * (1.0 - dip)) + 0.30 * balance(tec, 0.64, 0.52) - coercionPenalty * 0.3, 0.08, 0.98);

  const phis: Record<PlaneMetric['id'], number> = {
    P1: phi1,
    P2: phi2,
    P3: phi3,
    P4: phi4,
    P5: phi5,
    P6: phi6,
    P7: phi7
  };

  const planes: PlaneMetric[] = (['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7'] as const).map((id) => {
    const phi = Number(phis[id].toFixed(3));
    const alpha = Number(((1.0 - phi) * 0.38).toFixed(3));
    return { id, phi, alpha };
  });

  const viability = Number(planes.reduce((acc, p) => acc * p.phi, 1.0).toFixed(4));
  const weakestPlane = planes.reduce((min, p) => (p.phi < min.phi ? p : min), planes[0]).id;

  // Dreno de Erro de Identificação de Plano: L_drain = γ (Φ_a - Φ_b)² Φ_b
  const pairs: [PlaneMetric['id'], PlaneMetric['id'], number][] = [
    ['P6', 'P1', 0.45],
    ['P4', 'P5', 0.40],
    ['P2', 'P3', 0.38],
    ['P6', 'P7', 0.42]
  ];
  const totalDrain = Number(
    pairs
      .reduce((sum, [a, b, gamma]) => sum + gamma * Math.pow(phis[a] - phis[b], 2) * phis[b], 0)
      .toFixed(4)
  );

  // Potencial Inicial P(0) e Cascata de 639h impulsionada pela Hegemonia Psóquica (υ, ψ):
  // P1 -> P2 -> P5 -> P3 -> P4 -> P7 -> P6 -> P1
  // Quando υ > 0 (benefício inclusivo) e ψ > 0 (ação produtiva "will be") superam a entropia + L_drain,
  // o Potencial cresce ao longo do tempo (ΔP > 0 / P·t > 0).
  // Quando υ < 0 e ψ > 0 (Redutivo "can't be"), a ação ativa amplifica a extração e reduz o Potencial.
  const initialPotential = Number(mean(Object.values(phis)).toFixed(3));
  const order: PlaneMetric['id'][] = ['P1', 'P2', 'P5', 'P3', 'P4', 'P7', 'P6'];
  const state = { ...phis };

  const { upsilon, psi } = hegemony;
  const constructiveDrive =
    upsilon >= 0 && psi >= 0
      ? 0.045 * upsilon + 0.032 * psi
      : upsilon < 0 && psi >= 0
        ? 0.035 * upsilon - 0.025 * psi * Math.abs(upsilon)
        : 0.030 * upsilon + 0.022 * psi;

  for (let step = 0; step < 7; step++) {
    const src = order[step];
    const dst = order[(step + 1) % order.length];
    const mismatch = Math.pow(state[src] - state[dst], 2) * 0.16;
    const entropy = (1.0 - state[src]) * 0.055 + totalDrain * 0.35 + coercionPenalty * 0.08;
    const coupling = 0.038 * state[src] + constructiveDrive;
    state[dst] = clampRange(state[dst] * (1.0 - mismatch - entropy) + coupling, 0.05, 0.99);
  }
  const finalPotential = Number(mean(Object.values(state)).toFixed(3));
  const potentialDelta = Number((finalPotential - initialPotential).toFixed(3));
  const potentialGrowing = potentialDelta > 0;

  return {
    planes,
    viability,
    viable: viability >= 0.005,
    weakestPlane,
    totalDrain,
    cascadeFinalMean: finalPotential,
    initialPotential,
    finalPotential,
    potentialDelta,
    potentialGrowing
  };
}
