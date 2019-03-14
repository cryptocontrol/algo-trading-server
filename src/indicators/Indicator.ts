export default class Indicator {
  public readonly input: 'candle' | 'price' | 'trade'
  public age: number = 0
  public result: number = 0

  constructor (input: 'candle' | 'price' | 'trade') {
    this.input = input
  }
}
