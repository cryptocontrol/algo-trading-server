import BaseTrigger from 'src/triggers/BaseTrigger'
import BudfoxManger from './BudfoxManager'
import StopLossTrigger from 'src/triggers/StopLossTrigger'
import TakeProfitTrigger from 'src/triggers/TakeProfitTrigger'
import Triggers from 'src/database/models/triggers'


interface IExchangeTriggers {
  [exchangeSymbol: string]: BaseTrigger[]
}


export default class TriggerManger {
  private readonly triggers: IExchangeTriggers = {}
  private readonly manager = BudfoxManger.getInstance()
  private static readonly instance = new TriggerManger()


  async loadTriggers () {
    const activeTriggers = await Triggers.findAll({ where: { isActive: true }})
    activeTriggers.forEach(t => this.addTrigger(t))
  }


  public addTrigger (t: Triggers) {
    const trigger = this.getTrigger(t)
    if (!trigger) return

    const exchangeSymbol = `${t.exchange}-${t.symbol}`
    const budfox = this.manager.getBudfox(t.exchange, t.symbol)

    budfox.on('candle', candle => trigger.onCandle(candle))
    budfox.on('trade', trade => trigger.onTrade(trade))

    // once a trigger has finished
    trigger.on('close', () => {
      // we remove the trigger from the array of triggers
      const exchangeSymbolTriggers = this.triggers[exchangeSymbol] || []
      const index = exchangeSymbolTriggers.indexOf(trigger)
      if (index === -1) return
      this.triggers[exchangeSymbol].splice(index, 1)

      // and remove budfox if there are no more triggers left
      if (this.triggers[exchangeSymbol].length === 0) this.manager.removeBudfox(budfox)
    })

    const exchangeSymbolTriggers = this.triggers[exchangeSymbol] || []
    exchangeSymbolTriggers.push(trigger)
    this.triggers[exchangeSymbol] = exchangeSymbolTriggers
  }


  private getTrigger (triggerDB: Triggers) {
    if (triggerDB.kind === 'stop-loss') return new StopLossTrigger(triggerDB)
    if (triggerDB.kind === 'take-profit') return new TakeProfitTrigger(triggerDB)
    if (triggerDB.kind === 'trailing-stop') return new TakeProfitTrigger(triggerDB)
  }


  static getInstance () {
    return TriggerManger.instance
  }
}
