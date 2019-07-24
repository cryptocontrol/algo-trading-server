import * as data from "../data";
import { expect } from "chai";
import TieredTakeProfitTrigger from "../../src/triggers/TieredTakeProfitTrigger";

export default describe("Tiered Take Profit Tests", async function() {
  let trigger ,trade;

  it(`Should check & validate tiered take profit trigger
    when price is 1/3rd of target price for sell market order`, done => {
    trigger = {
      ...data.default.trigger,
      params: '{ "action": "sell", "type": "market" }' };

    const price = 0.34 * trigger.targetPrice;
    const amount = Math.floor(0.33 * trigger.amount);

    trade = {
      ...data.default.trigger,
      price
    }

    const tieredTakeProfit = new TieredTakeProfitTrigger(trigger);

    tieredTakeProfit.on("advice", data => {
      expect(data).to.deep.equal(
        { advice: "market-sell", price, amount })
        done();
    })

    tieredTakeProfit.onTrade(trade);
  })

  it(`Should check & validate tiered take profit trigger
    when price is 1/3rd of target price for sell limit order`, done => {
    trigger = {
      ...data.default.trigger,
      params: '{ "action": "sell", "type": "limit" }' };

    const price = 0.34 * trigger.targetPrice;
    const amount = Math.floor(0.33 * trigger.amount);

    trade = {
      ...data.default.trigger,
      price
    }

    const tieredTakeProfit = new TieredTakeProfitTrigger(trigger);

    tieredTakeProfit.on("advice", data => {
      expect(data).to.deep.equal(
        { advice: "limit-sell", price, amount })
        done();
    })

    tieredTakeProfit.onTrade(trade);
  })

  it(`Should check & validate tiered take profit trigger
    when price is 2/3rd of target price for sell market order`, done => {
    trigger = {
      ...data.default.trigger,
      params: '{ "action": "sell", "type": "market" }' };

    const price = 0.67 * trigger.targetPrice;
    const amount = Math.floor(0.33 * trigger.amount);

    trade = {
      ...data.default.trigger,
      price
    }

    const tieredTakeProfit = new TieredTakeProfitTrigger(trigger);

    tieredTakeProfit.on("advice", data => {
      expect(data).to.deep.equal(
        { advice: "market-sell", price, amount })
        done();
    })

    tieredTakeProfit.onTrade(trade);
  })

  it(`Should check & validate tiered take profit trigger
    when price is 2/3rd of target price for sell limit order`, done => {
    trigger = {
      ...data.default.trigger,
      params: '{ "action": "sell", "type": "limit" }' };

    const price = 0.67 * trigger.targetPrice;
    const amount = Math.floor(0.33 * trigger.amount);

    trade = {
      ...data.default.trigger,
      price
    }

    const tieredTakeProfit = new TieredTakeProfitTrigger(trigger);

    tieredTakeProfit.on("advice", data => {
      expect(data).to.deep.equal(
        { advice: "limit-sell", price, amount })
        done();
    })

    tieredTakeProfit.onTrade(trade);
  })

  it(`Should check & validate tiered take profit trigger
    when price is greater than target price for sell market order`, done => {
    trigger = {
      ...data.default.trigger,
      params: '{ "action": "sell", "type": "market" }' };

    const price = trigger.targetPrice;
    const amount = trigger.amount - 2 * Math.floor(0.33 * trigger.amount);

    trade = {
      ...data.default.trigger,
      price
    }

    const tieredTakeProfit = new TieredTakeProfitTrigger(trigger);

    tieredTakeProfit.on("advice", data => {
      expect(data).to.deep.equal(
        { advice: "market-sell", price, amount })
        done();
    })

    tieredTakeProfit.onTrade(trade);
  })

  it(`Should check & validate tiered take profit trigger
    when price is greater than target price for sell limit order`, done => {
    trigger = {
      ...data.default.trigger,
      params: '{ "action": "sell", "type": "limit" }' };

    const price = trigger.targetPrice;
    const amount = trigger.amount - 2 * Math.floor(0.33 * trigger.amount);

    trade = {
      ...data.default.trigger,
      price
    }

    const tieredTakeProfit = new TieredTakeProfitTrigger(trigger);

    tieredTakeProfit.on("advice", data => {
      expect(data).to.deep.equal(
        { advice: "limit-sell", price, amount })
        done();
    })

    tieredTakeProfit.onTrade(trade);
  })
})
