export const list = {
  'List.filter': (arr: number[], lambda: (item1: number, item2: number) => number): number[] => {
    return arr.filter(lambda)
  },
  'List.map': (arr: number[], lambda: (item: number) => number): number[] => {
    return arr.map(lambda)
  },
  'List.sort': (arr: number[], lambda: (item1: number, item2: number) => number): number[] => {
    return lambda ? [...arr].sort(lambda) : [...arr].sort()
  },
  'List.reverse': (arr: number[]): number[] => {
    return [...arr].reverse()
  }
}
