import {Interpreter} from './interpreter'

export type Func = (...args: any) => any

export type Task = (ctx: Context, fn: any, fnData: any, time: number) => UpdateStackResult

export interface Stack {
  data: any
  uid: string
  index: number
  elapsed: number
  started: boolean
  done: boolean
  parent: string | undefined
  child: string | undefined
  elements: any[]
  elementsData: any[]
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
