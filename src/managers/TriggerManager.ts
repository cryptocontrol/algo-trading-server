import Trigger from 'src/triggers/Trigger'
import BudFox from 'src/budfox'


interface IExchangeTriggers {
  [exchangeSymbol: string]: Trigger[]
}


export default class TriggerManger {
  private triggers: IExchangeTriggers = {}


  constructor (budfox: BudFox) {
    budfox.on('data', (chunk: Buffer) => {
      // const
    })
  }


  addTrigger (trigger: Trigger) {
    // const exchangeSymbol = `${triggerexchange.name}-${symbol}`

    // if (this.triggers[exchangeSymbol]) return this.triggers[exchangeSymbol]

    // this.triggers[exchangeSymbol] = new BudFox(exchange, symbol)
    // return this.triggers[exchangeSymbol]
  }
}
