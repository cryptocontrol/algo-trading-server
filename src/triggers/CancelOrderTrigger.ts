import BaseTrigger from "./BaseTrigger";
import { Trade } from "ccxt";
import Triggers from "../../src/database/models/triggers";
import { ICandle } from "src/interfaces";


// TODO: Write code for cancel order trigger

export default class CancelOrderTrigger extends BaseTrigger {
  action: 'cancel'
  condition: [string];


  constructor(trigger: Triggers) {
    super(trigger, "Cancel Order")

    const params = JSON.parse(trigger.params);
    this.action = params.action;
    this.condition = params.condition;


    if (params.action !== 'cancel') throw new Error('bad/missing action');

    if ([
      'greater-than',
      'greater-than-equal',
      'less-than',
      'less-than-equal'
    ].indexOf(params.condition) === -1) throw new Error('bad/missing condition');
  }

  onTrade(trade: Trade) {
    if (!this.isLive) return;
    const { price } = trade;

    if (price <= this.triggerDB.targetPrice && this.condition.toString() === "less-than-equal"
      || price < this.triggerDB.targetPrice && this.condition.toString() === "less-than"
      || price >= this.triggerDB.targetPrice && this.condition.toString() === "greater-than-equal"
      || price > this.triggerDB.targetPrice && this.condition.toString() === "greater-than") {
      this.advice("cancel-order", price, this.triggerDB.targetVolume);
      this.close();
    }
  }

  onCandle(candle: ICandle) {
  }
}
