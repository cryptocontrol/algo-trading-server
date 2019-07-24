import * as data from "../data";
import { expect } from "chai";
import TieredTakeProfitTrigger from "../../src/triggers/TieredTakeProfitTrigger";

export default describe("Tiered Take Profit Tests", async function() {
  let trigger ,trade;

  it(`Should check & validate tiered take profit trigger
    when price is 1/3rd of target price for sell market order`, done => {
    trigger = {
      ...data.default.trigger,
      params: JSON.stringify({
        action: "sell",
        type: "market",
        steps: 3,
        executedSteps: {
          1: false,
          2: false,
          3: false }
        }) };

    const { targetPrice, createdAtPrice } = trigger;
    const priceDelta = targetPrice - createdAtPrice;

    const price = createdAtPrice + (0.34 * priceDelta);
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
      params: JSON.stringify({
        action: "sell",
        type: "limit",
        steps: 3,
        executedSteps: {
          1: false,
          2: false,
          3: false }
        }) };

    const { targetPrice, createdAtPrice } = trigger;
    const priceDelta = targetPrice - createdAtPrice;

    const price = createdAtPrice + (0.34 * priceDelta);
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
      params: JSON.stringify({
        action: "sell",
        type: "market",
        steps: 3,
        executedSteps: {
          1: true,
          2: false,
          3: false }
        }) };

    const { targetPrice, createdAtPrice } = trigger;
    const priceDelta = targetPrice - createdAtPrice;

    const price = createdAtPrice + (0.68 * priceDelta);
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
      params: JSON.stringify({
        action: "sell",
        type: "limit",
        steps: 3,
        executedSteps: {
          1: true,
          2: false,
          3: false }
        }) };

    const { targetPrice, createdAtPrice } = trigger;
    const priceDelta = targetPrice - createdAtPrice;

    const price = createdAtPrice + (0.68 * priceDelta);
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
      params: JSON.stringify({
        action: "sell",
        type: "market",
        steps: 3,
        executedSteps: {
          1: true,
          2: true,
          3: false }
        }) };

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
      params: JSON.stringify({
        action: "sell",
        type: "limit",
        steps: 3,
        executedSteps: {
          1: true,
          2: true,
          3: false }
        }) };

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
