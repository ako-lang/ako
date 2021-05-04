import {Context} from '../core'

export function mapArgs(ctx: Context, taskDefArgs: any, blocks: any, values: any) {
  // console.log(taskDefArgs, blocks)
  const taskDefMetaArgs = taskDefArgs.filter((x) => !!x).map((x: any) => ctx.vm.evaluate(ctx, x, true))
  const inlineMetaArgs = blocks
    .filter((x: any) => !!x && x.type === 'Metadata' && x.key === 'Args')
    .map((x: any) => x.value.value.map((y) => ctx.vm.evaluate(ctx, y, true)))

  let args = []
  if (taskDefMetaArgs.length > 0) {
    args = taskDefMetaArgs.map((val, index) => {
      if (typeof val === 'string' || val instanceof String) {
        return {index, name: val}
      } else {
        return {...val, index}
      }
    })
  } else if (inlineMetaArgs.length > 0) {
    args = inlineMetaArgs[0].map((x, index) => {
      return {...x, index}
    })
  }

  const params: {[id: string]: any} = {}
  for (const arg of args) {
    if ('default' in arg) params[arg.name] = arg.default
  }
  for (const arg of values) {
    if (arg.type === 'Args') {
      const entry = args.find((x) => x.index === arg.index)
      if (entry) {
        params[entry.name] = arg.value
      } else {
        params[`param_${arg.index}`] = arg.value
      }
    } else if (arg.type === 'NamedArgs') {
      const entry = args.find((x) => x.name === arg.name)
      if (entry) params[entry.name] = arg.value
    }
  }

  // console.log('Params >>', params, values, '<<')
  return params
}
