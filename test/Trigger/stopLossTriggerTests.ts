import * as data from "../data";
import { expect } from "chai";
import StopLossTrigger from "../../src/triggers/StopLossTrigger";
// import * as database from "../src/database";
// import Triggers from ""../src/database/models/triggers";
// import Trades from "../src/database/models/trades";


export default describe("Stop Loss Trigger tests", async function() {
  let trade, trigger;

    // before(async function() {
    //   database.init()
    //   const triggers = await Triggers.findAll({ where:
    //     { isActive: false }, raw: true})
    //   const trades = await Trades.findAll({ where: {
    //     exchange: "binance",
    //     CreatedAt: "2019-03-21 09:07:48"
    //   }, raw: true })

    //   trigger = triggers[0] || {}
    //   trade = trades[0] || {}

    //   // console.log(triggers[0])
    // })

    it("check & validate for stop loss market buy advice", done => {
      // get dummy data to check trigger for
      trade = { ...data.default.trade };
      trigger = { ...data.default.trigger };

      // Get instance of trigger for dummy data
      const stopLoss = new StopLossTrigger(trigger);

      // check if advice event is emitted and check its value
      stopLoss.on("advice", data => {
        expect(data).to.deep.equal(
          { advice: 'market-buy', price: 1, amount: 0.24 })
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
        params: '{ "action": "sell", "type": "market" }'
      };

      const stopLoss = new StopLossTrigger(trigger);

      stopLoss.on("advice", data => {
        expect(data).to.deep.equal(
          { advice: 'market-sell', price: 1, amount: 0.24 })
        done();
      })

      stopLoss.onTrade(trade);
    })

    it("check & validate stop loss limit sell advice", done => {
      trade = {
        ...data.default.trade
      };
      trigger = {
        ...data.default.trigger,
        params: '{ "action": "sell", "type": "limit" }'
      };

      const stopLoss = new StopLossTrigger(trigger);

      stopLoss.on("advice", data => {
        expect(data).to.deep.equal(
          { advice: 'limit-sell', price: 1, amount: 0.24 })
        done();
      });

      stopLoss.onTrade(trade);
    })

    it("check & validate for stop loss limit buy advice", done => {
      trade = {
        ...data.default.trade
      };
      trigger = {
        ...data.default.trigger,
        params: '{ "action": "buy", "type": "limit" }'
      };

      const stopLoss = new StopLossTrigger(trigger);

      stopLoss.on("advice", data => {
        expect(data).to.deep.equal(
          { advice: 'limit-buy', price: 1, amount: 0.24 })
        done();
      });


      stopLoss.onTrade(trade);
    })

    it("check for stop loss close", done => {
      trade = { ...data.default.trade }
      trigger = { ...data.default.trigger }

      const stopLoss = new StopLossTrigger(trigger)

      stopLoss.on("close", () => {
        done()
      })

      stopLoss.onTrade(trade);
    })
})
