import BudFox from 'src/budfox'
import ExchangeManger from './ExchangeManager'


interface IBudfoxes {
  [exchangeSymbol: string]: BudFox
}


export default class BudfoxManger {
  private readonly budfoxes: IBudfoxes = {}
  private readonly manager = ExchangeManger.getInstance()
  private static readonly instance = new BudfoxManger()


  getBudfox (exchangeId: string, symbol: string): BudFox {
    const exchangeSymbol = `${exchangeId}-${symbol}`

    if (this.budfoxes[exchangeSymbol]) return this.budfoxes[exchangeSymbol]

    const exchange = this.manager.getExchange(exchangeId)

    const budfox = new BudFox(exchange, symbol)
    this.budfoxes[exchangeSymbol] = budfox

    return budfox
  }


  // addBudfox (exchange: BaseExchange, symbol: string): BudFox {
  //   const exchangeSymbol = `${exchange.name}-${symbol}`

  //   if (this.budfoxes[exchangeSymbol]) return this.budfoxes[exchangeSymbol]

  //   const budfox = new BudFox(exchange, symbol)
  //   this.budfoxes[exchangeSymbol] = budfox

  //   budfox.on('data', (chunk: Buffer) => {
  //     const candle = JSON.parse(chunk.toString())
  //     // console.log('exchangeSymbol', candle)
  //   })

  //   return budfox
  // }

  static getInstance () {
    return BudfoxManger.instance
  }
}
