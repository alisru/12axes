import { describe, expect, it } from 'vitest';
import type { AnswerValue, ParableQuadrant, Question, VectorAnswer } from '../src/types/quiz';

describe('Question Target Pad & 2D Vector Polar Answering Engine', () => {
  const sampleQuestion: Question = {
    id: 'diplomacia_18',
    axisId: 'diplomacia',
    text: 'As forças armadas devem ser desmanteladas.',
    agreePole: 'LEFT',
    weight: 1.0
  };

  function simulateVectorCalculation(normX: number, normY: number): VectorAnswer {
    const dist = Math.sqrt(normX * normX + normY * normY);
    const clampedDist = Math.min(dist, 2.0);
    const angleRad = Math.atan2(normY, normX);
    const angleDeg = (angleRad * (180 / Math.PI) + 360) % 360;

    let quadrant: ParableQuadrant;
    let derived1D: AnswerValue;

    if (clampedDist < 0.28) {
      quadrant = 'INDIFFERENT';
      derived1D = 'NEUTRAL';
    } else {
      if (normX >= 0) {
        quadrant = normY >= 0 ? 'WILL_BE' : 'MAY_BE';
      } else {
        quadrant = normY >= 0 ? 'CANT_BE' : 'WONT_BE';
      }
      derived1D = normY >= 0.85 ? 'STRONGLY_AGREE' : normY >= 0.2 ? 'AGREE' : normY <= -0.85 ? 'STRONGLY_DISAGREE' : normY <= -0.2 ? 'DISAGREE' : 'NEUTRAL';
    }

    return {
      questionId: sampleQuestion.id,
      x: Math.round(normX * 100) / 100,
      y: Math.round(normY * 100) / 100,
      magnitude: Math.round(clampedDist * 100) / 100,
      angleDeg: Math.round(angleDeg),
      derived1D,
      quadrant
    };
  }

  it('correctly maps center origin (0, 0) to Indifference / Zero Will', () => {
    const center = simulateVectorCalculation(0, 0);
    expect(center.magnitude).toBe(0);
    expect(center.quadrant).toBe('INDIFFERENT');
    expect(center.derived1D).toBe('NEUTRAL');
  });

  it('separates the False Opposite on diplomacia_18 (Abolish Armed Forces)', () => {
    // Sovereign Protective Citizen (Opposes dismantling to protect people against invasion: +υ, -ψ)
    const defensiveSovereign = simulateVectorCalculation(1.2, -1.2);
    expect(defensiveSovereign.quadrant).toBe('MAY_BE');
    expect(defensiveSovereign.derived1D).toBe('STRONGLY_DISAGREE');
    expect(defensiveSovereign.x).toBeGreaterThan(0); // Positive Moral Beneficiary (+υ: All people protected)
    expect(defensiveSovereign.y).toBeLessThan(0); // Opposes dismantling

    // Imperial Conquest Warmonger (Opposes dismantling to preserve military for conquering neighbors: -υ, -ψ)
    const imperialWarmonger = simulateVectorCalculation(-1.2, -1.2);
    expect(imperialWarmonger.quadrant).toBe('WONT_BE');
    expect(imperialWarmonger.derived1D).toBe('STRONGLY_DISAGREE');
    expect(imperialWarmonger.x).toBeLessThan(0); // Negative Moral Beneficiary (-υ: Faction/Empire extraction)
    expect(imperialWarmonger.y).toBeLessThan(0); // Opposes dismantling

    // BOTH map to STRONGLY_DISAGREE on 1D Likert, but on 2D Polar Pad they are in completely opposite quadrants!
    expect(defensiveSovereign.derived1D).toBe(imperialWarmonger.derived1D);
    expect(defensiveSovereign.quadrant).not.toBe(imperialWarmonger.quadrant);
    expect(defensiveSovereign.x).toBe(-imperialWarmonger.x);
  });

  it('separates the False Agreement on diplomacia_18', () => {
    // Universal Pacifist (Agrees to dismantle for world peace and mutual cooperation: +υ, +ψ)
    const universalPacifist = simulateVectorCalculation(1.0, 1.0);
    expect(universalPacifist.quadrant).toBe('WILL_BE');
    expect(universalPacifist.derived1D).toBe('STRONGLY_AGREE');
    expect(universalPacifist.x).toBeGreaterThan(0); // +υ

    // Private Mercenary Warlord (Agrees to dismantle state military to replace with private corporate armies: -υ, +ψ)
    const privateMercenary = simulateVectorCalculation(-1.0, 1.0);
    expect(privateMercenary.quadrant).toBe('CANT_BE');
    expect(privateMercenary.derived1D).toBe('STRONGLY_AGREE');
    expect(privateMercenary.x).toBeLessThan(0); // -υ

    // On 1D both agree; on 2D they are separated across the vertical midline
    expect(universalPacifist.derived1D).toBe(privateMercenary.derived1D);
    expect(universalPacifist.quadrant).toBe('WILL_BE');
    expect(privateMercenary.quadrant).toBe('CANT_BE');
  });

  it('scales magnitude radially from indifference to radical conviction', () => {
    const indifferent = simulateVectorCalculation(0.1, 0.1);
    const moderate = simulateVectorCalculation(0.4, 0.5);
    const firm = simulateVectorCalculation(0.8, 0.9);
    const radical = simulateVectorCalculation(1.3, 1.4);

    expect(indifferent.magnitude).toBeLessThan(0.25);
    expect(indifferent.quadrant).toBe('INDIFFERENT');

    expect(moderate.magnitude).toBeGreaterThan(0.5);
    expect(moderate.derived1D).toBe('AGREE');

    expect(firm.magnitude).toBeGreaterThan(1.0);
    expect(firm.derived1D).toBe('STRONGLY_AGREE');

    expect(radical.magnitude).toBeGreaterThan(1.8);
    expect(radical.derived1D).toBe('STRONGLY_AGREE');
  });
});
