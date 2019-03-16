import BaseTrigger from 'src/triggers/BaseTrigger'
import BudFox from 'src/budfox'


interface IExchangeTriggers {
  [exchangeSymbol: string]: BaseTrigger[]
}


export default class TriggerManger {
  private triggers: IExchangeTriggers = {}


  constructor (budfox: BudFox) {
    budfox.on('data', (chunk: Buffer) => {
      // const
    })
  }


  addTrigger (trigger: BaseTrigger) {
    // const exchangeSymbol = `${triggerexchange.name}-${symbol}`

    // if (this.triggers[exchangeSymbol]) return this.triggers[exchangeSymbol]

    // this.triggers[exchangeSymbol] = new BudFox(exchange, symbol)
    // return this.triggers[exchangeSymbol]
  }
}
