import BaseTrigger from "./BaseTrigger";
import { Trade } from "ccxt";
import Triggers from "../../src/database/models/triggers";
import { ICandle } from "src/interfaces";


// TODO: Write code for cancel order trigger

export default class CancelOrderTrigger extends BaseTrigger {
  action: 'cancel'


  constructor(trigger: Triggers) {
    super(trigger, "Cancel Order")

    const params = JSON.parse(trigger.params);
    this.action = params.action;

    if (params.action !== 'cancel') throw new Error('bad/missing action');
  }

  onTrade(trade: Trade) {
    if (!this.isLive) return;
    const { price } = trade;

    if (price <= this.triggerDB.targetPrice) {
      this.advice("cancel-order", price, this.triggerDB.targetVolume);
      this.close();
    }
  }

  onCandle(candle: ICandle) {
  }
}
