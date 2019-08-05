import * as data from "../data";
import { expect } from "chai";
import StopLossTakeProfitTrigger from "../../src/triggers/StopLossTakeProfitTrigger";

export default describe("Stop Loss Take Profit Trigger tests", async function() {
  let trade, trigger;

  it("check & validate for stop loss market buy advice", done => {
    // get dummy data to check trigger for
    trade = { ...data.default.trade };
    trigger = {
      ...data.default.trigger,
      params: `{
        "action": "buy",
        "type": "market",
        "stopLossPrice": 0.5,
        "takeProfitPrice": 0.1
      }`
    };

    // Get instance of trigger for dummy data
    const stopLoss = new StopLossTakeProfitTrigger(trigger);

    // check if advice event is emitted and check its value
    stopLoss.on("advice", data => {
      expect(data).to.deep.equal(
        { advice: 'market-buy', price: 1, amount: 5 })
      done();
    });

    // Call an trade event
    stopLoss.onTrade(trade);
  })

  it("check & validate for stop loss market sell advice", done => {
    trade = {
      ...data.default.trade
    };
    trigger = {
      ...data.default.trigger,
      params: `{
        "action": "sell",
        "type": "market",
        "stopLossPrice": 2,
        "takeProfitPrice": 0.1
      }`
    };

    const stopLoss = new StopLossTakeProfitTrigger(trigger);

    stopLoss.on("advice", data => {
      expect(data).to.deep.equal(
        { advice: 'market-sell', price: 1, amount: 5 })
      done();
    })

    stopLoss.onTrade(trade);
  })

  it("check for stop loss close", done => {
    trade = { ...data.default.trade }
    trigger = {
      ...data.default.trigger,
      params: `{
        "action": "buy",
        "type": "market",
        "stopLossPrice": 0.5,
        "takeProfitPrice": 0.1
      }`
    }

    const stopLoss = new StopLossTakeProfitTrigger(trigger)

    stopLoss.on("close", () => {
      done()
    })

    stopLoss.onTrade(trade);
  })

  it("check & validate for take profit limit buy advice", done => {
    trade = { ...data.default.trade };
    trigger = {
      ...data.default.trigger,
      params: `{
        "action": "buy",
        "type": "limit",
        "stopLossPrice": 0.5,
        "takeProfitPrice": 2
      }`
    };

    const takeProfit = new StopLossTakeProfitTrigger(trigger);

    takeProfit.on("advice", data => {
      expect(data).to.deep.equal(
        { advice: 'limit-buy', price: 1, amount: 5 })
      done();
    });

    takeProfit.onTrade(trade);
  })

  it("check & validate for take profit limit sell advice", done => {
    trade = { ...data.default.trade };
    trigger = {
      ...data.default.trigger,
      params: `{
        "action": "sell",
        "type": "limit",
        "stopLossPrice": 0.3,
        "takeProfitPrice": 0.5
      }`
    };

    const takeProfit = new StopLossTakeProfitTrigger(trigger);

    takeProfit.on("advice", data => {
      expect(data).to.deep.equal(
        { advice: 'limit-sell', price: 1, amount: 5 })
      done();
    });

    takeProfit.onTrade(trade);
  })
})
