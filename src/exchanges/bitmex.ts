import * as WebSocket from "ws"
const w = new WebSocket("wss://www.bitmex.com/realtime")
//var StringDecoder = require('string_decoder').StringDecoder;

var influxDataToPush = []

w.on('open', () => {
    console.log('ws opened')
    w.send('{"op": "subscribe", "args": "orderBook10:ETHUSD"}')
   //w.send('{"op": "subscribe", "args": "trade"}') //for all symbols
})


  w.on('message', (msg:any) => {
    var parsedMessage = JSON.parse(msg)
    //console.log(parsedMessage);
    try {
      var data = parsedMessage.data

      if(data){
        data.forEach(function(obj){
          var bids = obj.bids
          var asks = obj.asks
          var ts = obj.timestamp
          var symbol = obj.symbol // this will be needed for all symbols
          var timestamp = Date.parse(obj.timestamp)

          console.log(symbol, bids, asks, timestamp)
        })
      }
    } catch (e) {

    }
  })
