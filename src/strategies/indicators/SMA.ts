// required indicators
// Simple Moving Average - O(1) implementation

import Indicator from './Indicator'

export default class SMA extends Indicator {
  private windowLength: number
  private prices: number[] = []
  private sum: number = 0


  constructor (windowLength) {
    super('price')

    this.windowLength = windowLength;
  }


  update (price: number) {
    var tail = this.prices[this.age] || 0; // oldest price in window
    this.prices[this.age] = price;
    this.sum += price - tail;
    this.result = this.sum / this.prices.length;
    this.age = (this.age + 1) % this.windowLength
  }
}
