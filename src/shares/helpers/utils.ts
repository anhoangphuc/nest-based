import * as util from 'util';

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

export function isSomeValueNullOrUndefined(values: any[]) {
  return values.some((value) => isNullOrUndefined(value));
}

export function isEmpty(obj: any): boolean {
  if (obj == null) return true;

  // Assume object has length property
  if (obj.length > 0) return false;
  if (obj.length === 0) return true;

  // If isn't an object, it is empty
  if (typeof obj !== 'object') return true;

  // Otherwise, does it have any properties of its own
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) return false;
  }

  return true;
}

export function safeToString(json: any): string {
  if (isEmpty(json)) {
    return null;
  }

  try {
    return JSON.stringify(json);
  } catch (ex) {
    return util.inspect(json);
  }
}
