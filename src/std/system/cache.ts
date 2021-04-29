const cache = {}

export default {
  CacheReturn: (ctx, entry, entryData, timeRemains) => {
    const cacheId = entryData.meta.args[0]
    if (cacheId in cache) {
      ctx.vm.callReturn(ctx, cache[cacheId])
    }
    return {timeRemains, done: true}
  },
  CacheGet: (ctx, entry, entryData, timeRemains) => {
    const cacheId = entryData.meta.args[0]
    if (cacheId in cache) {
      ctx.vm.setData(ctx, '$', cache[entryData.meta.args[0]])
    }
    return {timeRemains, done: true}
  },
  CacheSet: (ctx, entry, entryData, timeRemains) => {
    cache[entryData.meta.args[0]] = entryData.meta.args[1]
    return {timeRemains, done: true}
  }
}
