export const KeyValue = {
  create: (symbol, value) => {
    return {type: 'KeyValue', symbol, value}
  }
}

export const Dictionary = {
  create: (value) => {
    return {type: 'Dictionary', value}
  },
  evaluate: (ctx, dict) => {
    const data = {}
    for (const val of dict.value) {
      if (val.type != 'KeyValue') continue
      const key = ctx.vm.evaluate(ctx, val.symbol)
      const value = ctx.vm.evaluate(ctx, val.value, true)
      data[key] = value
    }
    return data
  }
}

export const Array = {
  create: (value) => {
    return {type: 'Array', value}
  },
  evaluate: (ctx, arr) => {
    const data = []
    for (const val of arr.value) {
      data.push(ctx.vm.evaluate(ctx, val, true))
    }
    return data
  }
}
