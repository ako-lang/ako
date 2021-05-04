export const list = {
  'List.filter': (arr: number[], lambda: (item1: number, item2: number) => number): number[] => {
    return arr.filter(lambda)
  },
  'List.map': (arr: number[], lambda: (item: number) => number): number[] => {
    return arr.map(lambda)
  },
  'List.sort': (arr: number[], lambda: (item1: number, item2: number) => number): number[] => {
    return lambda
      ? [...arr].sort(lambda)
      : [...arr].sort((a, b) => {
          if (a < b) return -1
          if (a > b) return 1
          return 0
        })
  },
  'List.reverse': (arr: number[]): number[] => {
    return [...arr].reverse()
  }
}
