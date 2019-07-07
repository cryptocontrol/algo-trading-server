import BaseTrigger from "./BaseTrigger";
import { Trade } from "ccxt";
import Triggers from "../../src/database/models/triggers";
import { ICandle } from "src/interfaces";


// TODO: Write code for cancel order trigger

export default class CancelOrderTrigger extends BaseTrigger {
  orderId: number;
  condition: number;
  action: 'cancel'


  constructor(trigger: Triggers) {
    super(trigger, "Cancel Order")

    const params = JSON.parse(trigger.params);
    this.orderId = params.orderId;
    this.condition = params.condition;
    this.action = params.action;

    if (params.action !== 'cancel') throw new Error('bad/missing action');
  }

  onTrade(trade: Trade) {
    if (!this.isLive) return;
    const { price } = trade;

    if (price <= this.condition) {
      this.advice("cancel-order", price, this.triggerDB.targetVolume);
      this.close();
    }
  }

  onCandle(candle: ICandle) {
  }
}
