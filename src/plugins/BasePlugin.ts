import { IAdvice } from '../interfaces'
import BaseTrigger from '../triggers/BaseTrigger'
import Plugins from '../database/models/plugins'
import BaseStrategy from '../strategies/BaseStrategy'


/**
 * A plugin is something that integrates with the trader; It can't be used
 * to influence the decision of a trade, but it can be used to trigger 3rd
 * party applications.
 *
 * For code that is used to influnce the decision of a trade; see Strategies.
 */
export default abstract class BasePlugin<T> {
  public readonly name: string
  public readonly description: string
  public readonly version: number
  public readonly pluginDB: Plugins
  public readonly modes: 'realtime' | 'backtest' []

  protected options: T


  /**
   * @param pluginDB  The plugin DB instance
   */
  constructor (pluginDB: Plugins) {
    this.pluginDB = pluginDB
    this.options = JSON.parse(pluginDB.config)
  }


  /**
   * This fn. is called whenever a trigger has given an advice
   *
   * @param trigger   The trigger object
   * @param advice    The advice given by the trigger
   * @param price     The price at which it was triggered
   * @param amount    The amount adviced by the trigger
   */
  abstract onTriggerAdvice (trigger: BaseTrigger, advice: IAdvice, price?: number, amount?: number): void



  /**
   * This fn. is called whenever a strategy has given an advice
   *
   * @param strategy  The strategy object
   * @param advice    The advice given by the strategy
   * @param price     The price at which it was triggered
   * @param amount    The amount adviced by the strategy
   */
  abstract onStrategyAdvice (strategy: BaseStrategy<{}>, advice: IAdvice, price?: number, amount?: number): void


  /**
   * This fn. is called whenever an advice encounters an error
   *
   * @param trigger   The trigger object
   * @param advice    The advice given by the trigger
   * @param price     The price at which it was triggered
   * @param amount    The amount adviced by the trigger
   */
  abstract onError (error: Error, trigger: BaseTrigger, advice: IAdvice, price?: number, amount?: number): void


  /**
   * Called whenever a plugin is going to be killed
   */
  abstract kill ()


  public getUID () {
    return this.pluginDB.uid
  }


  public getConfig (): T {
    return JSON.parse(this.pluginDB.config)
  }
}
