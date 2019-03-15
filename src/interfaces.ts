import { Request } from "express"


export interface ICandle {
  open: number
  high: number
  low: number
  volume: number
  close: number
}


export type IAdvice = 'long' | 'short' | 'soft'
// export interface IAdvice {

// }


export interface IAppRequest extends Request {
  uid: string
}
