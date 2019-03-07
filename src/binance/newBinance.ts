import Binance from 'binance-api-node'
import * as ccxt from 'ccxt'

const jsonData = require('./details')

const exchange:any = Object.keys(jsonData)
const exchangeDetails = jsonData[exchange]
const apiKey:string = exchangeDetails.apiKey
const secret:string = exchangeDetails.secret

console.log(apiKey,secret)

const client = Binance({
  apiKey: apiKey,
  apiSecret: secret
})

const binanceCcxt = new ccxt.binance({
  apiKey: apiKey,
  secret:  secret
})

async function run(){
  const symbolsArray = []
  const data = await client.exchangeInfo()
  const symbols = data.symbols

  symbols.forEach(function(obj){
    symbolsArray.push(obj.symbol)
  })

  client.ws.trades(['BTCUSDT'], trade => {
    const currentPrice = trade.price
    let stopLossPrice = '3815.57'
    let makeProfitPrice = '3900.57'
    let desirablePrice = '3820.57'
    let desirableAmount = '1'
    const symbol = trade.symbol
    //let ccxtSymbol = symbol.split() // BTCUSDT // BTC/USDT

    console.log(symbol)
    if( currentPrice <= stopLossPrice){
      binanceCcxt.createMarketSellOrder()
    }

    if( currentPrice >= makeProfitPrice){
      binanceCcxt.createMarketSellOrder()
    }
  })

  //console.log(symbolsArray)
}

run()
