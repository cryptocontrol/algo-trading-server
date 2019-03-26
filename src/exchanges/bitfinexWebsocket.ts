//const BFX = require('bitfinex-api-node')
import * as Bitfinex from "bitfinex-api-node"
import { WebSocket } from "bitfinex-api-node"
const bfx = new Bitfinex({
  ws: {
    autoReconnect: false,
    manageCandles: true
  }
})
const ws = bfx.ws(2, { transform: true })


const openWebsocket = (pair:string) => {
  ws.open()
  ws.on('open', () => {
    console.log('ws opened')
    ws.subscribeTrades(`t${pair}`)
    ws.subscribeOrderBook('tBTCUSD')
  })
}


const main = () => {
  openWebsocket('BTCUSD')
  // ws.onTrades({ symbol: 'tBTCUSD' }, (trades) => {
  //   console.log('onTrades', trades)
  // })
  ws.onOrderBook({ symbol: 'tBTCUSD' }, (orders) => {
    const bids = orders.bids
    const asks = orders.asks
    //console.log({ bids: bids, asks: asks })
    console.log(orders)

    // for changes; emit 'orderbook:change'
  })
}

main()
