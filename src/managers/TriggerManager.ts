import BaseTrigger from 'src/triggers/BaseTrigger'
import BudfoxManger from './BudfoxManager'
import PluginsManager from './PluginsManager'
import StopLossSellTrigger from 'src/triggers/StopLossSellTrigger'
import StopLossBuyTrigger from 'src/triggers/StopLossBuyTrigger'
import TakeProfitTrigger from 'src/triggers/TakeProfitTrigger'
import Triggers from 'src/database/models/triggers'
import Advices from 'src/database/models/advices'


interface IExchangeTriggers {
  [exchangeSymbol: string]: BaseTrigger[]
}


export default class TriggerManger {
  private readonly triggers: IExchangeTriggers = {}
  private readonly manager = BudfoxManger.getInstance()
  private readonly pluginmanager = PluginsManager.getInstance()

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

    // whenever a trigger executes
    trigger.on('triggered', ({ advice, price, amount }) => {
      // notify all the plugins for this user...
      this.pluginmanager.onTrigger(trigger, advice, price, amount)

      const adviceDB = new Advices({
        uid: trigger.getUID(),
        symbol: trigger.getSymbol(),
        exchange: trigger.getExchange(),
        advice,
        price,
        mode: 'realtime',
        volume: amount,
        trigger_id: trigger.getDBId()
      })

      adviceDB.save()
    })

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


  public removeTrigger (t: Triggers) {
    const exchangeSymbol = `${t.exchange}-${t.symbol}`

    const exchangeSymbolTriggers = this.triggers[exchangeSymbol] || []
    const newTriggers = exchangeSymbolTriggers.filter(e => e.getDBId() !== t.id)
    this.triggers[exchangeSymbol] = newTriggers
  }


  private getTrigger (triggerDB: Triggers) {
    if (triggerDB.kind === 'stop-loss-buy') return new StopLossBuyTrigger(triggerDB)
    if (triggerDB.kind === 'stop-loss-sell') return new StopLossSellTrigger(triggerDB)
    if (triggerDB.kind === 'take-profit') return new TakeProfitTrigger(triggerDB)
    if (triggerDB.kind === 'trailing-stop') return new TakeProfitTrigger(triggerDB)
  }


  static getInstance () {
    return TriggerManger.instance
  }
}
