import * as data from "../data";
import { expect } from "chai";


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
