// functions
import {angle, vector2} from './geometry'
import {math} from './math'
import {list} from './collections'
import {string, is} from './scalar'

export const stdFunctions = {
  ...math,
  ...angle,
  ...vector2,
  ...list,
  ...string,
  ...is
}

// commands
import system from './system'
export const stdTasks = {
  ...system
}
