import {isString} from '../../core'

export function parseDep(dep: any) {
  if (isString(dep)) {
    if (dep.indexOf('=') !== -1) {
      const val = dep.split('=')
      return {scope: dep[0], url: val}
    }
    return {url: dep}
  } else if (dep.url && dep.url.indexOf('=') !== -1) {
    const val = dep.url.split('=')
    dep.scope = val[0]
    dep.url = val[1]
  }
  return dep
}
