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

export interface AnchorNode {
  key: string;
  name: string;
  u: number;
  psi: number;
  x: number;
  y: number;
}

export interface AnchorShare extends AnchorNode {
  distance: number;
  pct: number;
  color: string;
  bg: string;
}

export const PERIMETER_ANCHOR_ORDER = [
  'top-center',    // 0: 0° (North)
  'top-right',     // 1: 45° (North-East)
  'mid-right',     // 2: 90° (East)
  'bottom-right',  // 3: 135° (South-East)
  'bottom-center', // 4: 180° (South)
  'bottom-left',   // 5: 225° (South-West)
  'mid-left',      // 6: 270° (West)
  'top-left',      // 7: 315° (North-West)
];

export function computeShares(u: number, psi: number, anchors: AnchorNode[]): Record<string, AnchorShare> {
  const dists = anchors.map((a) => {
    const dx = u - a.u;
    const dy = psi - a.psi;
    return Math.sqrt(dx * dx + dy * dy);
  });

  const rawPcts: Record<string, number> = {};
  anchors.forEach((a) => {
    rawPcts[a.key] = 0;
  });

  const is9 = anchors.length === 9 && anchors.some((a) => a.key === 'mid-center');

  if (is9) {
    // Modelo Polar: Magnitude Radial (Chebyshev / L-infinito até anel ±1.15)
    const anchorRingRadius = 1.15;
    const distChebyshev = Math.max(Math.abs(u), Math.abs(psi));

    // Zona central estrita se muito próximo da origem
    if (distChebyshev <= 0.05) {
      rawPcts['mid-center'] = 100;
    } else {
      // Magnitude de convicção perimétrica (0.0 no limiar central até 1.0 no anel ou além)
      const m = Math.min(1.0, (distChebyshev - 0.05) / (anchorRingRadius - 0.05));

      // Centro retém convicção inversamente à magnitude
      const centerShare = (1.0 - m) * 100;
      rawPcts['mid-center'] = centerShare;

      // Restante 100% distribuído estritamente no setor angular entre os dois pontos vizinhos
      const perimeterShare = m * 100;

      // Ângulo de rumo (bearing 0° a 360°, sentido horário: 0° = Norte / Top-Center)
      // dx na tela = -u; dy na tela = -psi
      const bearing = (Math.atan2(-u, psi) * (180 / Math.PI) + 360) % 360;

      const sectorExact = bearing / 45.0;
      const k = Math.floor(sectorExact) % 8;
      const kNext = (k + 1) % 8;
      const fracNext = sectorExact - Math.floor(sectorExact);
      const fracCurr = 1.0 - fracNext;

      const keyCurr = PERIMETER_ANCHOR_ORDER[k];
      const keyNext = PERIMETER_ANCHOR_ORDER[kNext];

      rawPcts[keyCurr] = perimeterShare * fracCurr;
      rawPcts[keyNext] = perimeterShare * fracNext;
      // Os outros 6 âncoras perimétricas permanecem estritamente em 0%
    }
  } else {
    // Modo de fallback (ex: 4 quadrantes clássicos)
    const minDist = Math.min(...dists);
    if (minDist < 0.04) {
      const exactIdx = dists.indexOf(minDist);
      anchors.forEach((a, i) => {
        rawPcts[a.key] = i === exactIdx ? 100 : 0;
      });
    } else {
      const R = Math.max(1.65, minDist + 0.35);
      const rawWeights = dists.map((d) => (d >= R ? 0 : Math.pow(1 - d / R, 3)));
      const sumWeights = rawWeights.reduce((acc, w) => acc + w, 0);
      anchors.forEach((a, i) => {
        rawPcts[a.key] = sumWeights > 0 ? (rawWeights[i] / sumWeights) * 100 : 0;
      });
    }
  }

  // Arredondamento e garantia estrita de soma 100%
  const roundedPcts: Record<string, number> = {};
  let total = 0;
  let maxKey = anchors[0].key;
  let maxVal = -1;

  anchors.forEach((a) => {
    const r = Math.round(rawPcts[a.key] || 0);
    roundedPcts[a.key] = r;
    total += r;
    if ((rawPcts[a.key] || 0) > maxVal) {
      maxVal = rawPcts[a.key] || 0;
      maxKey = a.key;
    }
  });

  const diff = 100 - total;
  if (diff !== 0 && roundedPcts[maxKey] !== undefined) {
    roundedPcts[maxKey] += diff;
  }

  const result: Record<string, AnchorShare> = {};
  anchors.forEach((anc, i) => {
    const pct = roundedPcts[anc.key] || 0;
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

  function getStanceSentence(): string {
    if (is9Grid) {
      const sorted = Object.values(shares).sort((a, b) => b.pct - a.pct);
      const top1 = sorted[0];
      const top2 = sorted[1];

      // 1. Centro dominante
      if (top1.key === 'mid-center' && top1.pct >= 55) {
        if (activeLang === 'pt') return 'Você está atualmente indeciso ou em dúvida sobre esta questão.';
        if (activeLang === 'es') return 'Actualmente estás indeciso o con dudas sobre este tema.';
        return 'You are currently undecided or unsure about this issue.';
      }

      // 2. Inclinando para uma postura, mas com incerteza central
      if (top1.key !== 'mid-center' && top2.key === 'mid-center' && top2.pct >= 28) {
        if (activeLang === 'pt') {
          switch (top1.key) {
            case 'top-left': return 'Você tende a concordar em prol de todos, mas mantém certas dúvidas.';
            case 'top-center': return 'Você tende a apoiar uma ação prática direta, mas mantém dúvidas.';
            case 'top-right': return 'Você tende a concordar por autonomia pessoal, mas mantém dúvidas.';
            case 'mid-left': return 'Você tende a concordar em princípio, mas tem ressalvas práticas.';
            case 'mid-right': return 'Você tende ao ceticismo, priorizando sua própria segurança.';
            case 'bottom-left': return 'Você tende a discordar para proteger o público, mas mantém dúvidas.';
            case 'bottom-center': return 'Você tende a discordar por estabilidade institucional, com dúvidas.';
            case 'bottom-right': return 'Você tende a discordar para não ser lesado, mas mantém dúvidas.';
          }
        }
        if (activeLang === 'es') {
          switch (top1.key) {
            case 'top-left': return 'Te inclinas por estar de acuerdo para todos, pero mantienes dudas.';
            case 'top-center': return 'Te inclinas por apoyar la acción directa, pero mantienes dudas.';
            case 'top-right': return 'Te inclinas por la autonomía personal, pero mantienes dudas.';
            case 'mid-left': return 'Te inclinas a estar de acuerdo en principio, con ciertas reservas.';
            case 'mid-right': return 'Te inclinas hacia el escepticismo, priorizando tu seguridad.';
            case 'bottom-left': return 'Te inclinas por rechazar esto para proteger al público, con dudas.';
            case 'bottom-center': return 'Te inclinas por rechazar esto por estabilidad institucional, con dudas.';
            case 'bottom-right': return 'Te inclinas por rechazar esto para no ser perjudicado, con dudas.';
          }
        }
        switch (top1.key) {
          case 'top-left': return 'You lean toward agreeing for everyone, but remain somewhat undecided.';
          case 'top-center': return 'You lean toward direct practical action, but remain somewhat undecided.';
          case 'top-right': return 'You lean toward personal freedom and self-interest, but remain somewhat undecided.';
          case 'mid-left': return 'You lean toward agreeing in principle, but have practical reservations.';
          case 'mid-right': return 'You lean toward skepticism in principle, prioritizing personal self-reliance.';
          case 'bottom-left': return 'You lean toward defending public welfare, but remain somewhat undecided.';
          case 'bottom-center': return 'You lean toward institutional defense, but remain somewhat undecided.';
          case 'bottom-right': return 'You lean toward protecting yourself from exploitation, but remain somewhat undecided.';
        }
      }

      // 3. Postura única firme (>= 60%)
      if (top1.pct >= 60) {
        if (activeLang === 'pt') {
          switch (top1.key) {
            case 'top-left': return 'Você concorda firmemente que isto deve ser apoiado para o bem de todos.';
            case 'top-center': return 'Você apoia ação decisiva e direta para implementar esta medida.';
            case 'top-right': return 'Você concorda, priorizando a liberdade pessoal e autonomia financeira.';
            case 'mid-left': return 'Você concorda em princípio com o ideal, sem exigir coerção estatal pesada.';
            case 'mid-right': return 'Você é cético em princípio, priorizando independência e autossuficiência.';
            case 'bottom-left': return 'Você discorda firmemente para defender os serviços públicos e a comunidade.';
            case 'bottom-center': return 'Você discorda diretamente através de regras institucionais e estabilidade legal.';
            case 'bottom-right': return 'Você rejeita isto para não ser lesado nem carregar o fardo alheio.';
            case 'mid-center': return 'Você está atualmente indeciso ou vê razões válidas em ambos os lados.';
          }
        }
        if (activeLang === 'es') {
          switch (top1.key) {
            case 'top-left': return 'Estás firmemente de acuerdo en apoyar esto por el bien común de todos.';
            case 'top-center': return 'Apoyas una acción directa y decisiva para implementar esta política.';
            case 'top-right': return 'Estás de acuerdo, priorizando la libertad personal y la autonomía financiera.';
            case 'mid-left': return 'Estás de acuerdo en principio con la idea, sin exigir imposición estatal severa.';
            case 'mid-right': return 'Eres escéptico en principio, priorizando la independencia y la autosuficiencia.';
            case 'bottom-left': return 'Rechazas firmemente esto para defender los servicios públicos y la comunidad.';
            case 'bottom-center': return 'Te opones directamente mediante normas institucionales y estabilidad legal.';
            case 'bottom-right': return 'Rechazas esto para evitar ser perjudicado o cargar con costes ajenos.';
            case 'mid-center': return 'Actualmente estás indeciso o ves razones válidas en ambas posturas.';
          }
        }
        switch (top1.key) {
          case 'top-left': return 'You firmly agree that this should be supported for the common good of everyone.';
          case 'top-center': return 'You favor direct, decisive action to implement this policy.';
          case 'top-right': return 'You agree, prioritizing personal freedom and financial autonomy.';
          case 'mid-left': return 'You agree in principle for everyone, without favoring heavy state enforcement.';
          case 'mid-right': return 'You are skeptical in principle, prioritizing personal and financial self-reliance.';
          case 'bottom-left': return 'You firmly oppose this to protect public services and community welfare.';
          case 'bottom-center': return 'You oppose this directly through institutional rules and stability.';
          case 'bottom-right': return 'You reject this to avoid being exploited or footing the bill for others.';
          case 'mid-center': return 'You are currently undecided or unsure about this issue.';
        }
      }

      // 4. Postura dividida entre dois âncoras perimétricos (ex: mid-left + bottom-left)
      const pair = [top1.key, top2.key].sort().join('+');
      if (activeLang === 'pt') {
        switch (pair) {
          case 'bottom-left+mid-left': return 'Você concorda com o princípio em teoria, mas rejeita a medida para proteger o bem público.';
          case 'mid-left+top-left': return 'Você apoia o bem público, equilibrando o princípio com respaldo ativo da comunidade.';
          case 'top-center+top-left': return 'Você defende ação decisiva que beneficie diretamente toda a comunidade.';
          case 'top-center+top-right': return 'Você apoia ação prática direta, guiada pela liberdade pessoal e autossuficiência.';
          case 'mid-right+top-right': return 'Você valoriza a autonomia pessoal, combinando concordância prática com ceticismo.';
          case 'bottom-right+mid-right': return 'Você é cético quanto à política e rejeita carregar um fardo injusto.';
          case 'bottom-center+bottom-right': return 'Você discorda firmemente para evitar exploração e proteger seu patrimônio.';
          case 'bottom-center+bottom-left': return 'Você se opõe a esta medida para resguardar as instituições e serviços públicos.';
        }
      } else if (activeLang === 'es') {
        switch (pair) {
          case 'bottom-left+mid-left': return 'Estás de acuerdo con el principio en teoría, pero te opones para proteger el bien público.';
          case 'mid-left+top-left': return 'Apoyas el bien común, combinando el principio con respaldo activo de la comunidad.';
          case 'top-center+top-left': return 'Defiendes una acción decisiva que beneficie directamente a toda la comunidad.';
          case 'top-center+top-right': return 'Apoyas la acción práctica directa, impulsada por la autonomía personal.';
          case 'mid-right+top-right': return 'Valoras la autonomía personal, combinando acuerdo práctico con escepticismo.';
          case 'bottom-right+mid-right': return 'Eres escéptico ante la política y rechazas asumir una carga injusta.';
          case 'bottom-center+bottom-right': return 'Te opones firmemente para evitar la explotación y proteger a tu familia.';
          case 'bottom-center+bottom-left': return 'Te opones para resguardar los servicios públicos y la estabilidad institucional.';
        }
      } else {
        switch (pair) {
          case 'bottom-left+mid-left': return 'You agree with the principle in theory, but oppose the policy to protect the public good.';
          case 'mid-left+top-left': return 'You support the public good, balancing principle with active community backing.';
          case 'top-center+top-left': return 'You favor decisive, direct action that benefits the entire community.';
          case 'top-center+top-right': return 'You support direct action, driven by personal and practical autonomy.';
          case 'mid-right+top-right': return 'You favor personal independence, balancing agreement with practical skepticism.';
          case 'bottom-right+mid-right': return 'You are skeptical of this policy and reject carrying an unfair burden.';
          case 'bottom-center+bottom-right': return 'You firmly oppose this to prevent exploitation and protect your household.';
          case 'bottom-center+bottom-left': return 'You oppose this measure to defend public services and institutional stability.';
        }
      }

      // Fallback genérico caso seja uma combinação atípica
      return activeLang === 'pt'
        ? `Você equilibra posições entre ${top1.name} e ${top2.name}.`
        : activeLang === 'es'
        ? `Equilibras tu postura entre ${top1.name} y ${top2.name}.`
        : `You balance your position between ${top1.name} and ${top2.name}.`;
    }

    if (!activeQuadrant || activeQuadrant === 'INDIFFERENT') return s.centerNeutral;
    switch (activeQuadrant) {
      case 'WILL_BE': return s.agreeEveryone;
      case 'CANT_BE': return s.agreeSelf;
      case 'MAY_BE': return s.disagreeEveryone;
      case 'WONT_BE': return s.disagreeSelf;
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
          {/* Leitura Dinâmica em Sentença Fluida */}
          <div className="target-telemetry" role="status" aria-live="polite">
            <span className="target-telemetry-sentence">
              {getStanceSentence()}
            </span>
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
        topLeft: `Concordo porque "${question.help.agree}" fortalece o bem comum e a estabilidade social de todos.`,
        topCenter: `Adotar ações práticas e diretas para aplicar "${question.help.agree}" nas instituições públicas.`,
        topRight: `Concordo porque "${question.help.agree}" traz benefícios materiais ou vantagens diretas para mim ou meu grupo.`,
        midLeft: `Apoiar "${question.help.agree}" é correto em princípio, mas a aplicação prática exige ponderação e limites.`,
        center: `Existem pontos válidos e desafios reais em relação a "${question.help.agree}".`,
        midRight: `Discursos sobre "${question.help.agree}" soam bem na teoria, mas na prática costumam ser distorcidos.`,
        bottomLeft: `Oponho-me porque "${question.help.disagree}" protege os direitos gerais e impede danos sistêmicos à população.`,
        bottomCenter: `Manter as salvaguardas institucionais e a estabilidade legal antes de impor mudanças bruscas.`,
        bottomRight: `Oponho-me porque "${question.help.disagree}" evita impostos, regulações ou perdas que recairiam sobre mim ou meu setor.`
      };
    }
    if (lang === 'es') {
      return {
        topLeft: `De acuerdo porque "${question.help.agree}" fortalece el bienestar común y la justicia para todos.`,
        topCenter: `Tomar medidas prácticas y directas para implementar "${question.help.agree}" en las instituciones públicas.`,
        topRight: `De acuerdo porque "${question.help.agree}" aporta ventajas materiales directas para mí o mi sector.`,
        midLeft: `Apoyar "${question.help.agree}" es positivo en principio, aunque su aplicación real requiere cautela y equilibrio.`,
        center: `Existen argumentos razonables y dilemas complejos en torno a "${question.help.agree}".`,
        midRight: `Las propuestas sobre "${question.help.agree}" suenan bien en el papel, pero en la realidad suelen defraudar.`,
        bottomLeft: `En desacuerdo porque "${question.help.disagree}" previene daños colectivos e injusticias para la sociedad.`,
        bottomCenter: `Mantener la estabilidad institucional y el marco legal vigente frente a cambios precipitados.`,
        bottomRight: `En desacuerdo porque "${question.help.disagree}" evita cargas o regulaciones perjudiciales para mi grupo.`
      };
    }
    return {
      topLeft: `I support this because "${question.help.agree}" strengthens the common good, fairness, and society as a whole.`,
      topCenter: `Take decisive practical action to implement "${question.help.agree}" across public institutions.`,
      topRight: `I support this because "${question.help.agree}" secures practical advantages or protection for me or my group.`,
      midLeft: `Supporting "${question.help.agree}" is good in principle, though practical implementation requires careful balance.`,
      center: `Valid points and real tradeoffs exist on both sides of "${question.help.agree}".`,
      midRight: `Proposals claiming "${question.help.agree}" often sound good on paper but fail to deliver in real life.`,
      bottomLeft: `I oppose this because "${question.help.disagree}" protects the broader public from systemic harm or imbalance.`,
      bottomCenter: `Maintain institutional stability and existing legal safeguards rather than rushing into disruptive changes.`,
      bottomRight: `I oppose this because "${question.help.disagree}" prevents unfair burdens, costs, or restrictions on my group or me.`
    };
  }

  // Padrão universal limpo e natural (sem interpolação de palavras quebradas)
  if (lang === 'pt') {
    return {
      topLeft: 'Apoio porque fortalece o bem comum, a igualdade de direitos e a estabilidade de toda a sociedade.',
      topCenter: 'Adotar medidas práticas e diretas para concretizar essa diretriz nas políticas públicas.',
      topRight: 'Apoio porque traz vantagens diretas, liberdade ou proteção prática para mim ou meu grupo.',
      midLeft: 'Concordo com o princípio geral desta medida, desde que aplicada com moderação e bom senso.',
      center: 'Existem argumentos legítimos e dilemas complexos de ambos os lados.',
      midRight: 'Parece positivo na teoria, mas na prática corre sério risco de gerar ineficiência e abusos.',
      bottomLeft: 'Oponho-me porque prejudica a sociedade, gera instabilidade sistêmica ou injustiça coletiva.',
      bottomCenter: 'Preservar as instituições e regras existentes em vez de adotar intervenções arriscadas.',
      bottomRight: 'Oponho-me porque impõe custos, regulações ou perdas injustas sobre mim ou meu setor.'
    };
  }

  if (lang === 'es') {
    return {
      topLeft: 'Apoyo esto porque fortalece el bien común, la igualdad y la estabilidad de toda la sociedad.',
      topCenter: 'Tomar acciones directas y eficaces para aplicar esta directriz en las políticas públicas.',
      topRight: 'Apoyo esto porque aporta ventajas directas, libertad o protección práctica para mí o mi grupo.',
      midLeft: 'Comparto el principio de fondo, siempre que se ejecute con prudencia y respeto a la realidad.',
      center: 'Existen argumentos atendibles e incertidumbres en ambas posturas.',
      midRight: 'Suena bien en el discurso, pero en la práctica suele generar burocracia inútil y arbitrariedades.',
      bottomLeft: 'Me opongo porque perjudica a la sociedad, genera inestabilidad sistémica o injusticia colectiva.',
      bottomCenter: 'Preservar las instituciones y normativas existentes antes de emprender cambios drásticos.',
      bottomRight: 'Me opongo porque impone costes, regulaciones o cargas injustas sobre mí o mi sector.'
    };
  }

  return {
    topLeft: 'I support this because it strengthens the public good, fairness, and stability for society as a whole.',
    topCenter: 'Take decisive practical action to implement this standard across key institutions.',
    topRight: 'I support this because it provides direct advantages, freedom, or protection for me and my group.',
    midLeft: 'I agree with the broad principle here, provided practical tradeoffs are handled sensibly.',
    center: 'Valid arguments and real complexities exist on both sides of this issue.',
    midRight: 'It sounds noble in theory, but in reality it is prone to inefficiency, corruption, or unintended harm.',
    bottomLeft: 'I oppose this because it harms society, causes systemic instability, or creates collective injustice.',
    bottomCenter: 'Preserve existing constitutional safeguards and institutional stability rather than rushing into changes.',
    bottomRight: 'I oppose this because it imposes unfair costs, regulations, or burdens on me and my group.'
  };
}
