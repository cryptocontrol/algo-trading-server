import * as ccxt from 'ccxt'
import * as BitfinexApi from "bitfinex-api-node"
import { WebSocket } from "bitfinex-api-node"

import BaseExchange from './core/BaseExchange'

interface IOrder {
  asset: string
  price: number
  amount: number
}


interface IOrderBook {
  bids: IOrder[]
  asks: IOrder[]
}


export default class BitfinexExchange extends BaseExchange {
  private readonly clientws: WebSocket
  private readonly streamingTradesSymbol: string[]

  constructor () {
    const bitfinex = new ccxt.bitfinex({ enableRateLimit: true })
    super(bitfinex)

    const client = new BitfinexApi({
      ws: {
        autoReconnect: false,
        manageCandles: true
      }
    })
    this.clientws = client.ws(2, { transform: true })
    this.streamingTradesSymbol = []
  }


  public canStreamTrades (_symbol: string): boolean {
    return true
  }


  public streamTrades(symbol: string): void {

    // check if we are already streaming this symbol or not
    // if (this.streamingTradesSymbol.indexOf(symbol) >= 0) return
    // this.streamingTradesSymbol.push(symbol)
    //
    const wsSymbol = symbol.replace('/', '').toUpperCase()

    this.clientws.open()
    this.clientws.on('open', () => {
      console.log('ws opened')
      this.clientws.subscribeTrades(`t${wsSymbol}`)
    })

    this.clientws.onTrades({ symbol: `t${wsSymbol}` }, trade => {
      trade.forEach((result:any) => {
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
        console.log(ccxtTrade)
        this.emit('trade', ccxtTrade)
      })
    })
  }


  public streamOrderbook (symbol: string) {
    const wsSymbol = symbol.replace('/', '').toUpperCase()

    this.clientws.open()
    this.clientws.on('open', () => {
      console.log('ws opened')
      this.clientws.subscribeOrderBook(`${wsSymbol}`)
    })

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
          price: ask[0],
          amount: ask[2]
        }
      })


      const orderBook:IOrderBook = {
        bids: bids,
        asks: asks
      }
      this.emit('orderbook', orderBook)
      console.log(orderBook)
    })
  }


  public async getTrades (symbol: string, since: number, _descending: boolean): Promise<ccxt.Trade[]> {
    return await this.exchange.fetchTrades(symbol, since)
  }
}


const main = async () => {
  const bitfinex = new BitfinexExchange()
  //bitfinex.streamTrades('BTCUSD')
  bitfinex.streamOrderbook('BTCUSD')
}

main()
