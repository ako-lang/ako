import {mapArgs} from '../../helpers/args'

export default {
  print: (ctx, entry, entryData, timeRemains) => {
    const args = mapArgs(ctx, [], [], entryData.meta.args || [])
    console.log(...Object.values(args))

    return {timeRemains, done: true}
  }
}
