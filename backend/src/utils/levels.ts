/**
 * Calculates the experience needed for the next level based on a progression model.
 *
 * For the first three levels
 *   E(L) = 2^(L-1) * C.
 * After the third level
 *   E(L) = E(3) * D^(L-3).
 *
 *  Where:
 *      L - current level
 *      E(L) - experience needed to advance to the next level
 *      C - constats that represents the experience required for the base level
 *      D - exponential growth factor for levels after the 3rd
 */

export const BASE_EXP = 15;
export const GROWTH_FACTOR = 2;
export const EXP_GROWTH_FACTOR = 1.5;

export function calculateExperienceForNextLevel(currentLevel: number): number {
  if (currentLevel >= 1 && currentLevel <= 3) {
    return Math.pow(GROWTH_FACTOR, currentLevel - 1) * BASE_EXP;
  } else if (currentLevel > 3) {
    const experienceAtLevel3 = Math.pow(GROWTH_FACTOR, 2) * BASE_EXP;
    return experienceAtLevel3 * Math.pow(EXP_GROWTH_FACTOR, currentLevel - 3);
  } else {
    throw new Error('Invalid level. Level must be 1 or greater.');
  }
}

export function shouldLevelUp(currentLevel: number, currentExperience: number) {
  const experienceForNextLevel = calculateExperienceForNextLevel(currentLevel);

  if (currentExperience >= experienceForNextLevel) {
    return true;
  }

  return false;
}
