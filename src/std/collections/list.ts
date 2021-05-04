export const list = {
  'List.filter': (arr: any[], lambda: (item1: any, item2: any) => number) => {
    return arr.filter(lambda)
  },
  'List.map': (arr: any[], lambda: (item1: any, item2: any) => number) => {
    return arr.map(lambda)
  },
  'List.sort': (arr: any[], lambda: (item1: any, item2: any) => number) => {
    return lambda ? [...arr].sort(lambda) : [...arr].sort()
  },
  'List.reverse': (arr: any[]) => {
    return arr.reverse()
  }
}
