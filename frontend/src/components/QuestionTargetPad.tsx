import { useState, useRef, useCallback, useMemo } from 'react';
import type { AnswerValue, Axis, Question, VectorAnswer, ParableQuadrant } from '../types/quiz';
import { LANG, type Lang } from '../i18n';
import { HEGEMONIC_SCENARIOS, isScenario9Set, type HegemonicScenario, type HegemonicScenarioSet, type HegemonicScenario9Set } from '../data/hegemonicScenarios';

interface QuestionTargetPadProps {
  question: Question;
  axis?: Axis;
  selected1D?: AnswerValue;
  selectedVector?: VectorAnswer;
  disabled?: boolean;
  lang?: Lang;
  onSelect: (answer: AnswerValue, vector: VectorAnswer) => void;
  onConfirm?: (answer: AnswerValue, vector: VectorAnswer) => void;
}

interface PadStrings {
  modeTag: string;
  dragHint: string;
  axisNorth: string;
  axisSouth: string;
  axisWest: string;
  axisEast: string;
  humanHorizon: string;
  systemicHorizon: string;
  agreeEveryone: string;
  agreeSelf: string;
  disagreeEveryone: string;
  disagreeSelf: string;
  centerNeutral: string;
  confirmBtn: string;
  telemetryAction: string;
  telemetryScope: string;
  telemetryImpact: string;
  axisImpactAgree: string;
  axisImpactDisagree: string;
  levels: {
    indifferent: string;
    moderate: string;
    firm: string;
    radical: string;
  };
}

const STRINGS: Record<'en' | 'es' | 'pt', PadStrings> = {
  en: {
    modeTag: '2-Axis Decision Grid (Action × Scope)',
    dragHint: 'Drag the crosshair anywhere in the square grid, or select a scenario below:',
    axisNorth: '+ AGREE',
    axisSouth: '- DISAGREE',
    axisWest: 'FOR EVERYONE',
    axisEast: 'FOR SELF / GROUP',
    humanHorizon: 'Human Horizon (±1)',
    systemicHorizon: 'Systemic Horizon (±2)',
    agreeEveryone: 'Agree for Everyone',
    agreeSelf: 'Agree for Self / Group',
    disagreeEveryone: 'Disagree for Everyone',
    disagreeSelf: 'Disagree for Self / Group',
    centerNeutral: "I Don't Know / Not Sure",
    confirmBtn: 'Confirm & Next Question →',
    telemetryAction: 'Action:',
    telemetryScope: 'Scope:',
    telemetryImpact: 'Stance:',
    axisImpactAgree: 'Agreeing moves your score toward',
    axisImpactDisagree: 'Disagreeing moves your score toward',
    levels: {
      indifferent: 'Indifferent',
      moderate: 'Moderate',
      firm: 'Firm',
      radical: 'Radical'
    }
  },
  es: {
    modeTag: 'Cuadrícula de Decisión de 2 Ejes (Acción × Alcance)',
    dragHint: 'Arrastra el retículo por la cuadrícula o elige un escenario abajo:',
    axisNorth: '+ DE ACUERDO',
    axisSouth: '- EN DESACUERDO',
    axisWest: 'PARA TODOS',
    axisEast: 'PARA MÍ / MI GRUPO',
    humanHorizon: 'Horizonte Humano (±1)',
    systemicHorizon: 'Horizonte Sistémico (±2)',
    agreeEveryone: 'De acuerdo para Todos',
    agreeSelf: 'De acuerdo para Mí / Grupo',
    disagreeEveryone: 'En desacuerdo para Todos',
    disagreeSelf: 'En desacuerdo para Mí / Grupo',
    centerNeutral: 'No lo sé / No estoy seguro',
    confirmBtn: 'Confirmar y Siguiente Pregunta →',
    telemetryAction: 'Acción:',
    telemetryScope: 'Alcance:',
    telemetryImpact: 'Postura:',
    axisImpactAgree: 'Estar de acuerdo inclina tu resultado hacia',
    axisImpactDisagree: 'Estar en desacuerdo inclina tu resultado hacia',
    levels: {
      indifferent: 'Indiferente',
      moderate: 'Moderado',
      firm: 'Firme',
      radical: 'Radical'
    }
  },
  pt: {
    modeTag: 'Grade de Decisão em 2 Eixos (Ação × Escopo)',
    dragHint: 'Arraste a mira pela grade quadrada ou selecione um cenário abaixo:',
    axisNorth: '+ CONCORDO',
    axisSouth: '- DISCORDO',
    axisWest: 'PARA TODOS',
    axisEast: 'PARA MIM / MEU GRUPO',
    humanHorizon: 'Horizonte Humano (±1)',
    systemicHorizon: 'Horizonte Sistêmico (±2)',
    agreeEveryone: 'Concordo para Todos',
    agreeSelf: 'Concordo para Mim / Grupo',
    disagreeEveryone: 'Discordo para Todos',
    disagreeSelf: 'Discordo para Mim / Grupo',
    centerNeutral: 'Não Sei / Em Dúvida',
    confirmBtn: 'Confirmar e Próxima Pergunta →',
    telemetryAction: 'Ação:',
    telemetryScope: 'Escopo:',
    telemetryImpact: 'Posicionamento:',
    axisImpactAgree: 'Concordar inclina sua pontuação para',
    axisImpactDisagree: 'Discordar inclina sua pontuação para',
    levels: {
      indifferent: 'Indiferente',
      moderate: 'Moderado',
      firm: 'Firme',
      radical: 'Radical'
    }
  }
};

const SVG_CENTER = 150;
const GRID_HALF = 110; // ±2.0 maps to ±110px from center (box from 40 to 260)
const INNER_HALF = 55;  // ±1.0 maps to ±55px from center (box from 95 to 205)

interface AnchorNode {
  key: string;
  name: string;
  u: number;
  psi: number;
  x: number;
  y: number;
}

interface AnchorShare extends AnchorNode {
  distance: number;
  pct: number;
  color: string;
  bg: string;
}

function computeShares(u: number, psi: number, anchors: AnchorNode[]): Record<string, AnchorShare> {
  const dists = anchors.map((a) => {
    const dx = u - a.u;
    const dy = psi - a.psi;
    return Math.sqrt(dx * dx + dy * dy);
  });

  const minDist = Math.min(...dists);

  let rawPcts: number[];

  if (minDist < 0.04) {
    const exactIdx = dists.indexOf(minDist);
    rawPcts = anchors.map((_, i) => (i === exactIdx ? 100 : 0));
  } else {
    // Raio de influência local baseado no espaçamento da grade (1.15)
    const R = Math.max(1.65, minDist + 0.35);

    // Kernel cúbico localizado: (1 - d/R)^3 para d < R
    const rawWeights = dists.map((d) => {
      if (d >= R) return 0;
      const q = 1 - d / R;
      return q * q * q;
    });

    const sumWeights = rawWeights.reduce((acc, w) => acc + w, 0);

    if (sumWeights === 0) {
      const nearestIdx = dists.indexOf(minDist);
      rawPcts = anchors.map((_, i) => (i === nearestIdx ? 100 : 0));
    } else {
      rawPcts = rawWeights.map((w) => (w / sumWeights) * 100);
    }
  }

  // Arredondamento e garantia estrita de soma 100%
  const roundedPcts = rawPcts.map((p) => Math.round(p));
  const total = roundedPcts.reduce((acc, p) => acc + p, 0);
  const diff = 100 - total;
  if (diff !== 0) {
    let maxIdx = 0;
    for (let i = 1; i < rawPcts.length; i++) {
      if (rawPcts[i] > rawPcts[maxIdx]) maxIdx = i;
    }
    roundedPcts[maxIdx] += diff;
  }

  const result: Record<string, AnchorShare> = {};
  anchors.forEach((anc, i) => {
    const pct = roundedPcts[i];
    const dist = dists[i];

    let hue = 0;
    let sat = 0;
    let light = 45;

    if (pct >= 35) {
      hue = 138;
      sat = 75;
      light = 38;
    } else if (pct >= 18) {
      hue = Math.round(85 + ((pct - 18) / 17) * 45);
      sat = 76;
      light = 39;
    } else if (pct >= 5) {
      hue = Math.round(35 + ((pct - 5) / 13) * 45);
      sat = 80;
      light = 40;
    } else if (pct >= 1) {
      hue = 20;
      sat = 65;
      light = 44;
    } else {
      hue = 0;
      sat = 35;
      light = 55;
    }

    const color = pct > 0 ? `hsl(${hue}, ${sat}%, ${light}%)` : 'var(--line, #cbd5e1)';
    const bg = pct > 0 ? `hsla(${hue}, ${sat}%, 45%, ${0.04 + (pct / 100) * 0.16})` : 'transparent';

    result[anc.key] = {
      ...anc,
      distance: dist,
      pct,
      color,
      bg
    };
  });

  return result;
}

export function QuestionTargetPad({
  question,
  axis,
  selected1D,
  selectedVector,
  disabled = false,
  lang,
  onSelect,
  onConfirm
}: QuestionTargetPadProps) {
  const activeLang = lang || (LANG as 'en' | 'es' | 'pt') || 'en';
  const s = STRINGS[activeLang] || STRINGS.en;

  const svgRef = useRef<SVGSVGElement | null>(null);
  const isDraggingRef = useRef(false);

  // Determinar polos acordados e opostos no contexto deste eixo
  const agreedPoleName = axis
    ? question.agreePole === 'LEFT'
      ? axis.leftPole
      : axis.rightPole
    : undefined;

  const opposedPoleName = axis
    ? question.agreePole === 'LEFT'
      ? axis.rightPole
      : axis.leftPole
    : undefined;

  // Gerar cenários contextuais sensíveis ao significado da pergunta e aos polos do eixo
  const scenarios = getContextualScenarios(question, agreedPoleName, opposedPoleName, activeLang);

  const calculateVectorFromSvg = useCallback(
    (svgX: number, svgY: number): VectorAnswer => {
      // Clampar dentro da grade quadrada [-GRID_HALF, +GRID_HALF]
      const rawDx = Math.max(-GRID_HALF, Math.min(GRID_HALF, svgX - SVG_CENTER));
      const rawDy = Math.max(-GRID_HALF, Math.min(GRID_HALF, svgY - SVG_CENTER));

      // Mapeamento de coordenadas da Geometria das Definições:
      // u (Escopo / Moralidade):
      // Esquerda (+X na tela) = +2 (Para Todos / Universal)
      // Direita (-X na tela) = -2 (Para Mim / Faccionário)
      const u = -((rawDx / GRID_HALF) * 2.0);

      // psi (Ação / Vontade):
      // Cima (-Y na tela) = +2 (Apoiar / Implementar)
      // Baixo (+Y na tela) = -2 (Opor / Rejeitar)
      const psi = -((rawDy / GRID_HALF) * 2.0);

      const dist = Math.sqrt((u * u + psi * psi) / 2.0); // magnitude normalizada
      const clampedDist = Math.min(dist, 2.0);
      const angleRad = Math.atan2(psi, u);
      const angleDeg = (angleRad * (180 / Math.PI) + 360) % 360;

      let quadrant: ParableQuadrant;
      let derived1D: AnswerValue;

      // Zona Central de Indiferença (em torno da origem)
      if (Math.abs(u) < 0.28 && Math.abs(psi) < 0.28) {
        quadrant = 'INDIFFERENT';
        derived1D = 'NEUTRAL';
      } else {
        if (u >= 0) {
          quadrant = psi >= 0 ? 'WILL_BE' : 'MAY_BE';
        } else {
          quadrant = psi >= 0 ? 'CANT_BE' : 'WONT_BE';
        }

        // Mapeamento para Likert 1D clássico baseado na Ação (psi)
        if (psi >= 0.85) derived1D = 'STRONGLY_AGREE';
        else if (psi >= 0.25) derived1D = 'AGREE';
        else if (psi <= -0.85) derived1D = 'STRONGLY_DISAGREE';
        else if (psi <= -0.25) derived1D = 'DISAGREE';
        else derived1D = 'NEUTRAL';
      }

      return {
        questionId: question.id,
        x: Math.round(u * 100) / 100,
        y: Math.round(psi * 100) / 100,
        magnitude: Math.round(clampedDist * 100) / 100,
        angleDeg: Math.round(angleDeg),
        derived1D,
        quadrant
      };
    },
    [question.id]
  );

  const handlePointerEvent = useCallback(
    (e: React.PointerEvent<SVGSVGElement> | MouseEvent | TouchEvent) => {
      if (disabled || !svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      let clientX = 0;
      let clientY = 0;

      if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }

      const svgX = ((clientX - rect.left) / rect.width) * 300;
      const svgY = ((clientY - rect.top) / rect.height) * 300;

      const vector = calculateVectorFromSvg(svgX, svgY);
      onSelect(vector.derived1D, vector);
    },
    [disabled, calculateVectorFromSvg, onSelect]
  );

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (disabled) return;
    isDraggingRef.current = true;
    try {
      (e.target as Element).setPointerCapture(e.pointerId);
    } catch {
      // Ignora se não for suportado
    }
    handlePointerEvent(e);
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDraggingRef.current || disabled) return;
    handlePointerEvent(e);
  };

  const onPointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      (e.target as Element).releasePointerCapture(e.pointerId);
    } catch {
      // Ignora
    }
  };

  function selectPreset(quadrant: ParableQuadrant) {
    if (disabled) return;
    let u = 0;
    let psi = 0;

    switch (quadrant) {
      case 'WILL_BE': // Top-Left: Concordo para Todos
        u = 1.15;
        psi = 1.15;
        break;
      case 'CANT_BE': // Top-Right: Concordo para Mim/Grupo
        u = -1.15;
        psi = 1.15;
        break;
      case 'MAY_BE': // Bottom-Left: Discordo para Todos
        u = 1.15;
        psi = -1.15;
        break;
      case 'WONT_BE': // Bottom-Right: Discordo para Mim/Grupo
        u = -1.15;
        psi = -1.15;
        break;
      case 'INDIFFERENT': // Origem
        u = 0;
        psi = 0;
        break;
    }

    // Coordenadas SVG
    const svgX = SVG_CENTER - (u / 2.0) * GRID_HALF;
    const svgY = SVG_CENTER - (psi / 2.0) * GRID_HALF;

    const vector = calculateVectorFromSvg(svgX, svgY);
    onSelect(vector.derived1D, vector);
  }

  // Posição visual da mira
  const currentCoord = selectedVector
    ? {
        x: SVG_CENTER - (selectedVector.x / 2.0) * GRID_HALF,
        y: SVG_CENTER - (selectedVector.y / 2.0) * GRID_HALF
      }
    : selected1D
    ? deriveCoordFrom1D(selected1D)
    : { x: SVG_CENTER, y: SVG_CENTER };

  function deriveCoordFrom1D(ans: AnswerValue): { x: number; y: number } {
    switch (ans) {
      case 'STRONGLY_AGREE':
        return { x: SVG_CENTER - 0.55 * GRID_HALF, y: SVG_CENTER - 0.75 * GRID_HALF };
      case 'AGREE':
        return { x: SVG_CENTER - 0.4 * GRID_HALF, y: SVG_CENTER - 0.45 * GRID_HALF };
      case 'DISAGREE':
        return { x: SVG_CENTER - 0.4 * GRID_HALF, y: SVG_CENTER + 0.45 * GRID_HALF };
      case 'STRONGLY_DISAGREE':
        return { x: SVG_CENTER - 0.55 * GRID_HALF, y: SVG_CENTER + 0.75 * GRID_HALF };
      case 'NEUTRAL':
      default:
        return { x: SVG_CENTER, y: SVG_CENTER };
    }
  }

  const is9Grid = isScenario9Set(scenarios);
  const activeQuadrant = selectedVector?.quadrant || (selected1D === 'NEUTRAL' ? 'INDIFFERENT' : undefined);
  const currentU = selectedVector ? selectedVector.x : 0;
  const currentPsi = selectedVector ? selectedVector.y : 0;

  const anchors9 = useMemo<AnchorNode[]>(() => [
    { key: 'top-left', name: s.agreeEveryone, u: 1.15, psi: 1.15, x: SVG_CENTER - (1.15 / 2.0) * GRID_HALF, y: SVG_CENTER - (1.15 / 2.0) * GRID_HALF },
    { key: 'top-center', name: `${s.axisNorth} (Direct)`, u: 0, psi: 1.15, x: SVG_CENTER, y: SVG_CENTER - (1.15 / 2.0) * GRID_HALF },
    { key: 'top-right', name: s.agreeSelf, u: -1.15, psi: 1.15, x: SVG_CENTER - (-1.15 / 2.0) * GRID_HALF, y: SVG_CENTER - (1.15 / 2.0) * GRID_HALF },
    { key: 'mid-left', name: activeLang === 'pt' ? 'Concordo em Princípio' : activeLang === 'es' ? 'De acuerdo en Principio' : 'Agree in Principle', u: 1.15, psi: 0, x: SVG_CENTER - (1.15 / 2.0) * GRID_HALF, y: SVG_CENTER },
    { key: 'mid-center', name: s.centerNeutral, u: 0, psi: 0, x: SVG_CENTER, y: SVG_CENTER },
    { key: 'mid-right', name: activeLang === 'pt' ? 'Discordo em Princípio' : activeLang === 'es' ? 'En desacuerdo en Principio' : 'Disagree in Principle', u: -1.15, psi: 0, x: SVG_CENTER - (-1.15 / 2.0) * GRID_HALF, y: SVG_CENTER },
    { key: 'bottom-left', name: s.disagreeEveryone, u: 1.15, psi: -1.15, x: SVG_CENTER - (1.15 / 2.0) * GRID_HALF, y: SVG_CENTER - (-1.15 / 2.0) * GRID_HALF },
    { key: 'bottom-center', name: `${s.axisSouth} (Direct)`, u: 0, psi: -1.15, x: SVG_CENTER, y: SVG_CENTER - (-1.15 / 2.0) * GRID_HALF },
    { key: 'bottom-right', name: s.disagreeSelf, u: -1.15, psi: -1.15, x: SVG_CENTER - (-1.15 / 2.0) * GRID_HALF, y: SVG_CENTER - (-1.15 / 2.0) * GRID_HALF },
  ], [s, activeLang]);

  const shares = useMemo(() => {
    return computeShares(currentU, currentPsi, anchors9);
  }, [anchors9, currentU, currentPsi]);

  const currentCol: 'left' | 'center' | 'right' =
    currentU > 0.38 ? 'left' : currentU < -0.38 ? 'right' : 'center';
  const currentRow: 'top' | 'mid' | 'bottom' =
    currentPsi > 0.38 ? 'top' : currentPsi < -0.38 ? 'bottom' : 'mid';
  const activeCell9 = `${currentRow}-${currentCol}`;

  function selectPreset9(u: number, psi: number) {
    if (disabled) return;
    const svgX = SVG_CENTER - (u / 2.0) * GRID_HALF;
    const svgY = SVG_CENTER - (psi / 2.0) * GRID_HALF;
    const vector = calculateVectorFromSvg(svgX, svgY);
    onSelect(vector.derived1D, vector);
  }

  function getStanceLabel(): string {
    if (is9Grid) {
      const activeShares = Object.values(shares)
        .filter((sh) => sh.pct >= 4)
        .sort((a, b) => b.pct - a.pct);

      if (activeShares.length === 0) {
        return s.centerNeutral;
      }

      if (activeShares.length === 1) {
        return `${activeShares[0].pct}% ${activeShares[0].name}`;
      }

      if (activeShares.length === 2) {
        return `${activeShares[0].pct}% ${activeShares[0].name} + ${activeShares[1].pct}% ${activeShares[1].name}`;
      }

      return `${activeShares[0].pct}% ${activeShares[0].name} + ${activeShares[1].pct}% ${activeShares[1].name} (+${100 - activeShares[0].pct - activeShares[1].pct}%)`;
    }
    if (!activeQuadrant || activeQuadrant === 'INDIFFERENT') return s.centerNeutral;
    switch (activeQuadrant) {
      case 'WILL_BE':
        return s.agreeEveryone;
      case 'CANT_BE':
        return s.agreeSelf;
      case 'MAY_BE':
        return s.disagreeEveryone;
      case 'WONT_BE':
        return s.disagreeSelf;
    }
  }

  return (
    <div className="target-pad-container" aria-label="2-Axis Target Pad">
      {/* Contexto do Eixo e Impacto Relativo */}
      {axis && agreedPoleName && opposedPoleName && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: 'var(--radius-md, 8px)',
            background: 'var(--surface-raised, rgba(0, 0, 0, 0.03))',
            border: '1px solid var(--line, #e2e8f0)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            fontSize: '0.82rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-strong)' }}>
              {axis.label}
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
              {axis.leftPole} ⟷ {axis.rightPole}
            </span>
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            <span>{s.axisImpactAgree} <strong style={{ color: 'var(--text-strong)' }}>{agreedPoleName}</strong></span>
            <span> · </span>
            <span>{s.axisImpactDisagree} <strong style={{ color: 'var(--text-strong)' }}>{opposedPoleName}</strong></span>
          </div>
        </div>
      )}

      <div className="target-pad-header">
        <span className="target-pad-mode-tag">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M12 3v18M3 12h18" />
          </svg>
          {s.modeTag}
        </span>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          {s.dragHint}
        </span>
      </div>

      <div className="target-pad-layout">
        {/* Grade Quadrada Exata [-2, +2] da Geometria das Definições */}
        <div className="target-svg-wrapper">
          <svg
            ref={svgRef}
            viewBox="0 0 300 300"
            className="target-svg"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            role="application"
            aria-label="Interactive 2-Axis Square Grid"
          >
            {/* Quadrado Externo: Horizonte Sistêmico (±2.0) */}
            <rect
              x={SVG_CENTER - GRID_HALF}
              y={SVG_CENTER - GRID_HALF}
              width={GRID_HALF * 2}
              height={GRID_HALF * 2}
              fill="var(--surface-raised, #ffffff)"
              stroke="var(--line, #cbd5e1)"
              strokeWidth="2"
            />

            {/* 4 Quadrantes Suaves da Geometria das Definições */}
            {/* Top-Left: Concordo para Todos (WILL_BE) */}
            <rect
              x={SVG_CENTER - GRID_HALF}
              y={SVG_CENTER - GRID_HALF}
              width={GRID_HALF}
              height={GRID_HALF}
              fill="rgba(34, 197, 94, 0.08)"
            />
            {/* Top-Right: Concordo para Mim/Grupo (CANT_BE) */}
            <rect
              x={SVG_CENTER}
              y={SVG_CENTER - GRID_HALF}
              width={GRID_HALF}
              height={GRID_HALF}
              fill="rgba(234, 179, 8, 0.08)"
            />
            {/* Bottom-Left: Discordo para Todos (MAY_BE) */}
            <rect
              x={SVG_CENTER - GRID_HALF}
              y={SVG_CENTER}
              width={GRID_HALF}
              height={GRID_HALF}
              fill="rgba(59, 130, 246, 0.08)"
            />
            {/* Bottom-Right: Discordo para Mim/Grupo (WONT_BE) */}
            <rect
              x={SVG_CENTER}
              y={SVG_CENTER}
              width={GRID_HALF}
              height={GRID_HALF}
              fill="rgba(239, 68, 68, 0.08)"
            />

            {/* Quadrado Interno Tracejado: Horizonte Humano / Individual (±1.0) */}
            <rect
              x={SVG_CENTER - INNER_HALF}
              y={SVG_CENTER - INNER_HALF}
              width={INNER_HALF * 2}
              height={INNER_HALF * 2}
              fill="none"
              stroke="var(--line, #94a3b8)"
              strokeWidth="1.2"
              strokeDasharray="4 4"
            />

            {/* Linhas Cruzadas dos Eixos Centrais */}
            <line
              x1={SVG_CENTER - GRID_HALF}
              y1={SVG_CENTER}
              x2={SVG_CENTER + GRID_HALF}
              y2={SVG_CENTER}
              stroke="var(--line, #64748b)"
              strokeWidth="1.5"
            />
            <line
              x1={SVG_CENTER}
              y1={SVG_CENTER - GRID_HALF}
              x2={SVG_CENTER}
              y2={SVG_CENTER + GRID_HALF}
              stroke="var(--line, #64748b)"
              strokeWidth="1.5"
            />

            {/* Zona Central de Indiferença */}
            <circle
              cx={SVG_CENTER}
              cy={SVG_CENTER}
              r={14}
              fill={activeQuadrant === 'INDIFFERENT' ? 'rgba(100, 116, 139, 0.35)' : 'rgba(148, 163, 184, 0.15)'}
              stroke="var(--line, #94a3b8)"
              strokeWidth="1.2"
            />

            {/* Rótulos dos Polos da Grade Quadrada */}
            <text x={SVG_CENTER} y={SVG_CENTER - GRID_HALF - 8} textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#0f766e">
              {s.axisNorth}
            </text>
            <text x={SVG_CENTER} y={SVG_CENTER + GRID_HALF + 16} textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#991b1b">
              {s.axisSouth}
            </text>
            <text x={SVG_CENTER - GRID_HALF + 4} y={SVG_CENTER - 6} textAnchor="start" fontSize="8.5" fontWeight="700" fill="#15803d">
              {s.axisWest}
            </text>
            <text x={SVG_CENTER + GRID_HALF - 4} y={SVG_CENTER - 6} textAnchor="end" fontSize="8.5" fontWeight="700" fill="#b45309">
              {s.axisEast}
            </text>

            {/* Âncoras da Grade de 9 e Linhas de Conexão com base em Compartilhamento (%) */}
            {is9Grid ? (
              anchors9.map((anc) => {
                const share = shares[anc.key];
                return (
                  <g key={anc.key}>
                    {share.pct >= 4 && (
                      <line
                        x1={anc.x}
                        y1={anc.y}
                        x2={currentCoord.x}
                        y2={currentCoord.y}
                        stroke={share.color}
                        strokeWidth={Math.max(1.2, (share.pct / 100) * 3.2)}
                        strokeDasharray="2 2"
                        opacity={Math.max(0.45, share.pct / 100)}
                        pointerEvents="none"
                      />
                    )}
                    <circle
                      cx={anc.x}
                      cy={anc.y}
                      r={anc.u === 0 && anc.psi === 0 ? 5 : 4}
                      fill={share.pct > 0 ? share.color : 'var(--line, #cbd5e1)'}
                      stroke="var(--surface, #ffffff)"
                      strokeWidth="1.5"
                      style={{ transition: 'fill 0.1s ease' }}
                    />
                  </g>
                );
              })
            ) : (
              selectedVector && (
                <line
                  x1={SVG_CENTER}
                  y1={SVG_CENTER}
                  x2={currentCoord.x}
                  y2={currentCoord.y}
                  stroke="var(--accent, #10b981)"
                  strokeWidth="2"
                  strokeDasharray="2 2"
                  pointerEvents="none"
                />
              )
            )}

            {/* Mira / Retículo Interativo */}
            <g transform={`translate(${currentCoord.x}, ${currentCoord.y})`} className="target-reticle">
              <circle cx="0" cy="0" r="7.5" fill="var(--accent, #10b981)" stroke="#ffffff" strokeWidth="2.5" />
              <line x1="-10" y1="0" x2="10" y2="0" stroke="var(--accent, #10b981)" strokeWidth="1.5" />
              <line x1="0" y1="-10" x2="0" y2="10" stroke="var(--accent, #10b981)" strokeWidth="1.5" />
            </g>
          </svg>
        </div>

        {/* Painel de Cenários Sensatos e Contextuais */}
        <div className="target-info-col">
          {/* Telemetria de Estado */}
          <div className="target-telemetry">
            <div className="target-telemetry-row">
              <span className="target-telemetry-label">{s.telemetryImpact}</span>
              <span className="target-telemetry-value" style={{ fontWeight: 700, color: 'var(--accent)' }}>
                {getStanceLabel()}
              </span>
            </div>
            <div className="target-telemetry-row">
              <span className="target-telemetry-label">{s.telemetryScope}</span>
              <span className="target-telemetry-value" style={{ color: currentU >= 0 ? '#15803d' : '#b45309' }}>
                {currentU > 0.25 ? s.axisWest : currentU < -0.25 ? s.axisEast : '—'}
              </span>
            </div>
            <div className="target-telemetry-row">
              <span className="target-telemetry-label">{s.telemetryAction}</span>
              <span className="target-telemetry-value" style={{ color: currentPsi >= 0 ? '#0f766e' : '#991b1b' }}>
                {currentPsi > 0.25 ? s.axisNorth : currentPsi < -0.25 ? s.axisSouth : s.levels.indifferent}
              </span>
            </div>
          </div>

          {/* Cenários Contextuais Concretos: Grade de 9 ou Grade de 4+1 */}
          {is9Grid ? (
            <div className="target-grid-9">
              {/* Linha 1: Superior (+ψ, Ação Positiva / Do) */}
              <button
                type="button"
                className={`target-cell-btn ${activeCell9 === 'top-left' ? 'is-active' : ''}`}
                style={{
                  borderColor: shares['top-left'].color,
                  background: shares['top-left'].bg,
                  boxShadow: shares['top-left'].pct >= 35 ? `0 0 0 1.5px ${shares['top-left'].color}` : undefined
                }}
                onClick={() => selectPreset9(1.15, 1.15)}
              >
                <div className="target-cell-title">
                  <span>{s.agreeEveryone}</span>
                  <span
                    className="target-cell-proximity-pill"
                    style={{
                      color: shares['top-left'].pct > 0 ? shares['top-left'].color : 'var(--text-muted)',
                      borderColor: shares['top-left'].pct > 0 ? shares['top-left'].color : 'var(--line)',
                      background: shares['top-left'].pct > 0 ? shares['top-left'].bg : 'transparent'
                    }}
                  >
                    {shares['top-left'].pct}%
                  </span>
                </div>
                <p className="target-cell-desc">{(scenarios as HegemonicScenario9Set).topLeft}</p>
              </button>

              <button
                type="button"
                className={`target-cell-btn ${activeCell9 === 'top-center' ? 'is-active' : ''}`}
                style={{
                  borderColor: shares['top-center'].color,
                  background: shares['top-center'].bg,
                  boxShadow: shares['top-center'].pct >= 35 ? `0 0 0 1.5px ${shares['top-center'].color}` : undefined
                }}
                onClick={() => selectPreset9(0, 1.15)}
              >
                <div className="target-cell-title">
                  <span>{activeLang === 'pt' ? 'Ação Direta' : activeLang === 'es' ? 'Acción Directa' : 'Direct Action'}</span>
                  <span
                    className="target-cell-proximity-pill"
                    style={{
                      color: shares['top-center'].pct > 0 ? shares['top-center'].color : 'var(--text-muted)',
                      borderColor: shares['top-center'].pct > 0 ? shares['top-center'].color : 'var(--line)',
                      background: shares['top-center'].pct > 0 ? shares['top-center'].bg : 'transparent'
                    }}
                  >
                    {shares['top-center'].pct}%
                  </span>
                </div>
                <p className="target-cell-desc">{(scenarios as HegemonicScenario9Set).topCenter}</p>
              </button>

              <button
                type="button"
                className={`target-cell-btn ${activeCell9 === 'top-right' ? 'is-active' : ''}`}
                style={{
                  borderColor: shares['top-right'].color,
                  background: shares['top-right'].bg,
                  boxShadow: shares['top-right'].pct >= 35 ? `0 0 0 1.5px ${shares['top-right'].color}` : undefined
                }}
                onClick={() => selectPreset9(-1.15, 1.15)}
              >
                <div className="target-cell-title">
                  <span>{s.agreeSelf}</span>
                  <span
                    className="target-cell-proximity-pill"
                    style={{
                      color: shares['top-right'].pct > 0 ? shares['top-right'].color : 'var(--text-muted)',
                      borderColor: shares['top-right'].pct > 0 ? shares['top-right'].color : 'var(--line)',
                      background: shares['top-right'].pct > 0 ? shares['top-right'].bg : 'transparent'
                    }}
                  >
                    {shares['top-right'].pct}%
                  </span>
                </div>
                <p className="target-cell-desc">{(scenarios as HegemonicScenario9Set).topRight}</p>
              </button>

              {/* Linha 2: Meio (0ψ, Princípio / Presente / É) */}
              <button
                type="button"
                className={`target-cell-btn ${activeCell9 === 'mid-left' ? 'is-active' : ''}`}
                style={{
                  borderColor: shares['mid-left'].color,
                  background: shares['mid-left'].bg,
                  boxShadow: shares['mid-left'].pct >= 35 ? `0 0 0 1.5px ${shares['mid-left'].color}` : undefined
                }}
                onClick={() => selectPreset9(1.15, 0)}
              >
                <div className="target-cell-title">
                  <span>{activeLang === 'pt' ? 'Em Princípio' : activeLang === 'es' ? 'En Principio' : 'In Principle'}</span>
                  <span
                    className="target-cell-proximity-pill"
                    style={{
                      color: shares['mid-left'].pct > 0 ? shares['mid-left'].color : 'var(--text-muted)',
                      borderColor: shares['mid-left'].pct > 0 ? shares['mid-left'].color : 'var(--line)',
                      background: shares['mid-left'].pct > 0 ? shares['mid-left'].bg : 'transparent'
                    }}
                  >
                    {shares['mid-left'].pct}%
                  </span>
                </div>
                <p className="target-cell-desc">{(scenarios as HegemonicScenario9Set).midLeft}</p>
              </button>

              <button
                type="button"
                className={`target-cell-btn is-center-neutral ${activeCell9 === 'mid-center' ? 'is-active' : ''}`}
                style={{
                  borderColor: shares['mid-center'].color,
                  background: shares['mid-center'].bg,
                  boxShadow: shares['mid-center'].pct >= 35 ? `0 0 0 1.5px ${shares['mid-center'].color}` : undefined
                }}
                onClick={() => selectPreset9(0, 0)}
              >
                <div className="target-cell-title">
                  <span>{activeLang === 'pt' ? 'Em Dúvida' : activeLang === 'es' ? 'En Duda' : 'Not Sure'}</span>
                  <span
                    className="target-cell-proximity-pill"
                    style={{
                      color: shares['mid-center'].pct > 0 ? shares['mid-center'].color : 'var(--text-muted)',
                      borderColor: shares['mid-center'].pct > 0 ? shares['mid-center'].color : 'var(--line)',
                      background: shares['mid-center'].pct > 0 ? shares['mid-center'].bg : 'transparent'
                    }}
                  >
                    {shares['mid-center'].pct}%
                  </span>
                </div>
                <p className="target-cell-desc">{(scenarios as HegemonicScenario9Set).center}</p>
              </button>

              <button
                type="button"
                className={`target-cell-btn ${activeCell9 === 'mid-right' ? 'is-active' : ''}`}
                style={{
                  borderColor: shares['mid-right'].color,
                  background: shares['mid-right'].bg,
                  boxShadow: shares['mid-right'].pct >= 35 ? `0 0 0 1.5px ${shares['mid-right'].color}` : undefined
                }}
                onClick={() => selectPreset9(-1.15, 0)}
              >
                <div className="target-cell-title">
                  <span>{activeLang === 'pt' ? 'Ceticismo' : activeLang === 'es' ? 'Escepticismo' : 'Skepticism'}</span>
                  <span
                    className="target-cell-proximity-pill"
                    style={{
                      color: shares['mid-right'].pct > 0 ? shares['mid-right'].color : 'var(--text-muted)',
                      borderColor: shares['mid-right'].pct > 0 ? shares['mid-right'].color : 'var(--line)',
                      background: shares['mid-right'].pct > 0 ? shares['mid-right'].bg : 'transparent'
                    }}
                  >
                    {shares['mid-right'].pct}%
                  </span>
                </div>
                <p className="target-cell-desc">{(scenarios as HegemonicScenario9Set).midRight}</p>
              </button>

              {/* Linha 3: Inferior (-ψ, Ação de Rejeição / Do Not) */}
              <button
                type="button"
                className={`target-cell-btn ${activeCell9 === 'bottom-left' ? 'is-active' : ''}`}
                style={{
                  borderColor: shares['bottom-left'].color,
                  background: shares['bottom-left'].bg,
                  boxShadow: shares['bottom-left'].pct >= 35 ? `0 0 0 1.5px ${shares['bottom-left'].color}` : undefined
                }}
                onClick={() => selectPreset9(1.15, -1.15)}
              >
                <div className="target-cell-title">
                  <span>{s.disagreeEveryone}</span>
                  <span
                    className="target-cell-proximity-pill"
                    style={{
                      color: shares['bottom-left'].pct > 0 ? shares['bottom-left'].color : 'var(--text-muted)',
                      borderColor: shares['bottom-left'].pct > 0 ? shares['bottom-left'].color : 'var(--line)',
                      background: shares['bottom-left'].pct > 0 ? shares['bottom-left'].bg : 'transparent'
                    }}
                  >
                    {shares['bottom-left'].pct}%
                  </span>
                </div>
                <p className="target-cell-desc">{(scenarios as HegemonicScenario9Set).bottomLeft}</p>
              </button>

              <button
                type="button"
                className={`target-cell-btn ${activeCell9 === 'bottom-center' ? 'is-active' : ''}`}
                style={{
                  borderColor: shares['bottom-center'].color,
                  background: shares['bottom-center'].bg,
                  boxShadow: shares['bottom-center'].pct >= 35 ? `0 0 0 1.5px ${shares['bottom-center'].color}` : undefined
                }}
                onClick={() => selectPreset9(0, -1.15)}
              >
                <div className="target-cell-title">
                  <span>{activeLang === 'pt' ? 'Ação Direta' : activeLang === 'es' ? 'Acción Directa' : 'Direct Action'}</span>
                  <span
                    className="target-cell-proximity-pill"
                    style={{
                      color: shares['bottom-center'].pct > 0 ? shares['bottom-center'].color : 'var(--text-muted)',
                      borderColor: shares['bottom-center'].pct > 0 ? shares['bottom-center'].color : 'var(--line)',
                      background: shares['bottom-center'].pct > 0 ? shares['bottom-center'].bg : 'transparent'
                    }}
                  >
                    {shares['bottom-center'].pct}%
                  </span>
                </div>
                <p className="target-cell-desc">{(scenarios as HegemonicScenario9Set).bottomCenter}</p>
              </button>

              <button
                type="button"
                className={`target-cell-btn ${activeCell9 === 'bottom-right' ? 'is-active' : ''}`}
                style={{
                  borderColor: shares['bottom-right'].color,
                  background: shares['bottom-right'].bg,
                  boxShadow: shares['bottom-right'].pct >= 35 ? `0 0 0 1.5px ${shares['bottom-right'].color}` : undefined
                }}
                onClick={() => selectPreset9(-1.15, -1.15)}
              >
                <div className="target-cell-title">
                  <span>{s.disagreeSelf}</span>
                  <span
                    className="target-cell-proximity-pill"
                    style={{
                      color: shares['bottom-right'].pct > 0 ? shares['bottom-right'].color : 'var(--text-muted)',
                      borderColor: shares['bottom-right'].pct > 0 ? shares['bottom-right'].color : 'var(--line)',
                      background: shares['bottom-right'].pct > 0 ? shares['bottom-right'].bg : 'transparent'
                    }}
                  >
                    {shares['bottom-right'].pct}%
                  </span>
                </div>
                <p className="target-cell-desc">{(scenarios as HegemonicScenario9Set).bottomRight}</p>
              </button>
            </div>
          ) : (
            <>
              {/* Os 4 Cenários Contextuais Clássicos */}
              <div className="target-quadrants-grid">
                {/* Top-Left: Concordo para Todos */}
                <button
                  type="button"
                  className={`target-quadrant-btn is-will-be ${activeQuadrant === 'WILL_BE' ? 'is-active' : ''}`}
                  onClick={() => selectPreset('WILL_BE')}
                >
                  <div className="target-quadrant-title">
                    <span>{s.agreeEveryone}</span>
                    <span className="target-quadrant-badge badge-will">{s.axisNorth}</span>
                  </div>
                  <p className="target-quadrant-desc">
                    {(scenarios as HegemonicScenarioSet).willBe}
                  </p>
                </button>

                {/* Top-Right: Concordo para Mim / Grupo */}
                <button
                  type="button"
                  className={`target-quadrant-btn is-cant-be ${activeQuadrant === 'CANT_BE' ? 'is-active' : ''}`}
                  onClick={() => selectPreset('CANT_BE')}
                >
                  <div className="target-quadrant-title">
                    <span>{s.agreeSelf}</span>
                    <span className="target-quadrant-badge badge-cant">{s.axisNorth}</span>
                  </div>
                  <p className="target-quadrant-desc">
                    {(scenarios as HegemonicScenarioSet).cantBe}
                  </p>
                </button>

                {/* Bottom-Left: Discordo para Todos */}
                <button
                  type="button"
                  className={`target-quadrant-btn is-may-be ${activeQuadrant === 'MAY_BE' ? 'is-active' : ''}`}
                  onClick={() => selectPreset('MAY_BE')}
                >
                  <div className="target-quadrant-title">
                    <span>{s.disagreeEveryone}</span>
                    <span className="target-quadrant-badge badge-may">{s.axisSouth}</span>
                  </div>
                  <p className="target-quadrant-desc">
                    {(scenarios as HegemonicScenarioSet).mayBe}
                  </p>
                </button>

                {/* Bottom-Right: Discordo para Mim / Grupo */}
                <button
                  type="button"
                  className={`target-quadrant-btn is-wont-be ${activeQuadrant === 'WONT_BE' ? 'is-active' : ''}`}
                  onClick={() => selectPreset('WONT_BE')}
                >
                  <div className="target-quadrant-title">
                    <span>{s.disagreeSelf}</span>
                    <span className="target-quadrant-badge badge-wont">{s.axisSouth}</span>
                  </div>
                  <p className="target-quadrant-desc">
                    {(scenarios as HegemonicScenarioSet).wontBe}
                  </p>
                </button>
              </div>

              {/* Opção Neutra de Centro */}
              <button
                type="button"
                className={`target-center-indifference-btn ${activeQuadrant === 'INDIFFERENT' ? 'is-active' : ''}`}
                onClick={() => selectPreset('INDIFFERENT')}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                {(scenarios as HegemonicScenarioSet).indifferent}
              </button>
            </>
          )}

          {/* Botão Explícito de Avançar */}
          {onConfirm && (
            <button
              type="button"
              className="target-confirm-advance-btn"
              onClick={() => {
                const vector = calculateVectorFromSvg(currentCoord.x, currentCoord.y);
                onConfirm(vector.derived1D, vector);
              }}
            >
              {s.confirmBtn}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Constrói cenários concretos e compreensíveis para cada quadrante
 * com base na pergunta, sua ajuda e nos polos do eixo.
 */
function getContextualScenarios(
  question: Question,
  _agreedPole: string | undefined,
  _opposedPole: string | undefined,
  lang: 'en' | 'es' | 'pt'
): HegemonicScenario {
  // 1. Cenários curados do banco de dados hegemônico (passaram pelo Pub Test)
  const langKey = lang === 'pt' ? 'pt' : 'en';
  const curated = HEGEMONIC_SCENARIOS[langKey]?.[question.id] || HEGEMONIC_SCENARIOS.en?.[question.id];
  if (curated) {
    return curated;
  }

  // Se a pergunta tem texto de ajuda curado
  if (question.help) {
    if (lang === 'pt') {
      return {
        willBe: `Concordo porque "${question.help.agree}" fortalece o bem comum e a estabilidade social de todos.`,
        cantBe: `Concordo porque "${question.help.agree}" traz benefícios materiais ou vantagens diretas para mim ou meu grupo.`,
        mayBe: `Oponho-me porque "${question.help.disagree}" protege os direitos gerais e impede danos sistêmicos à população.`,
        wontBe: `Oponho-me porque "${question.help.disagree}" evita impostos, regulações ou perdas que recairiam sobre mim ou meu setor.`,
        indifferent: 'Não sei / Em dúvida (Sem opinião formada ou faltam dados sobre a questão)'
      };
    }
    if (lang === 'es') {
      return {
        willBe: `De acuerdo porque "${question.help.agree}" fortalece el bienestar común y la justicia para todos.`,
        cantBe: `De acuerdo porque "${question.help.agree}" aporta ventajas materiales directas para mí o mi sector.`,
        mayBe: `En desacuerdo porque "${question.help.disagree}" previene daños colectivos e injusticias para la sociedad.`,
        wontBe: `En desacuerdo porque "${question.help.disagree}" evita cargas o regulaciones perjudiciales para mi grupo.`,
        indifferent: 'No lo sé / No estoy seguro (Sin opinión formada o faltan datos)'
      };
    }
    return {
      willBe: `I agree because "${question.help.agree}" strengthens the common good, fairness, and society as a whole.`,
      cantBe: `I agree because "${question.help.agree}" secures practical advantages or protection for me or my group.`,
      mayBe: `I oppose this because "${question.help.disagree}" protects the broader public from systemic harm or imbalance.`,
      wontBe: `I oppose this because "${question.help.disagree}" prevents unfair burdens, costs, or restrictions on my group or me.`,
      indifferent: "I don't know / Not sure (No clear opinion or need more information)"
    };
  }

  // Padrão universal limpo e natural (sem interpolação de palavras quebradas)
  if (lang === 'pt') {
    return {
      willBe: 'Apoio porque fortalece o bem comum, a igualdade de direitos e a estabilidade de toda a sociedade.',
      cantBe: 'Apoio porque traz vantagens diretas, liberdade ou proteção prática para mim ou meu grupo.',
      mayBe: 'Oponho-me porque prejudica a sociedade, gera instabilidade sistêmica ou injustiça coletiva.',
      wontBe: 'Oponho-me porque impõe custos, regulações ou perdas injustas sobre mim ou meu setor.',
      indifferent: 'Não sei / Em dúvida (Sem opinião formada ou faltam informações)'
    };
  }

  if (lang === 'es') {
    return {
      willBe: 'Apoyo esto porque fortalece el bien común, la igualdad y la estabilidad de toda la sociedad.',
      cantBe: 'Apoyo esto porque aporta ventajas directas, libertad o protección práctica para mí o mi grupo.',
      mayBe: 'Me opongo porque perjudica a la sociedad, genera inestabilidad sistémica o injusticia colectiva.',
      wontBe: 'Me opongo porque impone costes, regulaciones o cargas injustas sobre mí o mi sector.',
      indifferent: 'No lo sé / No estoy seguro (Sin opinión formada o faltan datos)'
    };
  }

  return {
    willBe: 'I support this because it strengthens the public good, fairness, and stability for society as a whole.',
    cantBe: 'I support this because it provides direct advantages, freedom, or protection for me and my group.',
    mayBe: 'I oppose this because it harms society, causes systemic instability, or creates collective injustice.',
    wontBe: 'I oppose this because it imposes unfair costs, regulations, or burdens on me and my group.',
    indifferent: "I don't know / Not sure (No clear opinion or need more information)"
  };
}
