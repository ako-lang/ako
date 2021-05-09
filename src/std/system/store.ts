import {getArgs, mapArgs} from '../../helpers/args'

const data = {}
export default {
  mem_get: (ctx, entry, entryData, timeRemains) => {
    const args = getArgs(ctx, ['name'], entryData.meta.args)
    return {timeRemains, done: true, result: data[args.name]}
  },
  mem_set: (ctx, entry, entryData, timeRemains) => {
    const args = getArgs(ctx, ['name', 'val'], entryData.meta.args)
    data[args.name] = args.val
    return {timeRemains, done: true}
  },
  mem_incr: (ctx, entry, entryData, timeRemains) => {
    const args = getArgs(ctx, ['name', 'val'], entryData.meta.args)
    data[args.name] += args.val
    return {timeRemains, done: true, result: data[args.name]}
  }
}
