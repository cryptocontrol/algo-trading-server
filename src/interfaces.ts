import { Request } from "express"
import { Moment } from "moment"


export interface ICandle {
  open: number
  high: number
  low: number
  volume: number
  close: number
  trades: number
  vwp: number
  start: Moment
}


// start: moment(first.timestamp).clone().startOf('minute'),
// open: first.price,
// high: first.price,
// low: first.price,
// close: _.last(trades).price,
// vwp: 0,
// volume: 0,
// trades: _.size(trades)

export type IAdvice = 'long' | 'short' | 'soft' | 'close-position' | 'do-nothing'


export interface IAppRequest extends Request {
  uid: string
}
