import Binance from 'binance-api-node'
import * as ccxt from 'ccxt'

const client = Binance({
  apiKey: '',
  apiSecret: ''
})

// pls avoid committing sensitive keys on the git repo
const binanceCcxt = new ccxt.binance({
  apiKey: '',
  secret: ''
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
