import { IAdvice } from 'src/interfaces'
import Triggers from 'src/database/models/triggers';
import BaseTrigger from 'src/triggers/BaseTrigger';

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
  protected options: T


  /**
   * Called when a given user wants to implement this plugin
   *
   * @param uid       The uid of the user
   * @param options An object of options passed from the user
   */
  constructor (uid: string, options?: T) {
    this.uid = uid
    this.options = options
  }


  /**
   * This fn. is called whenever a trigger has been execited
   *
   * @param trigger The trigger object
   * @param advice  The advice given by the trigger
   * @param price   The price at which it was triggered
   */
  abstract onTriggered (trigger: BaseTrigger, advice: IAdvice, price?: number): void
}
