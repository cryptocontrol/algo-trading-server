import { IAdvice } from 'src/interfaces'
import BaseTrigger from 'src/triggers/BaseTrigger'
import Plugins from 'src/database/models/plugins';


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
   * This fn. is called whenever a trigger has been execited
   *
   * @param trigger   The trigger object
   * @param advice    The advice given by the trigger
   * @param price     The price at which it was triggered
   * @param amount    The amount adviced by the trigger
   */
  abstract onTriggered (trigger: BaseTrigger, advice: IAdvice, price?: number, amount?: number): void


  public getUID () {
    return this.pluginDB.uid
  }


  public getConfig (): T {
    return JSON.parse(this.pluginDB.config)
  }
}
