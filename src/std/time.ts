import dateFormat from 'dateformat'

export const time = {
  'Time.now': (): number => Date.now(),

  SECOND: (val = 1) => val * 1000,
  MINUTE: (val = 1) => val * 60 * 1000,
  HOUR: (val = 1) => val * 60 * 60 * 1000,
  DAY: (val = 1) => val * 24 * 60 * 60 * 1000,
  WEEK: (val = 1) => val * 7 * 24 * 60 * 60 * 1000,
  YEAR: (val = 1) => 365 * 24 * 60 * 60 * 1000,

  'Time.day': (d?: number): number => new Date(d ? d : undefined).getDate(),
  'Time.weekday': (d?: number): number => new Date(d ? d : undefined).getDay(),
  'Time.year': (d?: number): number => new Date(d ? d : undefined).getFullYear(),
  'Time.hour': (d?: number): number => new Date(d ? d : undefined).getHours(),
  'Time.minute': (d?: number): number => new Date(d ? d : undefined).getMinutes(),
  'Time.second': (d?: number): number => new Date(d ? d : undefined).getSeconds(),
  'Time.ms': (d?: number): number => new Date(d ? d : undefined).getMilliseconds(),

  'Time.parse': (str: string) => Date.parse(str),
  'Time.format': (d: number, format = 'yyyy-mm-dd HH:MM:ss') => dateFormat(new Date(d), format),
  'Time.tz': () => new Date().getTimezoneOffset()
}
