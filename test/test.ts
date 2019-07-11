import { expect } from "chai";
import * as data from "./data";
// import * as database from "../src/database";
// import Triggers from ""../src/database/models/triggers";
// import Trades from "../src/database/models/trades";
import StopLossTrigger from "../src/triggers/StopLossTrigger";
import TakeProfitTrigger from "../src/triggers/TakeProfitTrigger";
import TrailingStopTrigger from "../src/triggers/TrailingStopTrigger";
import CancelOrderTrigger from "../src/triggers/CancelOrderTrigger";




describe("Stop Loss Trigger tests", async function() {
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


describe("Take Profit Trigger tests", async function() {
  let trigger, trade

  it("check & validate for take profit limit buy advice", done => {
    trade = { ...data.default.trade };
    trigger = {
      ...data.default.trigger,
      params: '{ "action": "buy", "type": "limit" }' };

    const takeProfit = new TakeProfitTrigger(trigger);

    takeProfit.on("advice", data => {
      expect(data).to.deep.equal(
        { advice: 'limit-buy', price: 1, amount: 0.24 })
      done();
    });

    takeProfit.onTrade(trade);
  })

  it("check & validate for take profit market buy advice", done => {
    trade = { ...data.default.trade };
    trigger = { ...data.default.trigger };

    const takeProfit = new TakeProfitTrigger(trigger);

    takeProfit.on("advice", data => {
      expect(data).to.deep.equal(
        { advice: 'market-buy', price: 1, amount: 0.24 })
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
        { advice: 'limit-sell', price: 1, amount: 0.24 })
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
        { advice: 'market-sell', price: 1, amount: 0.24 })
      done();
    });

    takeProfit.onTrade(trade);
  })

  it("check for take profit close", done => {
    trade = { ...data.default.trade }
    trigger = { ...data.default.trigger }

    const takeProfit = new TakeProfitTrigger(trigger);

    takeProfit.on("close", () => {
      done()
    })

    takeProfit.onTrade(trade);
  })
})

// TODO: trailing trigger is not yet implemented

// describe("Trailing Stop Trigger Tests", async function() {
//   let trigger, trade;

//   it("check & validate for trailing stop trigger", done => {
//     trigger = {
//       ...data.default.trigger,
//       params: '{ "intialPrice": "0.9", "trail": "0.1" }' };
//     trade = {
//       ...data.default.trade,
//       price: 0.01 };

//     const trailingStopTrigger = new TrailingStopTrigger(trigger);

//     trailingStopTrigger.on("close", data => {
//       done();
//     });

//     trailingStopTrigger.onTrade(trade);
//   })

//   it("check & validate for trailing stop trigger ", done => {
//     trigger = {
//       ...data.default.trigger,
//       params: '{ "intialPrice": "0.9", "trail": "0.1" }' };
//     trade = {
//       ...data.default.trade,
//       price: 0.01 };

//     const trailingStopTrigger = new TrailingStopTrigger(trigger);

//     trailingStopTrigger.on("close", data => {
//       expect(data).to.deep.equal(
//         { advice: 'market-sell', price: 1, amount: 0.24 })
//       done();
//     });

//     trailingStopTrigger.onTrade(trade);
//   })
// })


// TODO: Write unit tests for cancel order trigger
describe("Cancel Order Trigger Tests", async function() {
  let trigger, trade;

  it("check & validate for cancel profit trigger for less-than-equal", done => {
    trigger = {
      ...data.default.trigger,
      params: '{ "action": "cancel", "condition": "less-than-equal" }' };
    trade = {
      ...data.default.trade,
      price: 0.09 };

    const cancelOrder = new CancelOrderTrigger(trigger);

    cancelOrder.on("advice", data => {
      expect(data).to.deep.equal(
        { advice: "cancel-order", price: 0.09, amount: 0.24 })
      done();
    })

    cancelOrder.onTrade(trade);
  })

  it("check & validate for cancel profit trigger for less-than", done => {
    trigger = {
      ...data.default.trigger,
      params: '{ "action": "cancel", "condition": "less-than" }' };
    trade = {
      ...data.default.trade,
      price: 0.09 };

    const cancelOrder = new CancelOrderTrigger(trigger);

    cancelOrder.on("advice", data => {
      console.log("in advice")
      expect(data).to.deep.equal(
        { advice: "cancel-order", price: 0.09, amount: 0.24 })
      done();
    })

    cancelOrder.onTrade(trade);
  })

  it("check & validate for cancel profit trigger for greater-than-equal", done => {
    trigger = {
      ...data.default.trigger,
      params: '{ "action": "cancel", "condition": "greater-than-equal" }' };
    trade = {
      ...data.default.trade,
      price: 0.11 };

    const cancelOrder = new CancelOrderTrigger(trigger);

    cancelOrder.on("advice", data => {
      expect(data).to.deep.equal(
        { advice: "cancel-order", price: 0.11, amount: 0.24 })
      done();
    })

    cancelOrder.onTrade(trade);
  })

  it("check & validate for cancel profit trigger for greater-than", done => {
    trigger = {
      ...data.default.trigger,
      params: '{ "action": "cancel", "condition": "greater-than" }' };
    trade = {
      ...data.default.trade,
      price: 0.11 };

    const cancelOrder = new CancelOrderTrigger(trigger);

    cancelOrder.on("advice", data => {
      expect(data).to.deep.equal(
        { advice: "cancel-order", price: 0.11, amount: 0.24 })
      done();
    })

    cancelOrder.onTrade(trade);
  })
})

describe("Tiered Take Profit Tests", async function() {
  let trigger ,trade;

  it(`Should check & validate tiered take profit trigger
   when price is 1/3rd of target price for sell market order`, async function() {
     trigger = {
       ...data.default.trigger,
       params: '{ "action": "sell", "type": "market" }'
     };

     const price = 0.34 * trigger.targetPrice;
     const amount = 0.33 * trigger.targetVolume;

     trade = {
       ...data.default.trigger,
       price
     }

     const tieredTakeProfit = new TieredTakeProfit(trade);

     tieredTakeProfit.on("advice", data => {
       expect(data).to.deep.equal(
         { advice: "market-sell", price, amount })
     })
   })
})
