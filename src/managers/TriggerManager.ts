import BaseTrigger from 'src/triggers/BaseTrigger'
import BudFox from 'src/budfox'
import BudfoxManger from './BudfoxManager';
import Triggers from 'src/database/models/triggers';


interface IExchangeTriggers {
  [exchangeSymbol: string]: BaseTrigger[]
}


export default class TriggerManger {
  private readonly triggers: IExchangeTriggers = {}
  private readonly manager = BudfoxManger.getInstance()
  private static readonly instance = new TriggerManger()


  async loadTriggers () {
    const activeTriggers = await Triggers.findAll({ where: { hasTriggered: false }})

    activeTriggers.forEach(t => {
      console.log(t.exchange, t.symbol)
      const budfox = this.manager.getBudfox(t.exchange, t.symbol)

    })
  }


  addTrigger (trigger: BaseTrigger) {
    // const exchangeSymbol = `${triggerexchange.name}:${symbol}`

    // if (this.triggers[exchangeSymbol]) return this.triggers[exchangeSymbol]

    // this.triggers[exchangeSymbol] = new BudFox(exchange, symbol)
    // return this.triggers[exchangeSymbol]
  }


  static getInstance () {
    return TriggerManger.instance
  }
}
