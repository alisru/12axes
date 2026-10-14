import { useState, type CSSProperties } from 'react';
import { LANG, t } from '../../i18n';
import { ideologyColorByKey, resolveIdeologyColor, type IdeologyColorKey } from '../../utils/ideologyColors';
import type { Axis, AxisResult } from '../../types/quiz';
import {
  centerSide,
  compassRegion,
  computePsochicHegemony,
  computeSurvivalMatrix,
  socialLevel,
  type CompassPosition,
  type DefinitionModeKey,
  type HegemonyAnchorKey,
  type HegemonyQuadrantKey,
  type HelxisKey,
  type InversionFlagKey,
  type PlaneMetric
} from '../../utils/politicalCompass';
import { InfoButton, InfoSheet } from './InfoSheet';

const ANCHORS: { key: IdeologyColorKey; column: number; row: number }[] = [
  { key: 'esq-radical', column: 1, row: 1 },
  { key: 'terceira', column: 4, row: 1 },
  { key: 'ext-direita', column: 7, row: 1 },
  { key: 'esquerda', column: 1, row: 4.5 },
  { key: 'centro', column: 4, row: 4.5 },
  { key: 'direita', column: 7, row: 4.5 },
  { key: 'anarquismo', column: 1.5, row: 7.5 },
  { key: 'libertario', column: 6.5, row: 7.5 }
];

const BLEND_SPREAD = 1.7;

const VIVID: Record<IdeologyColorKey, { saturation: number; lightness: number; hue?: number }> = {
  'esq-radical': { saturation: 85, lightness: 74 },
  terceira: { saturation: 65, lightness: 78 },
  'ext-direita': { saturation: 85, lightness: 66 },
  esquerda: { saturation: 65, lightness: 72 },
  centro: { saturation: 10, lightness: 80 },
  direita: { saturation: 90, lightness: 77 },
  anarquismo: { saturation: 0, lightness: 76 },
  libertario: { saturation: 90, lightness: 68, hue: 47 }
};

const FALLBACK_PROGRESSIVE = '#D23E84';
const FALLBACK_TRADITIONAL = '#74502C';
const WHITE = [255, 255, 255] as const;
const NEUTRAL = [123, 127, 134] as const;
const SIZE = 9;

function mix(a: readonly number[], b: readonly number[], amount: number): number[] {
  return a.map((value, index) => value + (b[index] - value) * amount);
}

function threeStop(start: readonly number[], middle: readonly number[], end: readonly number[], amount: number): number[] {
  return amount < 0.5 ? mix(start, middle, amount * 2) : mix(middle, end, (amount - 0.5) * 2);
}

function hexToRgb(hex: string): number[] {
  const value = hex.replace('#', '');
  const full = value.length === 3 ? value.replace(/./g, '$&$&') : value;
  return [0, 2, 4].map((offset) => parseInt(full.slice(offset, offset + 2), 16));
}

function rgb(color: number[]): string {
  return `rgb(${color.map((value) => Math.round(value)).join(',')})`;
}

function hueOf([red, green, blue]: number[]): number {
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  if (max === min) return 0;
  const delta = max - min;
  const hue = max === red ? ((green - blue) / delta) % 6 : max === green ? (blue - red) / delta + 2 : (red - green) / delta + 4;
  return (hue * 60 + 360) % 360;
}

function hslToRgb(hue: number, saturation: number, lightness: number): number[] {
  const s = saturation / 100;
  const l = lightness / 100;
  const k = (n: number) => (n + hue / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const channel = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [channel(0), channel(8), channel(4)].map((value) => value * 255);
}

function centerMixColor(first: IdeologyColorKey, second: IdeologyColorKey): string | undefined {
  if (first === second || (first !== 'centro' && second !== 'centro')) return undefined;
  const other = first === 'centro' ? second : first;
  return rgb(mix(hexToRgb(ideologyColorByKey('centro').base), hexToRgb(ideologyColorByKey(other).base), 0.5));
}

function vividColor(key: IdeologyColorKey): number[] {
  const { saturation, lightness, hue } = VIVID[key];
  return hslToRgb(hue ?? hueOf(hexToRgb(ideologyColorByKey(key).base)), saturation, lightness);
}

function regionColor(column: number, row: number): string {
  let total = 0;
  const sum = [0, 0, 0];
  for (const anchor of ANCHORS) {
    const distance2 = (column - anchor.column) ** 2 + (row - anchor.row) ** 2;
    const weight = Math.exp(-distance2 / (2 * BLEND_SPREAD ** 2));
    const color = vividColor(anchor.key);
    total += weight;
    color.forEach((value, index) => {
      sum[index] += value * weight;
    });
  }
  return rgb(sum.map((value) => value / total));
}

const GRID_CELLS: string[] = Array.from({ length: SIZE * SIZE }, (_, index) => {
  const column = index % SIZE;
  const row = Math.floor(index / SIZE);
  return regionColor(column, row);
});

const clamp = (value: number): number => Math.max(4, Math.min(96, value));

function Marker({ left, top, color }: { left: number; top?: number; color?: string }) {
  const style: CSSProperties = { left: `${clamp(left)}%`, top: top === undefined ? '50%' : `${clamp(top)}%` };
  if (color) style.background = color;
  return (
    <span className="e-compass-x" style={style} aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path d="M6 6l12 12M18 6 6 18" />
      </svg>
    </span>
  );
}

const KANON_COPY = {
  pt: {
    hegemonyTitle: 'Hegemonia Psóquica (υ, ψ) & Geometria das Definições',
    hegemonySubtitle: 'Mapeamento vetorial de Benefício Moral (υ) × Ação de Vontade (ψ) e Matriz de Sobrevivência 7×4',
    axisUpsilonLeft: '+2υ {Todos} · Inclusivo',
    axisUpsilonRight: '-2υ {Só Eu} · Exclusivo',
    axisPsiTop: '+2ψ Agir (Do · Ativo)',
    axisPsiBottom: '-2ψ Suprimir (Do Not · Contra-ativo)',
    quadrants: {
      productive: 'Quadrante Produtivo (Ar · Inclusivo + Ativo)',
      reductive: 'Quadrante Redutivo (Fogo · Exclusivo + Ativo)',
      constructive: 'Quadrante Construtivo (Água · Inclusivo + Contra-ativo)',
      regressive: 'Quadrante Regressivo (Terra · Exclusivo + Contra-ativo)'
    } satisfies Record<HegemonyQuadrantKey, string>,
    anchors: {
      systemicJustice: 'Justiça Sistêmica (+2υ, +2ψ) — Zona de Plenitude',
      greaterGood: 'Bem Maior (+1υ, +1ψ) — A Boa Verdade',
      greatestLie: 'Mal Menor / Grande Mentira (-1υ, +1ψ) — A Má Mentira',
      lesserGood: 'Bem Menor (+1υ, -1ψ) — A Boa Mentira',
      greaterEvil: 'Mal Maior (-1υ, -1ψ) — A Má Verdade',
      pureExtraction: 'Extração Pura (-2υ, -2ψ) — Zona Destrutiva',
      goodPreference: 'Outros Seres (+1υ, 0ψ) — A Boa Preferência',
      badPreference: 'Só Eu (-1υ, 0ψ) — A Má Preferência',
      confusionZone: 'Ninguém (0υ, 0ψ) — Zona de Confusão'
    } satisfies Record<HegemonyAnchorKey, string>,
    definitions: {
      willBe: 'Processo Produtivo ("will be" / Solução): usa o que não é e o que é parecido, opondo-se ao que era, até que possa ser ("can be").',
      cantBe: 'Processo Redutivo ("can\'t be" / Problema): usa o que era e o que pode ser, opondo-se ao que é parecido, até que não seja ("is not").',
      mayBe: 'Processo Construtivo ("may be"): usa o que pode ser e o que era até formar o que é parecido ("is like").',
      wontBe: 'Processo Regressivo ("won\'t be"): usa o que não é e o que é parecido para se opor ao que pode ser, voltando ao que era ("was like").'
    } satisfies Record<DefinitionModeKey, string>,
    helxis: {
      forEveryone: '"Você":[eu, você] = "Para Você, para Mim e para Todos" (Dar a todos)',
      forYouOnlyMe: '"Você":[eu, eu] = "Para Você, mas Só para Mim"',
      meAndYouForMe: '"Eu":[você, eu] = "Eu e Você, mas na verdade para Mim"',
      forMeOnlyMe: '"Eu":[eu, você] = "Para Mim, só para Mim, e você fica com a sobra"'
    } satisfies Record<HelxisKey, string>,
    inversionTitle: 'Alerta de Inversão Perceptual (Zona 0.5)',
    inversions: {
      extractionAsStrength: 'Extração parece Força (Mal Menor percebido como Bem Menor)',
      serviceAsBurden: 'Serviço parece Fardo (Bem Maior percebido como Mal Maior)',
      stabilityAsRot: 'Estabilidade parece Estagnação (Paz percebida como Fraqueza)',
      crueltyAsProtection: 'Crueldade parece Proteção (Exclusão percebida como Ordem)'
    } satisfies Record<InversionFlagKey, string>,
    matrixTitle: 'Matriz de Sobrevivência 7×4 (Viabilidade Sistêmica V = ∏ Φₚ)',
    viabilityLabel: 'Viabilidade Multiplicativa (V)',
    viableYes: 'Sistema Viável',
    viableNo: 'Risco de Colapso em Cascata',
    weakestLabel: 'Gargalo Estrutural',
    drainLabel: 'Dreno de Erro de Plano (L_drain)',
    cascadeLabel: 'Potencial após 639h (P₀ → Pₜ)',
    potentialDeltaLabel: 'Variação de Potencial (ΔP·t)',
    potentialGrowingYes: 'Potencial Crescente (P·t > 0 · Bom)',
    potentialGrowingNo: 'Potencial em Erosão (P·t ≤ 0)',
    planes: {
      P1: 'P1 Físico / Material',
      P2: 'P2 Energético / Logístico',
      P3: 'P3 Biológico / Vital',
      P4: 'P4 Emotivo / Coesão Social',
      P5: 'P5 Cognitivo / Epistêmico',
      P6: 'P6 Estrutural / Jurídico',
      P7: 'P7 Sistêmico / Evolucionário'
    } satisfies Record<PlaneMetric['id'], string>
  },
  en: {
    hegemonyTitle: 'Psochic Hegemony (υ, ψ) & Geometry of Definitions',
    hegemonySubtitle: 'Vector map of Moral Scope of Benefit (υ) × Action of Will (ψ) and the 7×4 Survival Matrix',
    axisUpsilonLeft: '+2υ {Everyone} · Inclusive',
    axisUpsilonRight: '-2υ {Only Me} · Exclusive',
    axisPsiTop: '+2ψ Do (Active · Hot)',
    axisPsiBottom: '-2ψ Do Not (Counteractive · Cold)',
    quadrants: {
      productive: 'Productive Quadrant (Air · Inclusive + Active)',
      reductive: 'Reductive Quadrant (Fire · Exclusive + Active)',
      constructive: 'Constructive Quadrant (Water · Inclusive + Counteractive)',
      regressive: 'Regressive Quadrant (Earth · Exclusive + Counteractive)'
    } satisfies Record<HegemonyQuadrantKey, string>,
    anchors: {
      systemicJustice: 'Systemic Justice (+2υ, +2ψ) — Bliss Zone',
      greaterGood: 'Greater Good (+1υ, +1ψ) — The Good Truth',
      greatestLie: 'Lesser Evil / Greatest Lie (-1υ, +1ψ) — The Bad Lie',
      lesserGood: 'Lesser Good (+1υ, -1ψ) — The Good Lie',
      greaterEvil: 'Greater Evil (-1υ, -1ψ) — The Bad Truth',
      pureExtraction: 'Pure Extraction (-2υ, -2ψ) — Destructive Zone',
      goodPreference: 'Other Beings (+1υ, 0ψ) — The Good Preference',
      badPreference: 'Only Me (-1υ, 0ψ) — The Bad Preference',
      confusionZone: 'No-one (0υ, 0ψ) — Confusion Zone'
    } satisfies Record<HegemonyAnchorKey, string>,
    definitions: {
      willBe: 'Productive Process ("will be" / Solution): uses what is not and what is like, opposing what was like, until it can be.',
      cantBe: 'Reductive Process ("can\'t be" / Problem): uses what was like and can be, opposing what is like, until it is not.',
      mayBe: 'Constructive Process ("may be"): uses what can be and was like until it is like.',
      wontBe: 'Regressive Process ("won\'t be"): uses what is not and what is like to oppose what can be, until it was like.'
    } satisfies Record<DefinitionModeKey, string>,
    helxis: {
      forEveryone: '"You":[me, you] = "For You, Me and Everyone" (Give to everyone)',
      forYouOnlyMe: '"You":[me, me] = "For You, but Only for Me"',
      meAndYouForMe: '"Me":[you, me] = "Me and You, but Really for Me"',
      forMeOnlyMe: '"Me":[me, you] = "For Me, only Me, and you take what I don\'t need"'
    } satisfies Record<HelxisKey, string>,
    inversionTitle: 'Perceptual Inversion Warning (The 0.5 Zone)',
    inversions: {
      extractionAsStrength: 'Extraction feels like Strength (Lesser Evil perceived as Lesser Good)',
      serviceAsBurden: 'Service feels like Burden (Greater Good perceived as Greater Evil)',
      stabilityAsRot: 'Stability feels like Rot (Peace perceived as Weakness)',
      crueltyAsProtection: 'Cruelty feels like Protection (Exclusion perceived as Order)'
    } satisfies Record<InversionFlagKey, string>,
    matrixTitle: '7×4 Survival Matrix (Systemic Viability V = ∏ Φₚ)',
    viabilityLabel: 'Multiplicative Viability (V)',
    viableYes: 'Viable System',
    viableNo: 'Cascade Collapse Risk',
    weakestLabel: 'Structural Bottleneck',
    drainLabel: 'Plane Error Drain (L_drain)',
    cascadeLabel: '639h Potential Trajectory (P₀ → Pₜ)',
    potentialDeltaLabel: 'Potential Over Time (ΔP·t)',
    potentialGrowingYes: 'Potential Growing (P·t > 0 · Good)',
    potentialGrowingNo: 'Potential Eroding (P·t ≤ 0)',
    planes: {
      P1: 'P1 Physical / Material',
      P2: 'P2 Energetic / Logistic',
      P3: 'P3 Biological / Vital',
      P4: 'P4 Emotive / Social Trust',
      P5: 'P5 Cognitive / Epistemic',
      P6: 'P6 Structural / Legal',
      P7: 'P7 Systemic / Evolutionary'
    } satisfies Record<PlaneMetric['id'], string>
  }
} as const;

interface PoliticalCompassSectionProps {
  position: CompassPosition;
  /** Categoria da ideologia mais compatível (o "espectro"): dá a palavra e a cor da frase. */
  category: string;
  /** Eixo `moral` (Progressista × Tradicionalista): suas cores nas pontas pintam a barra, o "X" e o grifo. */
  moralAxis?: Axis;
  /** Resultados completos por eixo para renderizar a Hegemonia Psóquica (υ, ψ) e Matriz de Sobrevivência 7×4. */
  results?: Map<string, AxisResult>;
}

/** Valores derivados da bússola (cores, frase e barra), compartilhados com o relatório em PDF. */
export function compassView(position: CompassPosition, category: string, moralAxis?: Axis) {
  const { traditional } = position;
  const spectrum = resolveIdeologyColor(category);
  const compassKey = compassRegion(position);
  const centerSideKey = centerSide(spectrum.key, compassKey);
  const centerLabel = centerSideKey === 'esquerda' ? t.compassCenterLeft : t.compassCenterRight;
  const markerColor = centerMixColor(spectrum.key, compassKey);
  const social = socialLevel(traditional);
  const progressive = hexToRgb(moralAxis?.leftColor ?? FALLBACK_PROGRESSIVE);
  const traditionalist = hexToRgb(moralAxis?.rightColor ?? FALLBACK_TRADITIONAL);
  const stripCells = Array.from({ length: SIZE }, (_, index) =>
    rgb(
      threeStop(
        mix(progressive, WHITE, 0.72),
        mix(NEUTRAL, WHITE, 0.72),
        mix(traditionalist, WHITE, 0.72),
        index / (SIZE - 1)
      )
    )
  );
  const socialColor = rgb(threeStop(progressive, NEUTRAL, traditionalist, traditional / 100));
  return { spectrum, centerSideKey, centerLabel, markerColor, social, stripCells, socialColor };
}

export const COMPASS_GRID_CELLS = GRID_CELLS;
export const compassClamp = clamp;

export function PoliticalCompassSection({ position, category, moralAxis, results }: PoliticalCompassSectionProps) {
  const { right, authoritarian, traditional } = position;
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const { spectrum, centerSideKey, centerLabel, markerColor, social, stripCells, socialColor } = compassView(
    position,
    category,
    moralAxis
  );

  const hegemony = results ? computePsochicHegemony(results) : null;
  const survival = results ? computeSurvivalMatrix(results) : null;
  const copy = KANON_COPY[LANG === 'en' ? 'en' : 'pt'];

  // No diagrama da Hegemonia Psóquica: +2υ fica à esquerda (0%) e -2υ fica à direita (100%);
  // +2ψ fica no topo (0%) e -2ψ fica na base (100%).
  const hegemonyLeftPct = hegemony ? ((2 - hegemony.upsilon) / 4) * 100 : 50;
  const hegemonyTopPct = hegemony ? ((2 - hegemony.psi) / 4) * 100 : 50;

  return (
    <section className="e-panel e-compass" id="bussola" data-reveal>
      <InfoButton className="e-axis-info e-card-info" label={t.compassInfo.aria} onClick={() => setIsInfoOpen(true)} />
      <h2>{t.compassTitle}</h2>

      <div className="e-compass-body">
        <div
          className="e-compass-chart"
          role="img"
          aria-label={t.compassAria(Math.round(right), Math.round(authoritarian), Math.round(traditional))}
        >
          <span className="e-compass-lbl is-top">{t.compassAuthoritarian}</span>
          <span className="e-compass-lbl is-left">{t.compassLeft}</span>
          <div className="e-compass-grid">
            {GRID_CELLS.map((color, index) => (
              <span key={index} style={{ background: color }} />
            ))}
            <i className="e-compass-axis is-x" aria-hidden="true" />
            <i className="e-compass-axis is-y" aria-hidden="true" />
            <Marker left={right} top={100 - authoritarian} color={markerColor} />
          </div>
          <span className="e-compass-lbl is-right">{t.compassRight}</span>
          <span className="e-compass-lbl is-bottom">{t.compassLibertarian}</span>
        </div>

        <div className="e-compass-read">
          <p className="e-compass-sentence">
            {centerSideKey ? (
              <>
                <span className="e-compass-spectrum" style={{ color: ideologyColorByKey(centerSideKey).base }}>
                  {centerLabel}
                </span>{' '}
                <span className="e-compass-conn">{t.compassWith}</span>{' '}
              </>
            ) : (
              <>
                <span className="e-compass-spectrum" style={{ color: spectrum.base }}>
                  {t.compassSpectrumLabels[spectrum.key]}
                </span>{' '}
                <span className="e-compass-conn">{t.compassWith}</span>{' '}
              </>
            )}
            <mark className="e-compass-mark" style={{ background: socialColor }}>
              {t.compassSocialLabels[social]}
            </mark>
            {t.compassSocialValues && (
              <>
                {' '}
                <span className="e-compass-conn">{t.compassSocialValues}</span>
              </>
            )}
          </p>

          <div className="e-compass-bar" aria-hidden="true">
            <div className="e-compass-bar-lbls">
              <span>{t.compassProgressive}</span>
              <span>{t.compassTraditionalist}</span>
            </div>
            <div className="e-compass-strip">
              {stripCells.map((color, index) => (
                <span key={index} style={{ background: color }} />
              ))}
              <Marker left={traditional} color={socialColor} />
            </div>
          </div>
        </div>
      </div>

      {hegemony && survival && (
        <div
          className="e-kanon-panel"
          style={{
            marginTop: '2rem',
            paddingTop: '1.75rem',
            borderTop: '1px solid rgba(128, 128, 128, 0.22)'
          }}
        >
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.25rem 0' }}>{copy.hegemonyTitle}</h3>
            <p style={{ fontSize: '0.88rem', opacity: 0.78, margin: 0 }}>{copy.hegemonySubtitle}</p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.25rem',
              alignItems: 'start'
            }}
          >
            {/* Mapa 2D da Hegemonia Psóquica (υ, ψ) */}
            <div
              style={{
                padding: '1rem',
                borderRadius: '12px',
                background: 'rgba(128, 128, 128, 0.06)',
                border: '1px solid rgba(128, 128, 128, 0.16)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', opacity: 0.75, marginBottom: '0.4rem' }}>
                <span>{copy.axisUpsilonLeft}</span>
                <span>{copy.axisUpsilonRight}</span>
              </div>

              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '1 / 1',
                  maxWidth: '240px',
                  margin: '0 auto',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  border: '1px solid rgba(128, 128, 128, 0.28)',
                  background:
                    'linear-gradient(135deg, rgba(46, 184, 92, 0.28) 0%, rgba(210, 160, 60, 0.20) 50%, rgba(214, 58, 58, 0.30) 100%)'
                }}
              >
                {/* Rótulos dos 4 cantos da Geometria das Definições (parables.png) */}
                <span style={{ position: 'absolute', left: '6px', top: '4px', fontSize: '0.64rem', fontWeight: 700, opacity: 0.78 }}>
                  can be → will be
                </span>
                <span style={{ position: 'absolute', right: '6px', top: '4px', fontSize: '0.64rem', fontWeight: 700, opacity: 0.78 }}>
                  is not → can&apos;t be
                </span>
                <span style={{ position: 'absolute', left: '6px', bottom: '4px', fontSize: '0.64rem', fontWeight: 700, opacity: 0.78 }}>
                  is like → may be
                </span>
                <span style={{ position: 'absolute', right: '6px', bottom: '4px', fontSize: '0.64rem', fontWeight: 700, opacity: 0.78 }}>
                  was like → won&apos;t be
                </span>
                <span
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    opacity: 0.65,
                    pointerEvents: 'none'
                  }}
                >
                  IS
                </span>

                {/* Círculo da Zona 0.5 de Inversão Perceptual */}
                <div
                  style={{
                    position: 'absolute',
                    left: '25%',
                    top: '25%',
                    width: '50%',
                    height: '50%',
                    borderRadius: '50%',
                    border: '1px dashed rgba(128, 128, 128, 0.45)',
                    pointerEvents: 'none'
                  }}
                />
                <i className="e-compass-axis is-x" aria-hidden="true" />
                <i className="e-compass-axis is-y" aria-hidden="true" />

                {/* Vetor de deslocamento (crawl vector) partindo de IS (50,50) sobre a Hegemonia */}
                <svg
                  viewBox="0 0 100 100"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none'
                  }}
                  aria-hidden="true"
                >
                  <defs>
                    <marker id="kanon-crawl-arrow" markerWidth="6" markerHeight="6" refX="4.5" refY="3" orient="auto">
                      <path d="M0,0 L6,3 L0,6 Z" fill={spectrum.base} />
                    </marker>
                  </defs>
                  <line
                    x1="50"
                    y1="50"
                    x2={clamp(hegemonyLeftPct)}
                    y2={clamp(hegemonyTopPct)}
                    stroke={spectrum.base}
                    strokeWidth="2.2"
                    strokeDasharray="3 1.5"
                    markerEnd="url(#kanon-crawl-arrow)"
                  />
                </svg>

                <Marker left={hegemonyLeftPct} top={hegemonyTopPct} color={spectrum.base} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', opacity: 0.75, marginTop: '0.4rem' }}>
                <span>{copy.axisPsiTop}</span>
                <span>{copy.axisPsiBottom}</span>
              </div>

              <div style={{ marginTop: '0.85rem', fontSize: '0.86rem', lineHeight: 1.45 }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                  (υ = {hegemony.upsilon >= 0 ? `+${hegemony.upsilon.toFixed(2)}` : hegemony.upsilon.toFixed(2)}, ψ ={' '}
                  {hegemony.psi >= 0 ? `+${hegemony.psi.toFixed(2)}` : hegemony.psi.toFixed(2)}) → {copy.anchors[hegemony.anchor]}
                </div>
                <div style={{ opacity: 0.88, marginBottom: '0.35rem' }}>
                  <strong>{copy.quadrants[hegemony.quadrant]}</strong>
                </div>
                <div style={{ opacity: 0.82, fontSize: '0.82rem', marginBottom: '0.35rem' }}>
                  {copy.definitions[hegemony.definitionMode]}
                </div>
                <div style={{ opacity: 0.82, fontSize: '0.8rem', fontFamily: 'monospace' }}>
                  Helxis: {copy.helxis[hegemony.helxis]}
                </div>
                <div
                  style={{
                    marginTop: '0.45rem',
                    paddingTop: '0.45rem',
                    borderTop: '1px solid rgba(128, 128, 128, 0.16)',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.3rem',
                    fontSize: '0.78rem'
                  }}
                >
                  <div>
                    <span style={{ opacity: 0.75 }}>{LANG === 'en' ? 'Contradiction ||F_f−F_t||:' : 'Contradição ||F_f−F_t||:'}</span>{' '}
                    <strong style={{ fontFamily: 'monospace' }}>{hegemony.contradictionScore.toFixed(2)}</strong>
                  </div>
                  <div>
                    <span style={{ opacity: 0.75 }}>{LANG === 'en' ? 'Worldview Integrity (W):' : 'Integridade de Visão (W):'}</span>{' '}
                    <strong style={{ fontFamily: 'monospace' }}>{Math.round(hegemony.worldviewIntegrity * 100)}%</strong>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <span style={{ opacity: 0.75 }}>{LANG === 'en' ? 'Trajectory (Model 6):' : 'Trajetória (Modelo 6):'}</span>{' '}
                    <strong style={{ color: hegemony.trajectory === 'redemption' ? '#2eb85c' : '#d63a3a' }}>
                      {hegemony.trajectory === 'redemption'
                        ? LANG === 'en'
                          ? 'Path to Enlightenment (Progress / Redemption)'
                          : 'Caminho do Esclarecimento (Progresso / Redenção)'
                        : LANG === 'en'
                          ? 'Path to Nowhere (Regression / Fall)'
                          : 'Caminho para o Nada (Regressão / Queda)'}
                    </strong>
                  </div>
                </div>

                {hegemony.inversions.length > 0 && (
                  <div
                    style={{
                      marginTop: '0.65rem',
                      padding: '0.55rem 0.7rem',
                      borderRadius: '8px',
                      background: 'rgba(217, 119, 6, 0.12)',
                      border: '1px solid rgba(217, 119, 6, 0.35)',
                      fontSize: '0.79rem'
                    }}
                  >
                    <strong>{copy.inversionTitle}:</strong>
                    <ul style={{ margin: '0.25rem 0 0 1.1rem', padding: 0 }}>
                      {hegemony.inversions.map((inv) => (
                        <li key={inv}>{copy.inversions[inv]}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Matriz de Sobrevivência 7×4 */}
            <div
              style={{
                padding: '1rem',
                borderRadius: '12px',
                background: 'rgba(128, 128, 128, 0.06)',
                border: '1px solid rgba(128, 128, 128, 0.16)'
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.65rem' }}>{copy.matrixTitle}</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {survival.planes.map((p) => {
                  const pct = Math.round(p.phi * 100);
                  const isWeakest = p.id === survival.weakestPlane;
                  return (
                    <div key={p.id} style={{ fontSize: '0.8rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.15rem' }}>
                        <span style={{ fontWeight: isWeakest ? 700 : 500 }}>
                          {copy.planes[p.id]} {isWeakest ? '⚠️' : ''}
                        </span>
                        <span style={{ fontFamily: 'monospace' }}>
                          Φ={p.phi.toFixed(2)} · α={p.alpha.toFixed(2)}
                        </span>
                      </div>
                      <div
                        style={{
                          height: '7px',
                          borderRadius: '4px',
                          background: 'rgba(128, 128, 128, 0.2)',
                          overflow: 'hidden'
                        }}
                      >
                        <div
                          style={{
                            width: `${pct}%`,
                            height: '100%',
                            borderRadius: '4px',
                            background: pct >= 65 ? '#2eb85c' : pct >= 45 ? '#d99b26' : '#d63a3a'
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div
                style={{
                  marginTop: '0.85rem',
                  paddingTop: '0.65rem',
                  borderTop: '1px solid rgba(128, 128, 128, 0.18)',
                  fontSize: '0.81rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.4rem'
                }}
              >
                <div>
                  <span style={{ opacity: 0.75 }}>{copy.viabilityLabel}:</span>{' '}
                  <strong style={{ fontFamily: 'monospace' }}>{survival.viability.toFixed(4)}</strong> (
                  {survival.viable ? copy.viableYes : copy.viableNo})
                </div>
                <div>
                  <span style={{ opacity: 0.75 }}>{copy.weakestLabel}:</span>{' '}
                  <strong>{copy.planes[survival.weakestPlane]}</strong>
                </div>
                <div>
                  <span style={{ opacity: 0.75 }}>{copy.drainLabel}:</span>{' '}
                  <strong style={{ fontFamily: 'monospace' }}>{survival.totalDrain.toFixed(4)}</strong>
                </div>
                <div>
                  <span style={{ opacity: 0.75 }}>{copy.cascadeLabel}:</span>{' '}
                  <strong style={{ fontFamily: 'monospace' }}>
                    {Math.round(survival.initialPotential * 100)}% → {Math.round(survival.finalPotential * 100)}%
                  </strong>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <span style={{ opacity: 0.75 }}>{copy.potentialDeltaLabel}:</span>{' '}
                  <strong
                    style={{
                      fontFamily: 'monospace',
                      color: survival.potentialGrowing ? '#2eb85c' : '#d63a3a'
                    }}
                  >
                    {survival.potentialDelta >= 0 ? `+${(survival.potentialDelta * 100).toFixed(1)}%` : `${(survival.potentialDelta * 100).toFixed(1)}%`}
                  </strong>{' '}
                  ({survival.potentialGrowing ? copy.potentialGrowingYes : copy.potentialGrowingNo})
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isInfoOpen && (
        <InfoSheet titleId="compass-info-title" className="e-compass-sheet" onClose={() => setIsInfoOpen(false)}>
          <p className="e-axis-sheet-label">{t.compassTitle}</p>
          <h3 id="compass-info-title">{t.compassInfo.title}</h3>
          <ul className="e-compass-how">
            {[
              { lead: t.compassInfo.authLead, text: t.compassInfo.authText },
              { lead: t.compassInfo.econLead, text: t.compassInfo.econText },
              { lead: t.compassInfo.socialLead, text: t.compassInfo.socialText }
            ].map((item) => (
              <li key={item.lead}>
                <strong>{item.lead}</strong> {item.text}
              </li>
            ))}
          </ul>
        </InfoSheet>
      )}
    </section>
  );
}
