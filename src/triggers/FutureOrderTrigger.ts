import { Trade } from "ccxt";
import { ICandle } from "../interfaces";
import BaseTrigger from "./BaseTrigger";
import Triggers from "../database/models/triggers";
import * as _ from "underscore";

/**
 * Future order trigger to enable users to execute an order after certain
 * amount of time and on certian condition
 */

export default class FutureOrderTrigger extends BaseTrigger {
  private readonly action: "buy" | "sell";
  private readonly type: "market" | "limit";
  private readonly condition: [{
    [s: string]: number | string,
    type: "less-than" | "greater-than"
  }]

  constructor(trigger: Triggers) {
    super(trigger, "future order");

    const params = JSON.parse(trigger.params);

    this.action = params.action;
    this.type = params.type;
    this.condition = params.condition;

    if (this.action !== "sell" && this.action !== "buy")
      throw new Error('bad/missing action');

    if (this.type !== "market" && this.type !== "limit")
      throw new Error('bad/missing type');

    if (!this.condition || !(this.condition.length > 0))
      throw new Error('bad/missing condition')

    // check type
    const typeCheck = this.condition.map(
      item => item['type'] === 'less-than' ||
        item['type'] === 'greater-than').reduce((a, c) => a && c);

    if (!typeCheck) throw new Error('bad/bad type in condition');

    // check values
    const valueCheck = this.condition.map(
      item => typeof item['Date'] === 'number' ||
        typeof item['Price'] === 'number' ||
        typeof item['Volume'] === 'number').reduce((a, c) => a && c);

    if (!valueCheck) throw new Error('bad/bad value in condition');

  }

  onTrade(trade: Trade) {
    if (!this.isLive()) return

    const { price } = trade
    const volume = this.triggerDB.amount * price
    const time = new Date().getTime()

    // handle less than condition
    const lessThan = this.condition.filter(item => item['type'] === 'less-than');
    const greaterThan = this.condition.filter(item => item['type'] === 'greater-than');

    // for date condition
    const dateCondtion = this.condition.filter(item => item['Date'])
      .map(item => item['Date'])[0]
    // get price conditon
    const priceCondtion = this.condition.filter(item => item['Price'])
      .map(item => item['Price'])[0]
    // get volume condtion
    const volumeCondtion = this.condition.filter(item => item['Volume'])
      .map(item => item['Volume'])[0]

    if (lessThan.length > 0) {
      // When any of the conditon arrives create order
      if (dateCondtion && time <= dateCondtion ||
        priceCondtion && price <= priceCondtion ||
        volumeCondtion && volume <= volumeCondtion) {
        if (this.type === 'limit') this.advice('limit-buy', price, this.triggerDB.amount)
        if (this.type === 'market') this.advice('market-buy', price, this.triggerDB.amount)
        this.close()
      }
    }

    // handle greater than condition

    if (greaterThan.length > 0) {
      // When any of the conditon arrives create order
      if (dateCondtion && time >= dateCondtion ||
        priceCondtion && price >= priceCondtion ||
        volumeCondtion && volume >= volumeCondtion) {
        if (this.type === 'limit') this.advice('limit-buy', price, this.triggerDB.amount)
        if (this.type === 'market') this.advice('market-buy', price, this.triggerDB.amount)
        this.close()
      }
    }
  }

  onCandle(_candel: ICandle) {}
}

