import { IAdvice } from '../interfaces'
import BaseTrigger from '../triggers/BaseTrigger'
import Plugins from '../database/models/plugins'
import BaseStrategy from '../strategies/BaseStrategy'
import Advices from 'src/database/models/advices';


/**
 * A plugin is a 3rd-party application that integrates with the trader; It can't be used
 * to influence the decision of a trade (for that look at creating your own custom strategies); but
 * it receives all advices emitted out by any of the strategies/triggers.
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
   * This fn. is called whenever a strategy/trigger has given an advice
   *
   * @param from      An identiier recognising the strategy or the trigger
   * @param advice    The advice given by the strategy
   */
  abstract onAdvice (from: string, advice: Advices): void



  /**
   * This fn. is called whenever an advice encounters an error
   *
   * @param error     The error event
   * @param from      An identiier recognising the strategy or the trigger
   * @param advice    The advice given by the strategy
   */
  abstract onError (error: Error, from: string, advice: Advices): void


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


  public toString () {
    return `Plugin ${this.name} id: ${this.pluginDB.id}`
  }
}
