export default class Indicator {
  public readonly input: 'candle' | 'price'

  constructor (input: 'candle' | 'price') {
    this.input = input
  }
}
