export const getProgressPercentage = (levelPoints: number, requiredPointsForNextLevel: number) =>
  (levelPoints / requiredPointsForNextLevel) * 100
