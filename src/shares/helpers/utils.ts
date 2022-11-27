export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isNullOrUndefined(value) {
  return value === null || value === undefined;
}
