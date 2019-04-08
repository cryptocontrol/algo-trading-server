import * as ccxt from 'ccxt'
import BinanceApi, { WebSocket } from 'binance-api-node'

import BaseExchange from './core/BaseExchange'
import { IOrderBook, IOrder } from 'src/interfaces'
import CCXTExchange from './core/CCXTExchange'


export default class BinanceExchange extends CCXTExchange {
  private readonly clientws: WebSocket
  private readonly streamingTradesSymbol: string[]
  private readonly streamingOrderbookSymbol: string[]


  constructor (exchange: ccxt.Exchange) {
    super(exchange)

    const client = BinanceApi()
    this.clientws = client.ws
    this.streamingTradesSymbol = []
    this.streamingOrderbookSymbol = []
  }


  public canStreamTrades (symbol: string) {
    return true
  }

  public streamTrades (symbol: string): void {
    // check if we are already streaming this symbol or not
    if (this.streamingTradesSymbol.indexOf(symbol) >= 0) return
    this.streamingTradesSymbol.push(symbol)

    const wsSymbol = symbol.replace('/', '').toUpperCase()

    this.clientws.trades([wsSymbol], trade => {
      const ccxtTrade: ccxt.Trade = {
        amount: Number(trade.quantity),
        cost: Number(trade.price) * Number(trade.quantity),
        datetime: (new Date(trade.eventTime)).toISOString(),
        fee: undefined,
        id: String(trade.tradeId),
        info: {},
        price: Number(trade.price),
        side: trade.maker ? 'sell' : 'buy',
        symbol,
        takerOrMaker: trade.maker ? 'maker' : 'taker',
        timestamp: Number(trade.eventTime)
      }

      this.emit(`trade:${symbol}`, ccxtTrade)
    })
  }


  public streamOrderbook(symbol: string): void {
    // check if we are already streaming this symbol or not
    if (this.streamingOrderbookSymbol.indexOf(symbol) >= 0) return
    this.streamingOrderbookSymbol.push(symbol)

    const wsSymbol = symbol.replace('/', '').toUpperCase()

    this.clientws.depth(wsSymbol, depth => {
      const bids: IOrder[] = depth.bidDepth.map(bid => {
        return {
          // asset: symbol,
          price: Number(bid.price),
          amount: Number(bid.quantity)
        }
      })

      const asks: IOrder[] = depth.askDepth.map(ask => {
        return {
          // asset: depth.symbol,
          price: Number(ask.price),
          amount: Number(ask.quantity)
        }
      })

      this.emit(`orderbook:${symbol}`, { bids, asks })
    })
  }
}
