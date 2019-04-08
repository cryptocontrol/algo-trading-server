import * as ccxt from 'ccxt'
import * as BitfinexApi from 'bitfinex-api-node'
import { WebSocket } from 'bitfinex-api-node'

import { IOrder, IOrderBook } from 'src/interfaces'
import CCXTExchange from './core/CCXTExchange'


export default class BitfinexExchange extends CCXTExchange {
  private readonly clientws: WebSocket
  private readonly streamingTradesSymbol: string[]
  private readonly streamingOrderbookSymbol: string[]


  constructor (exchange: ccxt.Exchange) {
    super(exchange)

    const client = new BitfinexApi({
      ws: {
        autoReconnect: false,
        manageCandles: true
      }
    })

    this.clientws = client.ws(2, { transform: true })
    this.clientws.open()

    this.streamingTradesSymbol = []
    this.streamingOrderbookSymbol = []
  }


  public streamTrades (symbol: string): void {
    // check if we are already streaming this symbol or not
    if (this.streamingTradesSymbol.indexOf(symbol) >= 0) return
    this.streamingTradesSymbol.push(symbol)

    const wsSymbol = symbol.replace('/', '').toUpperCase()

    this.clientws.subscribeTrades(`t${wsSymbol}`)
    this.clientws.onTrades({ symbol: `t${wsSymbol}` }, trade => {
      trade.forEach(result => {
        const ccxtTrade: ccxt.Trade = {
          amount: Number(result.amount),
          datetime: (new Date(result.mts)).toISOString(),
          id: String(result.id),
          price: Number(result.price),
          info: {},
          timestamp: result.mts,
          side: trade.isBuyerMaker ? 'sell' : 'buy',
          symbol: undefined,
          takerOrMaker: trade.maker ? 'maker' : 'taker',
          cost: Number(result.price) * Number(result.amount),
          fee: undefined
        }

        this.emit(`trade:${symbol}`, ccxtTrade)
      })
    })
  }


  public streamOrderbook (symbol: string) {
    // check if we are already streaming this symbol or not
    if (this.streamingOrderbookSymbol.indexOf(symbol) >= 0) return
    this.streamingOrderbookSymbol.push(symbol)

    const wsSymbol = symbol.replace('/', '').toUpperCase()

    this.clientws.subscribeOrderBook(`${wsSymbol}`)
    this.clientws.onOrderBook({ symbol: `t${wsSymbol}` }, (orders) => {
      const bids: IOrder[] = orders.bids.map(bid => {
        return {
          asset: wsSymbol,
          price: bid[0],
          amount: bid[2]
        }
      })

      const asks: IOrder[] = orders.asks.map(ask => {
        return {
          asset: wsSymbol,
          price: Math.abs(ask[0]),
          amount: Math.abs(ask[2])
        }
      })

      this.emit(`orderbook:${symbol}`, { bids, asks })
    })
  }
}
