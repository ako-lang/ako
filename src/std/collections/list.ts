export const list = {
    'List.filter': (args: [any[], (item: any, index: number) => any]) => {
        const [ arr, lambda ] = args
        return arr.filter(lambda)
    },
    'List.map': (args: [any[], (item: any, index: number) => any]) => {
        const [ arr, lambda ] = args
        return arr.map(lambda)
    },
    'List.sort': (args: [any[], (item1: any, item2: any) => number]) => {
        const [ arr, lambda ] = args
        return lambda ? arr.sort(lambda) : arr.sort()
    },
    'List.reverse': (args: [any[]]) => {
        const [ arr ] = args
        return arr.reverse()
    }
}