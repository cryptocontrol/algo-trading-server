import AdviceManager from './AdviceManager'
import BudfoxManger from './BudfoxManager'
import Triggers from '../database/models/triggers'
import BaseStrategy from '../strategies/BaseStrategy'
import Strategies from 'src/database/models/strategies'


interface IExchangeStrategies {
  [exchangeSymbol: string]: BaseStrategy<any>[]
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
  private readonly strategies: IExchangeStrategies = {}
  private readonly manager = BudfoxManger.getInstance()

  private static readonly instance = new TriggerManger()


  /**
   * Loads any tirggers which exist in the DB onto the server.
   */
  async loadTriggers () {
    const activeTriggers = await Triggers.findAll({ where: { isActive: true }})
    activeTriggers.forEach(t => this.addStrategy(t))
  }


  /**
   * Adds a new trigger. This trigger will remain active until we kill it.
   *
   * @param s The trigger DB model to be tracked.
   */
  public addStrategy (s: Strategies) {
    const strategy = this._getStrategy(s)
    if (!strategy) return

    const exchangeSymbol = this._getExchangeSymbol(s)
    const budfox = this.manager.getBudfox(s.exchange, s.symbol)

    // add the strategy into our array of strategies
    const exchangeSymbolTriggers = this.strategies[exchangeSymbol] || []
    // exchangeSymbolTriggers.push(trigger)
    this.strategies[exchangeSymbol] = exchangeSymbolTriggers

    budfox.on('candle', candle => strategy.onCandle(candle))
    budfox.on('trade', trade => strategy.onTrade(trade))

    // whenever a trigger executes
    strategy.on('advice', ({ advice, price, amount, ...extras }) => {
      AdviceManager.getInstance().addAdviceFromStrategy(strategy, advice, price, amount, extras)
    })

    // // once a trigger has finished
    // trigger.on('close', () => {
    //   // we remove the trigger from the array of triggers
    //   const exchangeSymbolTriggers = this.triggers[exchangeSymbol] || []
    //   const index = exchangeSymbolTriggers.indexOf(trigger)
    //   if (index === -1) return
    //   this.triggers[exchangeSymbol].splice(index, 1)

    //   // and remove budfox if there are no more triggers left for this symbol
    //   if (this.triggers[exchangeSymbol].length === 0) this.manager.removeBudfox(budfox)
    // })
  }


  public async removeStrategy (s: Strategies) {
    const exchangeSymbol = this._getExchangeSymbol(s)

    const exchangeSymbolStrategies = this.strategies[exchangeSymbol] || []
    const newStrategies = exchangeSymbolStrategies.filter(e => e.getDBId() !== s.id)
    this.strategies[exchangeSymbol] = newStrategies

    // delete trigger from db
    // No need to delete the trigger from db only a flag is changed
    // await Triggers.destroy({ where: { id: t.id }})
  }


  /**
   * Return the Trigger instantiated in a class.
   *
   * Each trigger has a Trigger class that implements it with the logic.
   *
   * @param strategy The trigger DB model to be instantiated
   */
  private _getStrategy (strategy: Strategies): BaseStrategy<any> {
    // stop losses
    // if (triggerDB.kind === 'stop-loss') return new StopLossTrigger(triggerDB)
    // if (triggerDB.kind === 'take-profit') return new TakeProfitTrigger(triggerDB)
    // if (triggerDB.kind === 'cancel-order') return new CancelOrderTrigger(triggerDB)
    // if (triggerDB.kind === 'tiered-profit') return new TieredTakeProfitTrigger(triggerDB)
    // if (triggerDB.kind === 'stop-loss-take-profit') return new StopLossTakeProfitTrigger(triggerDB)

    // tiered take-profits etc.. etc..
    return null
  }


  private _getExchangeSymbol (s: Strategies) {
    return `${s.exchange}-${s.symbol}`.toUpperCase().trim()
  }


  /**
   * Returns the current active instance of this class.
   */
  static getInstance () {
    return TriggerManger.instance
  }
}
