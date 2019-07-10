import BaseTrigger from "./BaseTrigger";
import { Trade } from "ccxt";
import Triggers from "../../src/database/models/triggers";
import { ICandle } from "../../src/interfaces";


/**
 * Cancel order trigger enables to cancel an order at various conditons which
 * would enable the user to have buy and sell walls
 */

export default class CancelOrderTrigger extends BaseTrigger {
  private readonly action: 'cancel';
  private readonly condition: 'greater-than'|
                     'greater-than-equal' |
                     'less-than' |
                     'less- han-equal';


  constructor(trigger: Triggers) {
    super(trigger, "Cancel Order")

    const params = JSON.parse(trigger.params);
    this.action = params.action;
    this.condition = params.condition;

    // check for missing action
    if (this.action !== 'cancel') throw new Error('bad/missing action');

    // check for missing condition
    if ([
      'greater-than',
      'greater-than-equal',
      'less-than',
      'less-than-equal'
    ].indexOf(this.condition) === -1) throw new Error('bad/missing condition');
  }

  onTrade(trade: Trade) {
    // if the prices are not live than return
    if (!this.isLive) return;
    // get current price
    const { price } = trade;

    // if the price satisfies the target price and condition pair then
    // trigger an cancel order request
    if (price <= this.triggerDB.targetPrice
        && this.condition.toString() === "less-than-equal"
      || price < this.triggerDB.targetPrice
        && this.condition.toString() === "less-than"
      || price >= this.triggerDB.targetPrice
        && this.condition.toString() === "greater-than-equal"
      || price > this.triggerDB.targetPrice
        && this.condition.toString() === "greater-than") {
      // emitt a cancel order adivce for advice manager
      this.advice("cancel-order", price, this.triggerDB.targetVolume);
      // emitt a close event for the trigger
      this.close();
    }
  }

  onCandle(candle: ICandle) {
  }
}
