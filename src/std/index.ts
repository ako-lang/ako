// functions
import {angle, vector2} from './geometry'
import {math} from './math'
import {time} from './time'
import {list} from './collections'
import {string, is} from './scalar'

export const stdFunctions = {
  ...math,
  ...time,
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
