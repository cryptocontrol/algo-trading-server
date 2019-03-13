import BaseStrategy from './BaseStrategy'
import RSI from './indicators/RSI'
import log from '../utils/log'


interface ITrend {
  direction: 'none' | 'high' | 'low',
  duration: number
  persisted: boolean
  adviced: boolean
}


export default class RSIStrategy extends BaseStrategy {
  private readonly rsi: RSI

  private readonly thresholdHigh: number = 70
  private readonly thresholdLow: number = 20
  private readonly persistence: number = 0

  private trend: ITrend = {
    direction: 'none',
    duration: 0,
    persisted: false,
    adviced: false
  }

  private constructor (id: string, trigger: any) {
    super('RSI')

    this.rsi = new RSI(15)

    // this.requiredHistory = this.tradingAdvisor.historySize

    // // define the indicators we need
    // this.addIndicator('rsi', 'RSI', this.settings)
  }


  static create (id: string, trigger: any) {
    return new RSIStrategy(id, trigger)
  }


  // for debugging purposes log the last
  // calculated parameters.
  log (candle) {
    const digits = 8
    const rsi = this.rsi

    log.debug('calculated RSI properties for candle:')
    log.debug('\t', 'rsi:', rsi.result.toFixed(digits))
    log.debug('\t', 'price:', candle.close.toFixed(digits))
  }


  process (lastprice: number) {

  }


  check () {
    const rsi = this.rsi
    const rsiVal = rsi.result

    if (rsiVal > this.thresholdHigh) {
      // new trend detected
      if (this.trend.direction !== 'high')
        this.trend = {
          duration: 0,
          persisted: false,
          direction: 'high',
          adviced: false
        }

      this.trend.duration++
      log.debug(`in high since ${this.trend.duration} candle(s)`)

      if (this.trend.duration >= this.persistence) this.trend.persisted = true

      if (this.trend.persisted && !this.trend.adviced) {
        this.trend.adviced = true
        this.advice('short')
      } else this.advice('do-nothing')

    } else if (rsiVal < this.thresholdLow) {
      // new trend detected
      if (this.trend.direction !== 'low')
        this.trend = {
          duration: 0,
          persisted: false,
          direction: 'low',
          adviced: false
        }

      this.trend.duration++
      log.debug(`in low since ${this.trend.duration} candle(s)`)

      if (this.trend.duration >= this.persistence) this.trend.persisted = true

      if (this.trend.persisted && !this.trend.adviced) {
        this.trend.adviced = true
        this.advice('long')
      } else this.advice('do-nothing')
    } else {
      log.debug('in no trend')
      this.advice('do-nothing')
    }
  }
}
