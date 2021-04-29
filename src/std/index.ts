// functions
import {angle, vector2} from './geometry'
import {math} from './math'
import {list} from './collections'

export const stdFunctions = {
  ...math,
  ...angle,
  ...vector2,
  ...list
}

// commands
import system from './system'
export const stdTasks = {
  ...system
}
