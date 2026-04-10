/**
 * Simple composable to generate unique IDs for components
 * This mimics Vue 3.5's built-in useId function
 */
let idCounter = 0;

export function useId(): string {
  idCounter++;
  return `id-${idCounter}`;
}

export default useId;