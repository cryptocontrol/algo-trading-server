import { Trade } from "ccxt";
import { ICandle } from "../interfaces";
import BaseTrigger from "./BaseTrigger";
import Triggers from "../database/models/triggers";

/**
 * Tiered take profit trigger enables the user to create triggers to sell on
 * profit at multiple tiers at 33 % steps
 */

export default class TieredTakeProfitTrigger extends BaseTrigger {
  private readonly action: "sell";
  private readonly type: "market" | "limit";

  constructor(trigger: Triggers) {
    super(trigger, "Tiered Profits");

    const params = JSON.parse(trigger.params);

    this.action = params.action;
    this.type = params.type;

    if (this.action !== "sell") throw new Error('bad/missing action');
    if (this.type !== "market" && this.type !== "limit") throw new Error('bad/missing type');
  }

  onTrade(trade: Trade) {
    if (!this.isLive()) return;

    const { price } = trade;
    const { createdAtPrice, targetPrice } = this.triggerDB
    const priceDelta = targetPrice - createdAtPrice

    // price for the first tier or step
    const firstStep = 0.33 * priceDelta;
    // price for the second tier or step
    const secondStep = 0.66 * priceDelta;
    // the profit amount for for the first & second tier or step
    const amount = Math.floor(0.33 * this.triggerDB.amount);
    // the profit amount when target priced is achived
    const remainingAmount = this.triggerDB.amount - (2 * amount);

    // trigger a maket or limit sell when price crosses the first tier
    if (price >= firstStep && price < secondStep) {
      if (this.type === "market") this.advice('market-sell', price, amount);
      if (this.type === "limit") this.advice('limit-sell', price, amount);
    }

    // trigger a maket or limit sell when price crosses the second tier
    if (price >= secondStep && price < this.triggerDB.targetPrice) {
      if (this.type === "market") this.advice('market-sell', price, amount);
      if (this.type === "limit") this.advice('limit-sell', price, amount);
    }

    // trigger a maket or limit sell when target Price is achived
    if (price >= this.triggerDB.targetPrice) {
      if (this.type === "market") this.advice('market-sell', price, remainingAmount);
      if (this.type === "limit") this.advice('limit-sell', price, remainingAmount);
      this.close();
    }
  }

  onCandle(_candle: ICandle) {
  }
}
