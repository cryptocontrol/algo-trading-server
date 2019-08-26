import { Trade } from 'ccxt'

import { ICandle } from '../interfaces'
import BaseStrategy from './BaseStrategy'
import log from '../utils/log'
import RSI from '../indicators/RSI'
import Strategies from '../database/models/strategies'


interface ITrend {
  direction: 'none' | 'high' | 'low'
  duration: number
  persisted: boolean
  adviced: boolean
}


interface IRSIStrategyParams {
  days: number
  thresholdHigh: number
  thresholdLow: number
  persistence: number
}


export default class RSIStrategy extends BaseStrategy<IRSIStrategyParams> {
  private readonly rsi: RSI

  private readonly thresholdHigh: number
  private readonly thresholdLow: number
  private readonly persistence: number = 0
  private readonly requiredHistory: number = 30 // 30 days by default

  private trend: ITrend = {
    direction: 'none',
    duration: 0,
    persisted: false,
    adviced: false
  }


  private constructor (strategy: Strategies) {
    super('RSI', strategy)

    this.rsi = new RSI(this.params.days || 14)
    this.thresholdHigh = this.params.thresholdHigh || 70
    this.thresholdLow = this.params.thresholdLow || 20
    this.persistence = this.params.persistence || 0

    // this.requiredHistory = this.tradingAdvisor.historySize

    // // define the indicators we need
    // this.addIndicator('rsi', 'RSI', this.settings)
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


  onTrade (trade: Trade) {
    // do nothing
  }


  onCandle (candle: ICandle) {
    this.rsi.update(candle)
    const rsiVal = this.rsi.result

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
      } // else this.advice('do-nothing')

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
      } // else this.advice('do-nothing')
    } else {
      log.debug('in no trend')
      this.advice('do-nothing')
    }
  }
}
