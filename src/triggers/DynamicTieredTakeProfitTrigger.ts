import { Trade } from "ccxt";
import { ICandle } from "../interfaces";
import BaseTrigger from "./BaseTrigger";
import Triggers from "../database/models/triggers";
import TrailingStopTrigger from "./TrailingStopTrigger";

/**
 * Tiered take profit trigger enables the user to create triggers to sell on
 * profit at multiple tiers at n steps to take 1/n part of profit of target
 */

export default class DynamicTieredTakeProfitTrigger extends BaseTrigger {
  private readonly action: "sell";
  private readonly type: "limit" | "market";
  private readonly steps: number;
  private readonly params: any;

  constructor(trigger: Triggers) {
    super(trigger, "Dynamic tiered Trigger");

    const params = JSON.parse(trigger.params);
    this.action = params.action;

    this.type = params.type;
    // tiers for take profit
    this.steps = params.steps;
    this.params = params;

    if (this.action !== "sell") throw new Error('bad/missing action');
    if (this.type !== "market" && this.type !== "limit")
      throw new Error('bad/missing type');
    if (!this.steps && typeof this.steps !== "number")
      throw new Error('bad/missing steps or invalid type');
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
    const amount = this.triggerDB.amount / this.steps;
    // Amount left for the last tier
    // TODO: What will be remaning amount
    const remainingAmount = this.triggerDB.amount - (
      amount * (this.steps - 1))
    // The amount between targer price and price at which trigger was created
    const priceDelta = this.triggerDB.targetPrice - this.triggerDB.createdAtPrice
    // Price for the first step or tier
    const firstStep = this.triggerDB.createdAtPrice + (priceDelta / this.steps)

    // trigger a maket or limit sell when price crosses the first tier
    // and this condition is achieved for the first time
    if (price >= this.triggerDB.targetPrice) {
      if (this.type === "market") this.advice('market-sell', price, remainingAmount);
      if (this.type === "limit") this.advice('limit-sell', price, remainingAmount);
      this.close();
    } else {
      // other conditions
      if (price >= firstStep && price < (this.triggerDB.targetPrice - (priceDelta / this.steps))) {
        const priceDelta = price - this.triggerDB.createdAtPrice
        const currentStep = Math.floor(priceDelta / amount)
        // check if current step was previously executed

        if (this.params.executedSteps[currentStep]) return

        const amountToSell = currentStep * amount

        if (this.type === "market") this.advice('market-sell', price, amountToSell);
        if (this.type === "limit") this.advice('limit-sell', price, amountToSell);

        // Update params on partial execution
        this.onPartialExecution({ ...this.params.executedSteps, [currentStep]: true });
      }
    }
  }

  onCandle(_candel: ICandle) {
  }
}
