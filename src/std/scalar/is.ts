import {isArray, isEmpty, isNumber, isString} from '../../core'

export const is = {
  isDefined: (val: string): number => {
    return !isEmpty(val) ? 1 : 0
  },
  isEmpty: (val: string): number => {
    if (isArray(val)) return val.length === 0 ? 1 : 0
    if (isString(val)) return val.trim().length === 0 ? 1 : 0
    return 0
  },
  isString: (val: string): number => {
    return isString(val) ? 1 : 0
  },
  isNumber: (val: string): number => {
    return isNumber(val) ? 1 : 0
  },
  isList: (val: string): number => {
    return isArray(val) ? 1 : 0
  },
  len: (val: string | string[]): number => {
    return val.length
  }
}
