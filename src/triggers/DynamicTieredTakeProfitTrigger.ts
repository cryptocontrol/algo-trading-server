import { Trade } from "ccxt";
import { ICandle } from "../interfaces";
import BaseTrigger from "./BaseTrigger";
import Triggers from "../database/models/triggers";

/**
 * Tiered take profit trigger enables the user to create triggers to sell on
 * profit at multiple tiers at n steps to take 1/n part of profit of target
 */

export default class DynamicTieredTakeProfitTrigger extends BaseTrigger {
  constructor(trigger: Triggers) {
    super(trigger, "Dynamci tiered Trigger");
  }

  onTrade(trade: Trade) {
  }

  onCandle(_candel: ICandle) {
  }
}
