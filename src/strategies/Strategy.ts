import * as hat from 'hat'
import BaseExchange from 'src/exchanges/core/BaseExchange'


export default abstract class BaseStrategy {
  public readonly name: string
  public readonly uid: string
  public readonly symbol: string
  public readonly exchange: BaseExchange


  constructor (name: string) {
    this.uid = hat()
    this.name = name
  }


  advice (reason: 'long' | 'short' | 'close-position' | 'do-nothing') {
    // do nothing
  }

  abstract process (lastprice: number): void
}
