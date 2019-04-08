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


export type IAdvice = 'long' | 'short' | 'soft' | 'close-position' | 'do-nothing'
// 'long' | 'short' | 'close-position' | 'do-nothing'

// https://support.bitfinex.com/hc/en-us/articles/115003451049-Bitfinex-Order-Types
// http://www.online-stock-trading-guide.com/sell-stop-order.html
export type IAdvanceOrderTypes = 'stop-loss' | 'take-profit' | 'trailing-stop' | 'stop-limit' |
  'buy-stop' | 'sell-stop' | 'bracket-order' | 'scaled-order' | 'hidden' | 'post-only-limit' |
  'immediate-or-cancel' | 'reduce-only' | 'one-cancels-other' | 'fill-or-kill'


export interface IOrderRequest {
  action: 'buy' | 'sell'
  kind: 'market' | 'limit' | 'stop'
  exchange: 'spot' | 'margin' | 'paper'
  quantity: number
  limitPrice?: number

  takeProfitEnabled: boolean
  takeProfitPrice?: number

  stopLossEnabled: boolean
  stopLossPrice?: number

  leverageMultiplier: number

  advancedOrders: {
    [kind: string]: any[]
  }
}


export interface IAppRequest extends Request {
  uid: string
}



export interface IOrder {
  price: number
  amount?: number
}


export interface IOrderBook {
  bids: IOrder[]
  asks: IOrder[]
}
