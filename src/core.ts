import {Interpreter} from './interpreter'

export type Func = (...args: any) => any

export type Task = (ctx: Context, fn: any, fnData: any, time: number) => UpdateStackResult

export interface IStackOption {
  autoupdate: boolean
  parent?: string
  priority: number
}

export interface Stack {
  data: any
  uid: string
  priority: number
  index: number
  elapsed: number
  started: boolean
  done: boolean
  parent: string | undefined
  autoupdate: boolean
  child: string | undefined
  elements: any[]
  elementsData: any[]
  continue?: boolean
  result?: any
}

export interface Context {
  vm: Interpreter
  stack: Stack
}

export interface UpdateStackResult {
  timeRemains: number
  done: boolean
  result?: any
}

export function isNumber(val: any): boolean {
  return !Number.isNaN(val)
}

export function isArray(arr: any[]): boolean {
  return Array.isArray(arr)
}

export function isEmpty(val: any): boolean {
  return val === undefined || val === null
}

export function isString(val: any): boolean {
  return typeof val === 'string' || val instanceof String
}

export function isObject(val: any): boolean {
  return Object.prototype.toString.call(val) === '[object Object]'
}
