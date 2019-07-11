import * as data from "../data";
import { expect } from "chai";
import CancelOrderTrigger from "../../src/triggers/CancelOrderTrigger";

export default describe("Cancel Order Trigger Tests", async function() {
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
