export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Returns a random number between vMin (inclusive) and vMax (exclusive)
 * @param vMin
 * @param vMax
 */
export function getRandomValue(vMin: number, vMax: number) {
  return Math.floor(Math.random() * (vMax - vMin) + vMin);
}

export function isNullOrUndefined(value) {
  return value === null || value === undefined;
}
