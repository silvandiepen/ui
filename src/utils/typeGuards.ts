export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

export function isString(value: unknown): value is string {
  return typeof value === 'string'
}
