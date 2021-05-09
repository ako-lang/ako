export const string = {
  'String.capitalize': (val: string): string => {
    return val
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
  },
  'String.upper': (val: string): string => {
    return val.toUpperCase()
  },
  'String.lower': (val: string): string => {
    return val.toLowerCase()
  },
  'String.repeat': (val: string, amount: number): string => {
    return val.repeat(amount)
  },
  'String.startsWith': (val: string, sub: string): number => {
    return val.startsWith(sub) ? 1 : 0
  },
  'String.endsWith': (val: string, sub: string): number => {
    return val.endsWith(sub) ? 1 : 0
  },
  'String.trim': (val: string): string => {
    return val.trim()
  },
  'String.split': (val: string, sub: string): string[] => {
    return val.split(sub)
  },
  'String.replace': (val: string, search: string, replacement: string): string => {
    return val.split(search).join(replacement)
  }
}
