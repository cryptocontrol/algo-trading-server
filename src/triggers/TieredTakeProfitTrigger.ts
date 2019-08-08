import { Trade } from 'ccxt'
import { ICandle } from '../interfaces'
import BaseTrigger from './BaseTrigger'
import Triggers from '../database/models/triggers'

/**
 * Tiered take profit trigger enables the user to create triggers to sell on
 * profit at multiple tiers at 33 % steps
 */
export default class TieredTakeProfitTrigger extends BaseTrigger {
  private readonly action: 'market-buy' | 'market-sell' | 'limit-buy' | 'limit-sell'
  private executedSteps: { [key: string]: boolean } = {}

  private readonly amount: number
  private readonly createdAtPrice: number
  private readonly targetPrice: number


  constructor(trigger: Triggers) {
    super(trigger, 'Tiered Profits')

    const params = JSON.parse(trigger.params)

    this.action = params.action
    this.amount = params.amount
    this.createdAtPrice = params.createdAtPrice
    this.targetPrice = params.targetPrice

    if (this.action !== 'market-buy' && this.action !== 'market-sell' &&
    this.action !== 'limit-buy' && this.action !== 'limit-sell')
      throw new Error('bad/missing action')
  }


  onPartialExecution(data) {
    this.triggerDB.params = JSON.stringify({
      ...JSON.parse(this.triggerDB.params),
      executedSteps: {
        ...this.executedSteps,
        ...data
      }
    })

    this.triggerDB.save()

    this.executedSteps = {
      ...this.executedSteps,
      ...data
    }
  }


  onTrade(trade: Trade) {
    if (!this.isLive()) return

    const { price } = trade
    const { createdAtPrice, targetPrice, executedSteps, action } = this
    const priceDelta = targetPrice - createdAtPrice

    // price for the first tier or step
    const firstStep = createdAtPrice + (0.33 * priceDelta)

    // price for the second tier or step
    const secondStep = createdAtPrice + (0.66 * priceDelta)

    // the profit amount for for the first & second tier or step
    const amount = 0.33 * this.amount

    // the profit amount when target priced is achived
    const remainingAmount = this.amount - (2 * amount)

    // trigger a maket or limit sell when price crosses the first tier
    // and this condition is achieved for the first time
    if (price >= firstStep && price < secondStep && !executedSteps[1]) {
      // TODO: add fields to check weather the trigger was partially executed
      this.advice(action, { price, amount })
      this.onPartialExecution({ 1: true })
    }

    // trigger a maket or limit sell when price crosses the second tier
    // and this condition is achieved for the first time
    if (price >= secondStep && price < targetPrice && executedSteps[1] && !executedSteps[2]) {
      this.advice(action, { price, amount })
      this.onPartialExecution({ 2: true })
    }

    // trigger a maket or limit sell when target Price is achived
    // and this condition is achieved for the first time
    if (price >= targetPrice && executedSteps[1] && executedSteps[2] && !executedSteps[3]) {
      this.advice(action, { price, amount: remainingAmount })
      this.onPartialExecution({ 3: true })
      this.close()
    }
  }


  onCandle(_candle: ICandle) {
    // do nothing
  }
}
