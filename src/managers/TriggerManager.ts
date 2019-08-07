import AdviceManager from './AdviceManager'
import BaseTrigger from '../triggers/BaseTrigger'
import BudfoxManger from './BudfoxManager'
import StopLossTrigger from '../triggers/StopLossTrigger'
import TakeProfitTrigger from '../triggers/TakeProfitTrigger'
import Triggers from '../database/models/triggers'
import CancelOrderTrigger from '../triggers/CancelOrderTrigger'
import TieredTakeProfitTrigger from '../triggers/TieredTakeProfitTrigger'


interface IExchangeTriggers {
  [exchangeSymbol: string]: BaseTrigger[]
}


/**
 * The triggers manager is a speical class that handles all the triggers in one place. This
 * class listens to all the new candles emitted by the Budfox managers and sends each candle
 * to the trigger. Once a trigger has been executed, the class removes it completely and marks
 * it as executed.
 *
 * Whenever a trigger gives an advice, the class also informs the AdviceManager of the advice.
 *
 * This class is a singleton.
 */
export default class TriggerManger {
  private readonly triggers: IExchangeTriggers = {}
  private readonly manager = BudfoxManger.getInstance()

  private static readonly instance = new TriggerManger()


  /**
   * Loads any tirggers which exist in the DB onto the server.
   */
  async loadTriggers () {
    const activeTriggers = await Triggers.findAll({ where: { isActive: true }})
    activeTriggers.forEach(t => this.addTrigger(t))
  }


  /**
   * Adds a new trigger. This trigger will remain active until we kill it.
   *
   * @param t The trigger DB model to be tracked.
   */
  public addTrigger (t: Triggers) {
    const trigger = this._getTrigger(t)
    if (!trigger) return

    const exchangeSymbol = this._getExchangeSymbol(t)
    const budfox = this.manager.getBudfox(t.exchange, t.symbol)

    // add the trigger into our array of triggers
    const exchangeSymbolTriggers = this.triggers[exchangeSymbol] || []
    exchangeSymbolTriggers.push(trigger)
    this.triggers[exchangeSymbol] = exchangeSymbolTriggers

    budfox.on('candle', candle => trigger.onCandle(candle))
    budfox.on('trade', trade => trigger.onTrade(trade))

    // whenever a trigger executes
    trigger.on('advice', ({ advice, price, amount }) => {
      AdviceManager.getInstance().addAdvice(trigger, advice, price, amount)
    })

    // once a trigger has finished
    trigger.on('close', () => {
      // we remove the trigger from the array of triggers
      const exchangeSymbolTriggers = this.triggers[exchangeSymbol] || []
      const index = exchangeSymbolTriggers.indexOf(trigger)
      if (index === -1) return
      this.triggers[exchangeSymbol].splice(index, 1)

      // and remove budfox if there are no more triggers left for this symbol
      if (this.triggers[exchangeSymbol].length === 0) this.manager.removeBudfox(budfox)
    })
  }


  public async removeTrigger (t: Triggers) {
    const exchangeSymbol = this._getExchangeSymbol(t)

    const exchangeSymbolTriggers = this.triggers[exchangeSymbol] || []
    const newTriggers = exchangeSymbolTriggers.filter(e => e.getDBId() !== t.id)
    this.triggers[exchangeSymbol] = newTriggers

    // delete trigger from db
    // No need to delete the trigger from db only a flag is changed
    // await Triggers.destroy({ where: { id: t.id }})
  }


  /**
   * Return the Trigger instantiated in a class.
   *
   * Each trigger has a Trigger class that implements it with the logic.
   *
   * @param triggerDB The trigger DB model to be instantiated
   */
  private _getTrigger (triggerDB: Triggers) {
    // stop losses
    if (triggerDB.kind === 'stop-loss') return new StopLossTrigger(triggerDB)
    if (triggerDB.kind === 'take-profit') return new TakeProfitTrigger(triggerDB)
    if (triggerDB.kind === 'cancel-order') return new CancelOrderTrigger(triggerDB);
    if (triggerDB.kind === 'tiered-profit') return new TieredTakeProfitTrigger(triggerDB);

    // tiered take-profits etc.. etc..
  }


  private _getExchangeSymbol (t: Triggers) {
    return `${t.exchange}-${t.symbol}`.toUpperCase().trim()
  }


  /**
   * Returns the current active instance of this class.
   */
  static getInstance () {
    return TriggerManger.instance
  }
}
