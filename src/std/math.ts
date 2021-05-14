export function precisionRound(num: number, precision = 14) {
  const factor = Math.pow(10, precision)
  return Math.round(num * factor) / factor
}

export const math = {
  'Math.PI': (): number => Math.PI,
  'Math.max': (...args: number[]): number => Math.max(...args),
  'Math.min': (...args: number[]): number => Math.min(...args),
  'Math.abs': (arg: number): number => Math.abs(arg),
  'Math.ceil': (arg: number): number => Math.ceil(arg),
  'Math.floor': (arg: number): number => Math.floor(arg),
  'Math.round': (arg: number): number => Math.round(arg),

  // random
  'Math.rand': (min = 0, max = 1): number => Math.random() * (max - min) + min,
  'Math.randint': (min = 0, max = 1): number => Math.floor(Math.random() * (max + 1 - min) + min)
}
