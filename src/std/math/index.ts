export function precisionRound(num: number, precision = 14) {
  const factor = Math.pow(10, precision)
  return Math.round(num * factor) / factor
}

export const math = {
  'Math.PI': () => Math.PI,
  'Math.max': (...args: number[]) => Math.max(...args),
  'Math.min': (...args: number[]) => Math.min(...args),
  'Math.abs': (arg: number) => Math.abs(arg),
  'Math.ceil': (arg: number) => Math.ceil(arg),
  'Math.floor': (arg: number) => Math.floor(arg),
  'Math.round': (arg: number) => Math.round(arg),

  // random
  'Math.rand': (min = 0, max = 1) => Math.random() * (max - min) + min,
  'Math.randint': (min = 0, max = 1) => Math.floor(Math.random() * (max + 1 - min) + min)
}
