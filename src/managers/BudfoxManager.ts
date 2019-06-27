import BudFox from 'src/budfox'
import ExchangeManger from './ExchangeManager'
import log from 'src/utils/log'


interface IBudfoxes {
  [exchangeSymbol: string]: BudFox
}


/**
 * The Budfox Manager is responsible for managing all the budfox instances. All other mangers
 * fetch budfox instances using this manager.
 *
 * This class is a singleton.
 */
export default class BudfoxManger {
  private readonly budfoxes: IBudfoxes = {}
  private readonly manager = ExchangeManger.getInstance()
  private static readonly instance = new BudfoxManger()


  getBudfox (exchangeId: string, symbol: string): BudFox {
    const exchangeSymbol = `${exchangeId}-${symbol}`

    if (this.budfoxes[exchangeSymbol]) return this.budfoxes[exchangeSymbol]

    const exchange = this.manager.getExchange(exchangeId)

    log.debug('creating budfox for', exchange.id, symbol)

    const budfox = new BudFox(exchange, symbol)
    this.budfoxes[exchangeSymbol] = budfox

    return budfox
  }


  removeBudfox (budfox: BudFox) {
    log.debug('removing budfox for', budfox.exchange.id, budfox.symbol)

    const exchangeSymbol = `${budfox.exchange.id}-${budfox.symbol}`
    if (this.budfoxes[exchangeSymbol]) delete this.budfoxes[exchangeSymbol]
    budfox.murder()
  }


  static getInstance () {
    return BudfoxManger.instance
  }
}
