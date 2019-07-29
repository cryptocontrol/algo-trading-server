import * as data from "../data";
import { expect } from "chai";
import TakeProfitTrigger from "../../src/triggers/TakeProfitTrigger";

export default describe("Take Profit Trigger tests", async function() {
  let trigger, trade

  it("check & validate for take profit limit buy advice", done => {
    trade = {
      ...data.default.trade,
      price: 1
    };
    trigger = {
      ...data.default.trigger,
      targetPrice: 2,
      params: '{ "action": "buy", "type": "limit" }' };

    const takeProfit = new TakeProfitTrigger(trigger);

    takeProfit.on("advice", data => {
      expect(data).to.deep.equal(
        { advice: 'limit-buy', price: 1, amount: 5 })
      done();
    });

    takeProfit.onTrade(trade);
  })

  it("check & validate for take profit market buy advice", done => {
    trade = {
      ...data.default.trade,
      price: 1
    };
    trigger = {
      ...data.default.trigger,
      targetPrice: 2
    };

    const takeProfit = new TakeProfitTrigger(trigger);

    takeProfit.on("advice", data => {
      expect(data).to.deep.equal(
        { advice: 'market-buy', price: 1, amount: 5 })
      done();
    });

    takeProfit.onTrade(trade);
  })

  it("check & validate for take profit limit sell advice", done => {
    trade = { ...data.default.trade };
    trigger = {
      ...data.default.trigger,
      params: '{ "action": "sell", "type": "limit" }' };

    const takeProfit = new TakeProfitTrigger(trigger);

    takeProfit.on("advice", data => {
      expect(data).to.deep.equal(
        { advice: 'limit-sell', price: 1, amount: 5 })
      done();
    });

    takeProfit.onTrade(trade);
  })

  it("check & validate for take profit markte sell advice", done => {
    trade = { ...data.default.trade };
    trigger = {
      ...data.default.trigger,
      params: '{ "action": "sell", "type": "market" }' };

    const takeProfit = new TakeProfitTrigger(trigger);

    takeProfit.on("advice", data => {
      expect(data).to.deep.equal(
        { advice: 'market-sell', price: 1, amount: 5 })
      done();
    });

    takeProfit.onTrade(trade);
  })

  it("check for take profit close", done => {
    trade = {
      ...data.default.trade,
      price: 1
    }
    trigger = {
      ...data.default.trigger,
      targetPrice: 2
    }

    const takeProfit = new TakeProfitTrigger(trigger);

    takeProfit.on("close", () => {
      done()
    })

    takeProfit.onTrade(trade);
  })
})
