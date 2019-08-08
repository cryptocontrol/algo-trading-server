import * as ccxt from 'ccxt'
import * as WebSocket from 'ws'

import CCXTExchange from './core/CCXTExchange'
import { IOrder } from 'src/interfaces'


interface ISocketTradeMessage {
  e: string
  E: number
  s: string
  t: number
  p: string
  q: string
  b: number
  a: number
  T: number
  m: boolean
  M: boolean
}



interface ISocketDiffDepthMessage {
  a: [string, string][]
  b: [string, string][]
  E: number
  e: string
  s: string
  U: number
  u: number
}


export default class BinanceExchange extends CCXTExchange {
  private readonly streamingTrades: {
    [symbol: string]: WebSocket
  }
  private readonly streamingOrderbookSymbol: {
    [symbol: string]: WebSocket
  }


  constructor (exchange: ccxt.Exchange) {
    super(exchange)

    this.streamingTrades = {}
    this.streamingOrderbookSymbol = {}
  }


  public streamTrades (symbol: string): void {
    if (!symbol) return

    // check if we are already streaming this symbol or not
    if (this.streamingTrades[symbol]) return

    // first download all the recent trades
    super.getTrades(symbol)
    .then(trades => this.emit(`trade:full:${symbol}`, trades))

    // then start streaming from websockets
    const wsSymbol = symbol.replace('/', '').toLowerCase()

    const url = `wss://stream.binance.com:9443/ws/${wsSymbol}@trade`
    const socket = new WebSocket(url)

    socket.on('message', (event: any) => {
      try {
        const data: ISocketTradeMessage = JSON.parse(event)

        const ccxtTrade: ccxt.Trade = {
          amount: Number(data.q),
          cost: Number(data.p) * Number(data.q),
          datetime: (new Date(data.E)).toISOString(),
          fee: undefined,
          id: String(data.t),
          info: {},
          price: Number(data.p),
          side: data.m ? 'sell' : 'buy',
          symbol,
          takerOrMaker: data.m ? 'maker' : 'taker',
          timestamp: Number(data.E)
        }

        this.emit('trade', ccxtTrade)
      } catch (e) {
        // do nothing
      }
    })

    socket.on('close', (_event: any) => { delete this.streamingTrades[symbol] })
    this.streamingTrades[symbol] = socket
  }


  public async stopStreamingTrades (symbol: string) {
    if (!this.streamingTrades[symbol]) return
    this.streamingTrades[symbol].close()
    delete this.streamingTrades[symbol]
  }


  public streamOrderbook(symbol: string): void {
    if (!symbol) return

    // check if we are already streaming this symbol or not
    if (this.streamingOrderbookSymbol[symbol]) return

    // first emit a full orderbook
    super.getOrderbook(symbol)
    .then(orderbook => this.emit(`orderbook:full:${symbol}`, orderbook))

    // then start streaming the changes using websockets
    const wsSymbol = symbol.replace('/', '').toLowerCase()
    const url = `wss://stream.binance.com:9443/ws/${wsSymbol}@depth`
    const socket = new WebSocket(url)

    socket.on('message', (event: any) => {
      try {
        const data: ISocketDiffDepthMessage = JSON.parse(event)

        const bids: IOrder[] = data.b.map(bid => {
          return { price: Number(bid[0]), amount: Number(bid[1]) }
        })

        const asks: IOrder[] = data.a.map(ask => {
          return { price: Number(ask[0]), amount: Number(ask[1]) }
        })

        this.emit(`orderbook:${symbol}`, { bids, asks })
      } catch (e) {
        // do nothing
      }
    })

    socket.on('close', (_event: any) => { delete this.streamingOrderbookSymbol[symbol] })
    this.streamingOrderbookSymbol[symbol] = socket
  }


  public async stopStreamingOrderbook (symbol: string) {
    if (!this.streamingOrderbookSymbol[symbol]) return
    this.streamingOrderbookSymbol[symbol].close()
  }
}
