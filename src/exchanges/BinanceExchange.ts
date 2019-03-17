import * as ccxt from 'ccxt'
import BinanceApi, { WebSocket } from 'binance-api-node'

import BaseExchange from './core/BaseExchange'


export default class BinanceExchange extends BaseExchange {
  private clientws: WebSocket


  constructor () {
    const binance = new ccxt.binance({ enableRateLimit: true })
    super(binance)

    const client = BinanceApi()
    this.clientws = client.ws
  }


  public canStreamTrades (_symbol: string): boolean {
    return true
  }


  public streamTrades(symbol: string): void {
    this.clientws.trades([symbol.replace('/', '')], trade => {
      const ccxtTrade: ccxt.Trade = {
        amount: Number(trade.quantity),
        datetime: (new Date(trade.eventTime)).toISOString(),
        id: String(trade.tradeId),
        info: {},
        price: Number(trade.price),
        timestamp: Number(trade.eventTime),
        side: trade.isBuyerMaker ? 'sell' : 'buy',
        symbol,
        takerOrMaker: trade.maker ? 'maker' : 'taker',
        cost: Number(trade.price) * Number(trade.quantity),
        fee: undefined
      }

      this.emit('trade', ccxtTrade)
    })
  }


  public async getTrades (symbol: string, since: number, _descending: boolean): Promise<ccxt.Trade[]> {
    return await this.exchange.fetchTrades(symbol, since)
  }
}
