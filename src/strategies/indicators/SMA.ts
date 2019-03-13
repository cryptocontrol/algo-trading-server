// required indicators
// Simple Moving Average - O(1) implementation

import Indicator from './Indicator'

export default class SMA extends Indicator {
  private input: string
  private windowLength: number
  private prices: number[]
  public result: number
  private age: number
  private sum: number

  constructor (windowLength) {
    super()

    this.input = 'price';
    this.windowLength = windowLength;
    this.prices = [];
    this.result = 0;
    this.age = 0;
    this.sum = 0;
  }


  update (price: number) {
    var tail = this.prices[this.age] || 0; // oldest price in window
    this.prices[this.age] = price;
    this.sum += price - tail;
    this.result = this.sum / this.prices.length;
    this.age = (this.age + 1) % this.windowLength
  }
}
