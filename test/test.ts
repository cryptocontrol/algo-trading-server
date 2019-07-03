import { expect } from "chai";
import Triggers from '../src/database/models/triggers'
import Trades from "../src/database/models/trades"
import * as data from "./data";
import * as database from "../src/database"
import StopLossTrigger from "../src/triggers/StopLossTrigger"




describe("Stop Loss tests", async function() {
  let trade, trigger

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

    it("check for stop loss market buy advice", done => {
      trade = { ...data.default.trade }
      trigger = { ...data.default.trigger }

      const stopLoss = new StopLossTrigger(trigger)

      stopLoss.on("advice", () => {

        done()
      })


      stopLoss.onTrade(trade)
    })

    it("check for stop loss market sell advice", done => {
      trade = {
        ...data.default.trade
      }
      trigger = {
        ...data.default.trigger,
        params: '{ "action": "buy", "type": "market" }'
      }

      const stopLoss = new StopLossTrigger(trigger)

      stopLoss.on("advice", () => {
        done()
      })


      stopLoss.onTrade(trade)
    })

    it("check for stop loss limit sell advice", done => {
      trade = {
        ...data.default.trade
      }
      trigger = {
        ...data.default.trigger,
        params: '{ "action": "sell", "type": "limit" }'
      }

      const stopLoss = new StopLossTrigger(trigger)

      stopLoss.on("advice", () => {
        done()
      })


      stopLoss.onTrade(trade)
    })

    it("check for stop loss limit buy advice", done => {
      trade = {
        ...data.default.trade
      }
      trigger = {
        ...data.default.trigger,
        params: '{ "action": "buy", "type": "limit" }'
      }

      const stopLoss = new StopLossTrigger(trigger)

      stopLoss.on("advice", () => {
        done()
      })


      stopLoss.onTrade(trade)
    })

    it("check for stop loss close", done => {
      trade = { ...data.default.trade }
      trigger = { ...data.default.trigger }

      const stopLoss = new StopLossTrigger(trigger)

      stopLoss.on("close", () => {
        done()
      })


      stopLoss.onTrade(trade)
    })
  }
)

