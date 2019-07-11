import { Trade } from "ccxt";
import { ICandle } from "../interfaces";
import BaseTrigger from "./BaseTrigger";
import Triggers from "../database/models/triggers";

/**
 * Tiered take profit trigger enables the user to create triggers to sell on
 * profit at multiple tiers at 33 % steps
 */

export default class TieredTakeProfitTrigger extends BaseTrigger {
  constructor(Trigger: Triggers) {
    super(Trigger, "Tiered Profits");

  }

  onTrade(trade: Trade) {

  }

  onCandle(_candle: ICandle) {

  }
}
