import { expect } from "chai";
import Triggers from '../src/database/models/triggers'
import Trades from "../src/database/models/trades"
import * as data from "./data";
import * as database from "../src/database"
import StopLossTrigger from "../src/triggers/StopLossTrigger"




describe("tests", async function() {
  let trade, trigger

    before(async function() {
      database.init()
      const triggers = await Triggers.findAll({ where:
        { isActive: false }, raw: true})
      const trades = await Trades.findAll({ where: {
        exchange: "binance",
        CreatedAt: "2019-03-21 09:07:48"
      }, raw: true })

      trigger = triggers[0] || {}
      trade = trades[0] || {}

      // console.log(triggers[0])
    })

    context("pass", async function () {
      it("should pass", async function () {
        let triggers: any = await Triggers.findAll({ where:
          { isActive: false }, raw: true})

        let trades = await Trades.findAll({ where: {
            exchange: "binance",
            CreatedAt: "2019-03-21 09:07:48"
          }, raw: true })

        // const trigger = triggers[0]

        // console.log(trades)


        // const trigger = data.default.trigger
        // const trade = trades[0];
        const trade = data.default.trade

        triggers = triggers.map(t => {
          return {
            ...t,
            params: `{"action": "sell", "type":"market"}`
          }
        })

        const trigger = triggers[0];

        console.log(trigger)

        const stopLoss = new StopLossTrigger(trigger)

        stopLoss.onTrade(trade)

        expect(5).to.equal(5)
      })
    })


    it("check for event emitted", done => {
      trigger.on('close-position', () => {
        done()
      })
    })


    after(function() {

    })
  }
)

