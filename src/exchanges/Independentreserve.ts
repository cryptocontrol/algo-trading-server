import * as ccxt from 'ccxt'

import BaseExchange from './core/BaseExchange'
import CCXTExchange from './core/CCXTExchange'


export default class IndependentreserveExchange extends CCXTExchange {
  private readonly clientws: WebSocket
  private readonly streamingTradesSymbol: string[]

  constructor () {
    const independentreserve = new ccxt.independentreserve({ enableRateLimit: true })
    super(independentreserve)

    const client = 'independentreserve'
    // this.clientws = 'client.ws(2, { transform: true })'
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
    // const wsSymbol = symbol.replace('/', '').toUpperCase()
    //
    // this.clientws.open()
    // this.clientws.on('open', () => {
    //   console.log('ws opened')
    //   this.clientws.subscribeTrades(`t${wsSymbol}`)
    // })
    //
    // this.clientws.onTrades({ symbol: `t${wsSymbol}` }, trade => {
    //   trade.forEach((result:any) => {
    //     const ccxtTrade: ccxt.Trade = {
    //       amount: Number(result.amount),
    //       datetime: (new Date(result.mts)).toISOString(),
    //       id: String(result.id),
    //       price: Number(result.price),
    //       info: {},
    //       timestamp: result.mts,
    //       side: trade.isBuyerMaker ? 'sell' : 'buy',
    //       symbol: undefined,
    //       takerOrMaker: trade.maker ? 'maker' : 'taker',
    //       cost: Number(result.price) * Number(result.amount),
    //       fee: undefined
    //     }
    //     console.log(ccxtTrade)
    //     this.emit('trade', ccxtTrade)
    //   })
    // })
  }


  public streamOrderbook (symbol: string) {
    // const wsSymbol = symbol.replace('/', '').toUpperCase()
    //
    // this.clientws.open()
    // this.clientws.on('open', () => {
    //   console.log('ws opened')
    //   this.clientws.subscribeOrderBook(`${wsSymbol}`)
    // })
    //
    // this.clientws.onOrderBook({ symbol: `t${wsSymbol}` }, (orders) => {
    //
    //   const bids: IOrder[] = orders.bids.map(bid => {
    //     return {
    //       asset: wsSymbol,
    //       price: bid[0],
    //       amount: bid[2]
    //     }
    //   })
    //
    //   const asks: IOrder[] = orders.asks.map(ask => {
    //     return {
    //       asset: wsSymbol,
    //       price: ask[0],
    //       amount: ask[2]
    //     }
    //   })
    //
    //
    //   const orderBook:IOrderBook = {
    //     bids: bids,
    //     asks: asks
    //   }
    //   this.emit('orderbook', orderBook)
    //   console.log(orderBook)
    // })
  }


  public async loadMarkets () {
    const markets = await this.exchange.loadMarkets()
    console.log(markets)
    return await this.exchange.loadMarkets()
  }


  public async fetchMarkets () {
    const markets = await this.exchange.fetchMarkets()
    console.log(markets)
    return await this.exchange.loadMarkets()
  }


  public async fetchTickers (symbol: string) {
    const wsSymbol = symbol.replace('/', '').toUpperCase()
    const ticker = await this.exchange.has.fetchTickers
    if (ticker === false) {
      const fakeTicker: any = {}
      fakeTicker.symbol = wsSymbol
      fakeTicker.timestamp = '1553862530261.5288'
      fakeTicker.datetime = 'datetime'
      fakeTicker.high = 9.3e-7
      fakeTicker.bid = 8.5e-7
      fakeTicker.bidVolume = undefined
      fakeTicker.ask = 0.00000103
      fakeTicker.askVolume = undefined
      fakeTicker.vwap = undefined
      fakeTicker.open = undefined
      fakeTicker.close = 8.5e-7
      fakeTicker.last = 8.5e-7
      fakeTicker.previousClose = undefined
      fakeTicker.change = undefined
      fakeTicker.percentage = undefined
      fakeTicker.average = 9.4e-7
      fakeTicker.baseVolume = 179063.63874
      fakeTicker.quoteVolume = undefined
      fakeTicker.info = { mid: '0.00000094',
        bid: '0.00000085',
        ask: '0.00000103',
        last_price: '0.00000085',
        low: '0.00000072',
        high: '0.00000093',
        volume: '179063.63874',
        timestamp: '1553862530.261528837',
        pair: wsSymbol }

      console.log('fetchTickers is not supported', '\n', fakeTicker)
    } else {
      // const ticker2 = await this.exchange.fetchTickers(symbol)
      // console.log(ticker2)
    }
  }


  public async getTrades (symbol: string, since: number, _descending: boolean): Promise<ccxt.Trade[]> {
    return await this.exchange.fetchTrades(symbol, since)
  }
}
