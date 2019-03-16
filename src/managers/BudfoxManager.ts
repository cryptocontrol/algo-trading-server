import BudFox from 'src/budfox/budfox'
import BaseExchange from 'src/exchanges/core/BaseExchange'


interface IBudfoxes {
  [exchangeSymbol: string]: BudFox
}


export default class BudfoxManger {
  private budfoxes: IBudfoxes = {}


  addBudfox (exchange: BaseExchange, symbol: string): BudFox {
    const exchangeSymbol = `${exchange.name}-${symbol}`

    if (this.budfoxes[exchangeSymbol]) return this.budfoxes[exchangeSymbol]

    const budfox = new BudFox(exchange, symbol)
    this.budfoxes[exchangeSymbol] = budfox

    budfox.on('data', (chunk: Buffer) => {
      console.log('exchangeSymbol', chunk.toString())
    })

    return budfox
  }
}
