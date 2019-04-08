import * as _ from 'underscore'
import * as ccxt from 'ccxt'

import BaseExchange from './BaseExchange'
import { IOrderBook, IOrderRequest } from 'src/interfaces'



export default class CCXTExchange extends BaseExchange {
  private readonly tradeTimeouts: { [symbol: string]: number } = {}
  private readonly orderbookTimeouts: { [symbol: string]: number } = {}


  /**
   * The CCXT version of streaming orderbook is a polling fn.
   */
  public streamOrderbook(symbol: string) {
    const interval = setInterval(
      async () => {
        const orderbook = await this.exchange.fetchOrderBook(symbol)
        const mappedOrderbook: IOrderBook = {
          bids: orderbook.bids.map(a => { return { price: a[0], amount: a[1] }}),
          asks: orderbook.asks.map(a => { return { price: a[0], amount: a[1] }})
        }
        this.emit(`orderbook:full:${symbol}`, mappedOrderbook)
      },
      this.exchange.rateLimit * 3
    )

    this.tradeTimeouts[symbol] = Number(interval)
  }

  /**
   * The CCXT version of streaming trades is a polling fn.
   */
  public streamTrades (symbol: string) {
    const interval = setInterval(
      async () => {
        const trades = await this.exchange.fetchTrades(symbol)
        this.emit(`trade:full:${symbol}`, trades)
      },
      this.exchange.rateLimit * 3
    )

    this.tradeTimeouts[symbol] = Number(interval)
  }


  public async getTrades (symbol: string, since: number, descending: boolean) {
    return await this.exchange.fetchTrades(symbol, since)
  }


  public async getOrderbook (symbol: string) {
    // get the orderbook
    const orderbook = await this.exchange.fetchOrderBook(symbol)
    const mappedOrderbook: IOrderBook = {
      bids: orderbook.bids.map(a => { return { price: a[0], amount: a[1] }}),
      asks: orderbook.asks.map(a => { return { price: a[0], amount: a[1] }})
    }

    return mappedOrderbook
  }


  public async stopStreamingOrderbook (symbol: string) {
    if (!this.tradeTimeouts[symbol]) return
    clearInterval(this.tradeTimeouts[symbol])
    delete this.tradeTimeouts[symbol]
  }


  public async stopStreamingTrades (symbol: string) {
    if (!this.orderbookTimeouts[symbol]) return
    clearInterval(this.orderbookTimeouts[symbol])
    delete this.orderbookTimeouts[symbol]
  }


  public executeOrder (order: IOrderRequest): ccxt.Order {
    return
  }
}
