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

  constructor(trigger: Triggers) {
    super(trigger, "Dynamic tiered Trigger");

    const params = JSON.parse(trigger.params);

    this.action = params.action;
    this.type = params.type;
    this.steps = params.steps;

    if (this.action !== "sell") throw new Error('bad/missing action');
    if (this.type !== "market" && this.type !== "limit")
      throw new Error('bad/missing type');
    if (!this.steps && typeof this.steps !== "number")
      throw new Error('bad/missing steps or invalid type');
  }

  onTrade(trade: Trade) {
    if (!this.isLive()) return;

    const { price } = trade;

    const targetVolume = this.triggerDB.targetVolume / this.steps;

    if (price >= this.triggerDB.targetPrice) {
      if (this.type === "market") this.advice('market-sell', price, targetVolume);
      if (this.type === "limit") this.advice('limit-sell', price, targetVolume);
      this.close();
    } else{
      // other conditions
      return
    }
  }

  onCandle(_candel: ICandle) {
  }
}
