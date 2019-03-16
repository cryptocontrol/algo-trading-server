import BaseTrigger from 'src/triggers/BaseTrigger'
import BudFox from 'src/budfox'
import BudfoxManger from './BudfoxManager';
import Triggers from 'src/database/models/triggers';
import StopLossTrigger from 'src/triggers/StopLossTrigger';


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
    const budfox = this.manager.getBudfox(t.exchange, t.symbol)
    const trigger = this.getTrigger(t, budfox)

    budfox.on('candle', candle => trigger.onCandle(candle))
    budfox.on('trade', trade => trigger.onTrade(trade))
  }


  private getTrigger (triggerDB: Triggers, budfox: BudFox) {
    if (triggerDB.kind === 'stop-loss') return new StopLossTrigger(triggerDB)
  }


  static getInstance () {
    return TriggerManger.instance
  }
}
