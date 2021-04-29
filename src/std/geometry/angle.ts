export const deg2rad = function (degrees: number) {
  return (degrees * Math.PI) / 180
}

export const rad2deg = function (radians: number) {
  return (radians * 180) / Math.PI
}

export const angle = {
  'Angle.toRad': (num: number) => {
    return deg2rad(num)
  },
  'Angle.toDeg': (num: number) => {
    return rad2deg(num)
  }
}
