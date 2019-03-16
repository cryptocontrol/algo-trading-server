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
    const activeTriggers = await Triggers.findAll({ where: { hasTriggered: false }})
    activeTriggers.forEach(t => this.addTrigger(t))
  }


  public addTrigger (t: Triggers) {
    const trigger = this.getTrigger(t)
    if (!trigger) return

    const budfox = this.manager.getBudfox(t.exchange, t.symbol)

    budfox.on('candle', candle => trigger.onCandle(candle))
    budfox.on('trade', trade => trigger.onTrade(trade))

    // todo; handle a remove
    // trigger.on('close', )
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
