import Trigger from 'src/triggers/Trigger'
import BudFox from 'src/budfox/budfox'


interface IExchangeTriggers {
  [exchange: string]: {
    [symbol: string]: Trigger[]
  }
}


class TriggerManger {
  triggers: IExchangeTriggers = {}


  constructor (budfox: BudFox) {
    budfox.on('data', (chunk) => {

    })
  }


  addTrigger (trigger: Trigger) {

  }
}
