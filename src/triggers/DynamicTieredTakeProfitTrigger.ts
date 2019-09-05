import { Trade } from "ccxt";
import { ICandle } from "../interfaces";
import BaseTrigger from "./BaseTrigger";
import Triggers from "../database/models/triggers";
import TrailingStopTrigger from "./TrailingStopTrigger";
import { isNumber } from "util"

/**
 * Tiered take profit trigger enables the user to create triggers to sell on
 * profit at multiple tiers at n steps to take 1/n part of profit of target
 */

export default class DynamicTieredTakeProfitTrigger extends BaseTrigger {
  private readonly action: "market-sell" | "limit-sell";
  private readonly steps: number;
  private readonly params: any;
  private readonly amount: number;
  private readonly price: number;
  private readonly createdAtPrice: number;

  constructor(trigger: Triggers) {
    super(trigger, "Dynamic tiered Trigger");

    const params = JSON.parse(trigger.params);
    this.action = params.action;
    // tiers for take profit
    this.steps = params.steps;
    this.params = params;
    this.amount = params.amount;
    this.price = params.price;
    this.createdAtPrice = params.createdAtPrice;

    if (this.action !== 'market-sell' && this.action !== 'limit-sell')
      throw new Error('bad/missing action')

    if (!this.steps && typeof this.steps !== "number")
      throw new Error('bad/missing steps or invalid type')

    if (this.price && !isNumber(this.price)) throw new Error('bad price')
    if (!this.amount || !isNumber(this.amount)) throw new Error('bad/missing amount')
  }

  // Update params after partial execution is achived
  onPartialExecution(data) {
    this.triggerDB.params = JSON.stringify({
      ...this.params,
      executedSteps: {
        ...data
      }
    });
  }

  onTrade(trade: Trade) {
    if (!this.isLive()) return;

    const { price } = trade;

    // Amount to be traded after reaching a tier
    const amount = this.amount / this.steps;
    // Amount left for the last tier
    // TODO: What will be remaning amount
    const remainingAmount = this.amount - (
      amount * (this.steps - 1))
    // The amount between targer price and price at which trigger was created
    const priceDelta = this.price - this.createdAtPrice
    // Price for the first step or tier
    const firstStep = this.createdAtPrice + (priceDelta / this.steps)

    // trigger a maket or limit sell when price crosses the first tier
    // and this condition is achieved for the first time
    if (this.action.endsWith("sell") && price >= this.price) {
      this.advice(this.action, { price, amount: remainingAmount });
      this.close();
    } else {
      // other conditions
      if (price >= firstStep && price < (this.price - (priceDelta / this.steps))) {
        const priceDelta = price - this.createdAtPrice
        const currentStep = Math.floor(priceDelta / amount)
        // check if current step was previously executed

        if (this.params.executedSteps[currentStep]) return

        if (this.action.endsWith("sell"))
          this.advice(this.action, { price, amount });

        // Update params on partial execution
        this.onPartialExecution({ ...this.params.executedSteps, [currentStep]: true });
      }
    }
  }

  onCandle(_candel: ICandle) {
  }
}
