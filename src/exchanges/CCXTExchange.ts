import * as _ from 'underscore'

import BaseExchange from './core/BaseExchange'



export default class CCXTExchange extends BaseExchange {
  protected startListening(): void {
    throw new Error("Method not implemented.");
  }


  public canStreamTrades(_symbol: string): boolean {
    return false
  }
}
