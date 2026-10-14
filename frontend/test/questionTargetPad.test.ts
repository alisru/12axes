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

  describe('Angle-Magnitude 9-Cell Polar Sector Model (computeShares)', () => {
    // Import dynamically or test against anchors9 structure
    const testAnchors = [
      { key: 'top-left', name: 'Top Left', u: 1.15, psi: 1.15, x: 86.75, y: 86.75 },
      { key: 'top-center', name: 'Top Center', u: 0, psi: 1.15, x: 150, y: 86.75 },
      { key: 'top-right', name: 'Top Right', u: -1.15, psi: 1.15, x: 213.25, y: 86.75 },
      { key: 'mid-left', name: 'Mid Left', u: 1.15, psi: 0, x: 86.75, y: 150 },
      { key: 'mid-center', name: 'Center', u: 0, psi: 0, x: 150, y: 150 },
      { key: 'mid-right', name: 'Mid Right', u: -1.15, psi: 0, x: 213.25, y: 150 },
      { key: 'bottom-left', name: 'Bottom Left', u: 1.15, psi: -1.15, x: 86.75, y: 213.25 },
      { key: 'bottom-center', name: 'Bottom Center', u: 0, psi: -1.15, x: 150, y: 213.25 },
      { key: 'bottom-right', name: 'Bottom Right', u: -1.15, psi: -1.15, x: 213.25, y: 213.25 },
    ];

    it('allocates 100% to Center and 0% to perimeter at origin (0, 0)', async () => {
      const { computeShares } = await import('../src/components/QuestionTargetPad');
      const shares = computeShares(0, 0, testAnchors);

      expect(shares['mid-center'].pct).toBe(100);
      testAnchors.filter(a => a.key !== 'mid-center').forEach(a => {
        expect(shares[a.key].pct).toBe(0);
      });
    });

    it('allocates 100% direction to Agree for Self (top-right) at 50% magnitude with 0% to side neighbors', async () => {
      const { computeShares } = await import('../src/components/QuestionTargetPad');
      // Anchor is at u = -1.15, psi = 1.15. Halfway out is u = -0.575, psi = 0.575
      const shares = computeShares(-0.60, 0.60, testAnchors);

      // Top-right and Center split the conviction evenly (~50/50)
      expect(shares['top-right'].pct).toBeGreaterThanOrEqual(45);
      expect(shares['top-right'].pct).toBeLessThanOrEqual(55);
      expect(shares['mid-center'].pct).toBeGreaterThanOrEqual(45);
      expect(shares['mid-center'].pct).toBeLessThanOrEqual(55);

      // Crucial requirement: all other 7 perimeter anchors are strictly 0% (no radial bleed)
      testAnchors
        .filter(a => a.key !== 'top-right' && a.key !== 'mid-center')
        .forEach(a => {
          expect(shares[a.key].pct).toBe(0);
        });

      // Strict 100% sum
      const total = Object.values(shares).reduce((acc, s) => acc + s.pct, 0);
      expect(total).toBe(100);
    });

    it('splits 50% / 50% between two adjacent anchors at full magnitude with 0% to all other 7 anchors', async () => {
      const { computeShares } = await import('../src/components/QuestionTargetPad');
      // Halfway between top-center (0°) and top-right (45°) is 22.5°
      // Along the top edge where psi = 1.15:
      // tan(22.5°) = sqrt(2) - 1 ≈ 0.41421356
      // dx = -u = psi * tan(22.5°) => u = -1.15 * tan(22.5°)
      const tan225 = Math.SQRT2 - 1;
      const psi = 1.15;
      const u = -1.15 * tan225;

      const shares = computeShares(u, psi, testAnchors);

      // Split exactly 50% between top-center and top-right
      expect(shares['top-center'].pct).toBe(50);
      expect(shares['top-right'].pct).toBe(50);
      expect(shares['mid-center'].pct).toBe(0);

      // All other 6 perimeter anchors are strictly 0%
      testAnchors
        .filter(a => a.key !== 'top-center' && a.key !== 'top-right')
        .forEach(a => {
          expect(shares[a.key].pct).toBe(0);
        });

      const total = Object.values(shares).reduce((acc, s) => acc + s.pct, 0);
      expect(total).toBe(100);
    });

    it('gives 100% on any clicked preset anchor with 0% on all others', async () => {
      const { computeShares } = await import('../src/components/QuestionTargetPad');
      testAnchors.forEach(targetAnchor => {
        const shares = computeShares(targetAnchor.u, targetAnchor.psi, testAnchors);
        expect(shares[targetAnchor.key].pct).toBe(100);

        testAnchors
          .filter(a => a.key !== targetAnchor.key)
          .forEach(other => {
            expect(shares[other.key].pct).toBe(0);
          });
      });
    });
  });
});
