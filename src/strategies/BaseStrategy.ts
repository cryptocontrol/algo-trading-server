import * as hat from 'hat'
import BaseExchange from '../exchanges/core/BaseExchange'


/**
 * A strategy is a trading logic that keeps executing trades based on certain conditions. Unlike triggers,
 * strategies need to be stopped for it to stop executing trades.
 *
 * Useful for creating simple strategies like RSI-based strategy, MACD strategy etc..
 */
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
