import { Trade } from 'ccxt'
import { ICandle } from '../interfaces'
import BaseTrigger from './BaseTrigger'
import Triggers from '../database/models/triggers'
import TrailingStopTrigger from './TrailingStopTrigger'

/**
 * Tiered take profit trigger enables the user to create triggers to sell on
 * profit at multiple tiers at n steps to take 1/n part of profit of target
 */

export default class DynamicTieredTakeProfitTrigger extends BaseTrigger {
  private readonly action: 'market-buy' | 'market-sell' | 'limit-buy' | 'limit-sell'
  private readonly steps: number

  private executedSteps: { [key: string]: boolean } = {}

  private readonly amount: number
  private readonly createdAtPrice: number
  private readonly targetPrice: number


  constructor(trigger: Triggers) {
    super(trigger, 'Dynamic tiered Trigger')

    const params = JSON.parse(trigger.params)

    this.action = params.action
    this.steps = params.steps
    this.action = params.action
    this.amount = params.amount
    this.createdAtPrice = params.createdAtPrice
    this.targetPrice = params.targetPrice


    if (this.action !== 'market-buy' && this.action !== 'market-sell' &&
      this.action !== 'limit-buy' && this.action !== 'limit-sell')
      throw new Error('bad/missing action')

    if (!this.steps && typeof this.steps !== 'number')
      throw new Error('bad/missing steps or invalid type')
  }


  // Update params after partial execution is achived
  onPartialExecution(data) {
    this.triggerDB.params = JSON.stringify({
      ...JSON.parse(this.triggerDB.params),
      executedSteps: { ...data }
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

    // Amount to be traded after reaching a tier
    const amount = this.amount / this.steps

    // Amount left for the last tier
    // TODO: What will be remaning amount
    const remainingAmount = this.amount - (amount * (this.steps - 1))

    // The amount between targer price and price at which trigger was created
    const priceDelta = this.targetPrice - this.createdAtPrice

    // Price for the first step or tier
    const firstStep = this.createdAtPrice + (priceDelta / this.steps)

    // trigger a maket or limit sell when price crosses the first tier
    // and this condition is achieved for the first time
    if (price >= this.targetPrice) {
      this.advice(this.action, { price, amount: remainingAmount })
      this.close()
    } else {
      // other conditions
      if (price >= firstStep && price < this.targetPrice) {
        const priceDelta = price - this.createdAtPrice
        const currentStep = Math.floor(priceDelta / amount)
        // check if current step was previously executed

        if (this.executedSteps[currentStep]) return

        const amountToSell = currentStep * amount

        this.advice(this.action, { price, amount: amountToSell })

        // Update params on partial execution
        this.onPartialExecution({ [currentStep]: true })
      }
    }
  }


  onCandle(_candel: ICandle) {
    // do nothing
  }
}
