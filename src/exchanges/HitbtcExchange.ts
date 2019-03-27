import * as ccxt from 'ccxt'
import * as WebSocket from "ws"

import BaseExchange from './core/BaseExchange'

interface IOrder {
  asset: string
  price: number
  amount: number
}


interface IOrderBook {
  bids: IOrder[]
  asks: IOrder[]
}


export default class HitbtcExchange extends BaseExchange {
  private readonly clientws: WebSocket
  private readonly streamingTradesSymbol: string[]

  constructor () {
    const hitbtc = new ccxt.hitbtc({ enableRateLimit: true })
    super(hitbtc)

    const client = new WebSocket('wss://api.hitbtc.com/api/2/ws')
    this.clientws = client
    this.streamingTradesSymbol = []
  }


  public canStreamTrades (_symbol: string): boolean {
    return true
  }


  public streamTrades(symbol: string): void {

    // check if we are already streaming this symbol or not
    // if (this.streamingTradesSymbol.indexOf(symbol) >= 0) return
    // this.streamingTradesSymbol.push(symbol)
    //
    const wsSymbol = symbol.replace('/', '').toUpperCase()

    this.clientws.on('open', () => {
      console.log('ws opened')
      this.clientws.send(`{ "method":"subscribeTrades","params": { "symbol": "${wsSymbol}" }, "id":123 }`)
    })

    this.clientws.on('message', (trade:any) => {
      const parsedJSON = JSON.parse(trade)
      const params = parsedJSON.params
      try {
        const data = params.data
        data.forEach(function(obj){
          const price = obj.price
          const quantity = obj.quantity
          const timestamp = Date.parse(obj.timestamp)
          //console.log(price, quantity, timestamp)

          const ccxtTrade: ccxt.Trade = {
            amount: Number(quantity),
            datetime: (new Date(timestamp)).toISOString(),
            id: String(obj.id),
            price: Number(price),
            info: {},
            timestamp: timestamp,
            side: obj.side,
            symbol: undefined,
            takerOrMaker: trade.maker ? 'maker' : 'taker',
            cost: Number(price) * Number(quantity),
            fee: undefined
          }
          console.log(ccxtTrade)
          this.emit('trade', ccxtTrade)
        })
      } catch (e){

      }
    })
  }


  public streamOrderbook (symbol: string) {
    const wsSymbol = symbol.replace('/', '').toUpperCase()

    this.clientws.on('open', () => {
      console.log('ws opened')
      this.clientws.send(`{"method": "subscribeOrderbook","params": {  "symbol": "${wsSymbol}"},  "id": 123}`)
    })

    this.clientws.on('message', (orders:any) => {
      const parsedJSON = JSON.parse(orders)
      const params = parsedJSON.params
      try{
        const bids: IOrder[] = params.bid.map(bid => {
          return {
            asset: wsSymbol,
            price: bid.price,
            amount: bid.size
          }
        })

        const asks: IOrder[] = params.ask.map(ask => {
          return {
            asset: wsSymbol,
            price: ask.price,
            amount: ask.size
          }
        })

        const orderBook:IOrderBook = {
          bids: bids,
          asks: asks
        }
        this.emit('orderbook', orderBook)
        console.log(orderBook)
      } catch(e) {

      }
    })
   }


  public async getTrades (symbol: string, since: number, _descending: boolean): Promise<ccxt.Trade[]> {
    return await this.exchange.fetchTrades(symbol, since)
  }
}


const main = async () => {
  const hitbtc = new HitbtcExchange()
  //hitbtc.streamTrades('ETHBTC')
  hitbtc.streamOrderbook('ETHBTC')
}

main()
