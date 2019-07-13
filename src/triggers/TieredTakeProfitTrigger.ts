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

    // price for the first tier or step
    const firstStep = 0.33 * this.triggerDB.targetPrice;
    // price for the second tier or step
    const secondStep = 0.66 * this.triggerDB.targetPrice;
    // the profit amount for for the first & second tier or step
    const targetVolume = 0.33 * this.triggerDB.targetVolume;
    // the profit amount when target priced is achived
    const remainingVolume = this.triggerDB.targetVolume - (2 * targetVolume);

    // trigger a maket or limit sell when price crosses the first tier
    if (price >= firstStep && price < secondStep) {
      if (this.type === "market") this.advice('market-sell', price, targetVolume);
      if (this.type === "limit") this.advice('limit-sell', price, targetVolume);
    }

    // trigger a maket or limit sell when price crosses the second tier
    if (price >= secondStep && price < this.triggerDB.targetPrice) {
      if (this.type === "market") this.advice('market-sell', price, targetVolume);
      if (this.type === "limit") this.advice('limit-sell', price, targetVolume);
    }

    // trigger a maket or limit sell when target Price is achived
    if (price >= this.triggerDB.targetPrice) {
      if (this.type === "market") this.advice('market-sell', price, remainingVolume);
      if (this.type === "limit") this.advice('limit-sell', price, remainingVolume);
      this.close();
    }
  }

  onCandle(_candle: ICandle) {
  }
}
