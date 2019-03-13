// required indicators
import SMMA from './SMMA'
import Indicator from './Indicator'


export default class RSI extends Indicator {
  private age: number = 0
  private avgD: SMMA
  private avgU: SMMA
  private lastClose: number
  private d: number = 0
  private rs: number = 0
  private u: number = 0
  private weight: number
  public result: number = 0

  constructor (settings: any) {
    super('candle')

    this.lastClose = null
    this.weight = settings.interval
    this.avgU = new SMMA(this.weight)
    this.avgD = new SMMA(this.weight)
  }


  update (candle) {
    const currentClose = candle.close

    if (this.lastClose === null) {
      // Set initial price to prevent invalid change calculation
      this.lastClose = currentClose

      // Do not calculate RSI for this reason - there's no change!
      this.age++
      return
    }

    if (currentClose > this.lastClose) {
      this.u = currentClose - this.lastClose
      this.d = 0
    } else {
      this.u = 0
      this.d = this.lastClose - currentClose
    }

    this.avgU.update(this.u)
    this.avgD.update(this.d)

    this.rs = this.avgU.result / this.avgD.result
    this.result = 100 - (100 / (1 + this.rs))

    if (this.avgD.result === 0 && this.avgU.result !== 0) {
      this.result = 100
    } else if (this.avgD.result === 0) {
      this.result = 0
    }

    this.lastClose = currentClose
    this.age++
  }
}
