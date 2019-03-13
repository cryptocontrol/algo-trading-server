// required indicators
import SMA from './SMA'
import Indicator from './Indicator'

export default class SMMA extends Indicator {
  private weight: number
  private prices: number[]
  public result: number
  private age: number
  private sma: SMA

  constructor (weight: number) {
    super('price')

    this.sma = new SMA(weight)
    this.weight = weight
    this.prices = []
    this.result = 0
    this.age = 0
  }

  update  (price) {
    this.prices[this.age] = price

    if (this.prices.length < this.weight) this.sma.update(price)
    else if(this.prices.length === this.weight) {
      this.sma.update(price)
      this.result = this.sma.result
    } else this.result = (this.result * (this.weight - 1) + price) / this.weight

    this.age++
  }
}
