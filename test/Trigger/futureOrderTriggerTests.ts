import * as data from "../data";
import { expect } from "chai";
import FutureOrderTrigger from '../../src/triggers/FutureOrderTrigger';

export default describe("Future Order Trigger Tests", async function() {
  let trigger, trade

  it(`check & validate for future order with greater than date condtion market
    buy advice`, done => {
    // get dummy data to check trigger for
    trade = { ...data.default.trade };
    trigger = {
      ...data.default.trigger,
      params: `{
        "action": "buy",
        "type": "market",
        "condition": [{
          "Date": 1566466231883,
          "type": "greater-than"
        }]
      }`
    };

    // Get instance of trigger for dummy data
    const futureOrder = new FutureOrderTrigger(trigger);

    // check if advice event is emitted and check its value
    futureOrder.on("advice", data => {
      expect(data).to.deep.equal(
        { advice: 'market-buy', price: 1, amount: 5 })
      done();
    });

    // Call an trade event
    futureOrder.onTrade(trade);
  })

  it(`check & validate for future order with greater than date condtion market
    buy advice`, done => {
    // get dummy data to check trigger for
    trade = { ...data.default.trade };
    trigger = {
      ...data.default.trigger,
      params: `{
        "action": "buy",
        "type": "limit",
        "condition": [{
          "Date": 1666476451883,
          "type": "less-than"
        }]
      }`
    };

    // Get instance of trigger for dummy data
    const futureOrder = new FutureOrderTrigger(trigger);

    // check if advice event is emitted and check its value
    futureOrder.on("advice", data => {
      expect(data).to.deep.equal(
        { advice: 'limit-buy', price: 1, amount: 5 })
      done();
    });

    // Call an trade event
    futureOrder.onTrade(trade);
  })

  it(`check & validate for future order with greater than price condtion market
    buy advice`, done => {
    // get dummy data to check trigger for
    trade = { ...data.default.trade };
    trigger = {
      ...data.default.trigger,
      params: `{
        "action": "buy",
        "type": "market",
        "condition": [{
          "Price": 0.1,
          "type": "greater-than"
        }]
      }`
    };

    // Get instance of trigger for dummy data
    const futureOrder = new FutureOrderTrigger(trigger);

    // check if advice event is emitted and check its value
    futureOrder.on("advice", data => {
      expect(data).to.deep.equal(
        { advice: 'market-buy', price: 1, amount: 5 })
      done();
    });

    // Call an trade event
    futureOrder.onTrade(trade);
  })

  it(`check & validate for future order with greater than price condtion market
    buy advice`, done => {
    // get dummy data to check trigger for
    trade = { ...data.default.trade };
    trigger = {
      ...data.default.trigger,
      params: `{
        "action": "buy",
        "type": "limit",
        "condition": [{
          "Price": 1.5,
          "type": "less-than"
        }]
      }`
    };

    // Get instance of trigger for dummy data
    const futureOrder = new FutureOrderTrigger(trigger);

    // check if advice event is emitted and check its value
    futureOrder.on("advice", data => {
      expect(data).to.deep.equal(
        { advice: 'limit-buy', price: 1, amount: 5 })
      done();
    });

    // Call an trade event
    futureOrder.onTrade(trade);
  })

  it(`check & validate for future order with greater than price condtion market
    buy advice`, done => {
    // get dummy data to check trigger for
    trade = { ...data.default.trade };
    trigger = {
      ...data.default.trigger,
      params: `{
        "action": "buy",
        "type": "market",
        "condition": [{
          "Volume": 4,
          "type": "greater-than"
        }]
      }`
    };

    // Get instance of trigger for dummy data
    const futureOrder = new FutureOrderTrigger(trigger);

    // check if advice event is emitted and check its value
    futureOrder.on("advice", data => {
      expect(data).to.deep.equal(
        { advice: 'market-buy', price: 1, amount: 5 })
      done();
    });

    // Call an trade event
    futureOrder.onTrade(trade);
  })

  it(`check & validate for future order with greater than price condtion market
    buy advice`, done => {
    // get dummy data to check trigger for
    trade = { ...data.default.trade };
    trigger = {
      ...data.default.trigger,
      params: `{
        "action": "buy",
        "type": "limit",
        "condition": [{
          "Volume": 6,
          "type": "less-than"
        }]
      }`
    };

    // Get instance of trigger for dummy data
    const futureOrder = new FutureOrderTrigger(trigger);

    // check if advice event is emitted and check its value
    futureOrder.on("advice", data => {
      expect(data).to.deep.equal(
        { advice: 'limit-buy', price: 1, amount: 5 })
      done();
    });

    // Call an trade event
    futureOrder.onTrade(trade);
  })

  it("Check for close on ")
})
