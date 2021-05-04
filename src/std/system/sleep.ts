import {mapArgs} from '../../helpers/args'

export default {
  sleep: (ctx, entry, entryData, timeRemains) => {
    if (!entryData.elapsed) {
      const args = mapArgs(ctx, ['duration'], [], entryData.meta.args || [])
      entryData.elapsed = 0
      entryData.duration = args.duration
    }

    entryData.elapsed += timeRemains

    if (entryData.elapsed >= entryData.duration) return {timeRemains: entryData.elapsed - entryData.duration, done: true}
    return {timeRemains: 0, done: false}
  }
}
