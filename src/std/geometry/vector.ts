import {precisionRound} from '../math'
import {deg2rad, rad2deg} from './angle'

type Vec2 = [number, number]

const create = (...args: number[]): Vec2 => {
  const [x, y] = args || []
  return [x || 0, y || 0] as Vec2
}
const clone = (args: Vec2) => create(...args)
const precisionRoundVec = (arg: Vec2, precision = 7): Vec2 => {
  return [precisionRound(arg[0], precision), precisionRound(arg[1], precision)]
}

export const vector2 = {
  'Vec2.create': create,
  'Vec2.clone': (vec: Vec2): Vec2 => clone(vec),
  'Vec2.add': (...args: Vec2[]): Vec2 => {
    const vec = create()
    for (const arg of args) {
      vec[0] = vec[0] + arg[0] || 0
      vec[1] = vec[1] + arg[1] || 0
    }
    return precisionRoundVec(vec)
  },
  'Vec2.sub': (...args: Vec2[]): Vec2 => {
    const [origin, ...other] = args
    const vec = clone(origin)
    for (const arg of other) {
      vec[0] = vec[0] - arg[0] || 0
      vec[1] = vec[1] - arg[1] || 0
    }
    return precisionRoundVec(vec)
  },
  'Vec2.scale': (origin: Vec2, scale: number): Vec2 => {
    const vec = clone(origin)
    vec[0] = precisionRound(vec[0] * scale)
    vec[1] = precisionRound(vec[1] * scale)
    return precisionRoundVec(vec)
  },
  'Vec2.angle': (origin: Vec2): number => {
    return precisionRound(rad2deg(Math.atan2(origin[1], origin[0])))
  },
  'Vec2.rotate': (origin: Vec2, angle: number): Vec2 => {
    const rad = deg2rad(angle)
    const cos = Math.cos(rad)
    const sin = Math.sin(rad)
    return precisionRoundVec([origin[0] * cos - origin[1] * sin, origin[0] * sin + origin[1] * cos])
  }
}
