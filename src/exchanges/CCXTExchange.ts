import * as _ from 'underscore'

import BaseExchange from './core/BaseExchange'



export default class CCXTExchange extends BaseExchange {
  public streamTrades (_symbol: string): void {
    throw new Error("Method not implemented.")
  }


  public canStreamTrades(_symbol: string): boolean {
    return false
  }


  public async getTrades (symbol: string, since: number, descending: boolean) {
    return await this.exchange.fetchTrades(symbol, since)
  }
}
