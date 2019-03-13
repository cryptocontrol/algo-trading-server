export default class Indicator {
  public readonly input: 'candle' | 'price'
  public age: number = 0
  public result: number = 0

  constructor (input: 'candle' | 'price') {
    this.input = input
  }
}
