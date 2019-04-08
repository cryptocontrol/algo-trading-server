import * as ccxt from 'ccxt'
import * as _ from 'underscore'

import { EventEmitter } from 'events'
import { IOrderBook, IAdvanceOrderTypes, IOrderRequest, IOrder } from 'src/interfaces'


export default abstract class BaseExchange extends EventEmitter {
  public readonly id: string
  protected exchange: ccxt.Exchange


  constructor (exchange: ccxt.Exchange) {
    super()

    this.exchange = exchange
    this.id = exchange.id
  }


  public abstract canStreamTrades (symbol: string): boolean

  public abstract streamTrades (symbol: string): void
  public abstract streamOrderbook (symbol: string): void

  public abstract stopStreamingTrades (symbol: string): void
  public abstract stopStreamingOrderbook (symbol: string): void

  // public abstract loadMarkets (): void
  // public abstract fetchMarkets (): void
  // public abstract fetchTickers (symbol: string): void


  public toString () {
    return this.exchange.id
  }


  public supportedOrderTypes (): IAdvanceOrderTypes[] { return [] }

  public abstract executeOrder (order: IOrderRequest): ccxt.Order

  public abstract getTrades (symbol: string, since?: number, descending?: boolean): Promise<ccxt.Trade[]>
  public abstract getOrderbook (symbol: string): Promise<IOrderBook>
  // public abstract createMarginOrder (symbol: string)
  // public abstract createSpotOrder (symbol: string)
  // public abstract createPaperOrder (symbol: string)
}
