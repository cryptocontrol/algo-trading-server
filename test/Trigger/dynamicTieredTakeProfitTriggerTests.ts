import * as data from "../data";
import { expect } from "chai";
import DynamicTieredTakeProfitTrigger from "../../src/triggers/DynamicTieredTakeProfitTrigger";

export default describe("Dynamic Tiered Take Profit Trigger Tests", async function() {
  let trigger, trade;

  it(`Should check & validate dynamic tiered take profit trigger
    when price is 1/nth of target price for sell market order`, done => {
    trigger = {
      ...data.default.trigger,
      params: '{ "action": "sell", "type": "market", "steps": 5 }' };

    const price = 0.4 * trigger.targetPrice;
    const amount = 0.2 * trigger.targetVolume;

    trade = {
      ...data.default.trade,
      price
    }

    const tieredTakeProfit = new DynamicTieredTakeProfitTrigger(trigger);

    tieredTakeProfit.on("advice", data => {
      expect(data).to.deep.equal(
        { advice: "market-sell", price, amount })
        done();
    })

    tieredTakeProfit.onTrade(trade);
  })

  // it(`Should check & validate dynamic tiered take profit trigger
  //   when price is greater than target price for sell market order`, done => {
  //   trigger = {
  //     ...data.default.trigger,
  //     params: '{ "action": "sell", "type": "market", "steps": 5 }' };

  //   const price = trigger.targetPrice;
  //   const amount = trigger.targetVolume - (0.66 * trigger.targetVolume);

  //   trade = {
  //     ...data.default.trigger,
  //     price
  //   }

  //   const tieredTakeProfit = new DynamicTieredTakeProfitTrigger(trigger);

  //   tieredTakeProfit.on("advice", data => {
  //     expect(data).to.deep.equal(
  //       { advice: "market-sell", price, amount })
  //       done();
  //   })

  //   tieredTakeProfit.onTrade(trade);
  // })

  it(`Should check & validate dynamic tiered take profit trigger
    when price is greater than target price for sell limit order`, done => {
    trigger = {
      ...data.default.trigger,
      params: '{ "action": "sell", "type": "limit", "steps": 5 }'};

    const price = trigger.targetPrice;
    const steps = JSON.parse(trigger.params).steps;
    const amount = trigger.amount / steps

    const remainingAmount = trigger.amount - (amount * (steps - 1))

    trade = {
      ...data.default.trigger,
      price };

    const tieredTakeProfit = new DynamicTieredTakeProfitTrigger(trigger);

    tieredTakeProfit.on("advice", data => {
      expect(data).to.deep.equal(
        { advice: "limit-sell", price, amount: remainingAmount })
        done();
    })

    tieredTakeProfit.onTrade(trade);
  })

  it(`Should check & validate dynamic tiered take profit trigger
    when price is greater than target price for sell market order`, done => {
    trigger = {
      ...data.default.trigger,
      params: '{ "action": "sell", "type": "market", "steps": 5 }'};

    const price = trigger.targetPrice;
    const steps = JSON.parse(trigger.params).steps;
    const amount = trigger.amount / steps

    const remainingAmount = trigger.amount - (amount * (steps - 1))

    trade = {
      ...data.default.trigger,
      price };

    const tieredTakeProfit = new DynamicTieredTakeProfitTrigger(trigger);

    tieredTakeProfit.on("advice", data => {
      expect(data).to.deep.equal(
        { advice: "market-sell", price, amount: remainingAmount })
        done();
    })

    tieredTakeProfit.onTrade(trade);
  })
})
