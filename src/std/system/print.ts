export default {
  print: (ctx, entry, entryData, timeRemains) => {
    console.log(...entryData.meta.args)
    return {timeRemains, done: true}
  }
}
