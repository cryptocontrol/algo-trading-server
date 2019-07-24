import { Trade } from "ccxt";
import { ICandle } from "../interfaces";
import BaseTrigger from "./BaseTrigger";
import Triggers from "../database/models/triggers";

/**
 * Tiered take profit trigger enables the user to create triggers to sell on
 * profit at multiple tiers at 33 % steps
 */

interface Params {
  action: string,
  type: string,
  steps: number,
  executedSteps: {
    [key: string]: boolean } };

export default class TieredTakeProfitTrigger extends BaseTrigger {
  private readonly action: "sell";
  private readonly type: "market" | "limit";
  private readonly params: Params;

  constructor(trigger: Triggers) {
    super(trigger, "Tiered Profits");

    const params = JSON.parse(trigger.params);

    this.action = params.action;
    this.type = params.type;
    this.params = params;

    if (this.action !== "sell") throw new Error('bad/missing action');
    if (this.type !== "market" && this.type !== "limit")
      throw new Error('bad/missing type');
  }

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
    const { createdAtPrice, targetPrice } = this.triggerDB
    const priceDelta = targetPrice - createdAtPrice

    // price for the first tier or step
    const firstStep = createdAtPrice + (0.33 * priceDelta);
    // price for the second tier or step
    const secondStep = createdAtPrice + (0.66 * priceDelta);
    // the profit amount for for the first & second tier or step
    const amount = Math.floor(0.33 * this.triggerDB.amount);
    // the profit amount when target priced is achived
    const remainingAmount = this.triggerDB.amount - (2 * amount);

    // trigger a maket or limit sell when price crosses the first tier
    // and this condition is achieved for the first time
    if (price >= firstStep && price < secondStep
      && this.params.executedSteps[1] === false) {
      if (this.type === "market") this.advice('market-sell', price, amount);
      if (this.type === "limit") this.advice('limit-sell', price, amount);
      // TODO: add fields to check weather the trigger was partiall executed

      this.onPartialExecution({ ...this.params.executedSteps, 1: true });
    }

    // trigger a maket or limit sell when price crosses the second tier
    // and this condition is achieved for the first time
    if (price >= secondStep && price < this.triggerDB.targetPrice
      && this.params.executedSteps[2] !== true
      && this.params.executedSteps[1] === true) {
      if (this.type === "market") this.advice('market-sell', price, amount);
      if (this.type === "limit") this.advice('limit-sell', price, amount);
      // TODO: add fields to check weather the trigger was partiall executed

      this.onPartialExecution({ ...this.params.executedSteps, 2: true })
    }

    // trigger a maket or limit sell when target Price is achived
    // and this condition is achieved for the first time
    if (price >= this.triggerDB.targetPrice
      && this.params.executedSteps[3] !== true
      && this.params.executedSteps[1] === true
      && this.params.executedSteps[2] === true) {
      if (this.type === "market") this.advice('market-sell', price, remainingAmount);
      if (this.type === "limit") this.advice('limit-sell', price, remainingAmount);

      this.onPartialExecution({ ...this.params.executedSteps, 3: true })

      this.close();
    }
  }

  onCandle(_candle: ICandle) {
  }
}
