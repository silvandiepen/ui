export const getTestId = (testId?: string, part?: string) => {
  if (!testId) return undefined
  return part ? `${testId}-${part}` : testId
}
