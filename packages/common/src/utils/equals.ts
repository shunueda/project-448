export function equals(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

export function notEquals(a: unknown, b: unknown): boolean {
  return !equals(a, b)
}
