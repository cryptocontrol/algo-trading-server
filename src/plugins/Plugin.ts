import { IAdvice } from 'src/interfaces'

/**
 * A plugin is something that integrates with the trader; It can't be used
 * to influence the decision of a trade, but it can be used to trigger 3rd
 * party applications.
 *
 * For code that is used to influnce the decision of a trade; see Strategies.
 */
export default abstract class Plugin<T> {
  public readonly name: string
  public readonly description: string
  public readonly version: number
  public readonly modes: 'realtime' | 'backtest' []

  protected uid: string
  protected exchange: string
  protected symbol: string
  protected options: T


  /**
   * Called when a given user wants to implement this plugin
   *
   * @param uid       The uid of the user
   * @param exchange  The exchange being tracked
   * @param symbol    The symbol being tracked
   * @param options An object of options passed from the user
   */
  constructor (uid: string, exchange: string, symbol: string, options?: T) {
    this.uid = uid
    this.exchange = exchange
    this.symbol = symbol
    this.options = options
  }


  abstract onAdvice (advice: IAdvice, price?: number): void
}
