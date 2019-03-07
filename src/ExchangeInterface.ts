import * as ccxt from 'ccxt'
import * as logger from 'logger'

import * as Controller from './controllers/handlers'

const debug = logger('app:exchange')


export default abstract class ExchangeInterface {
  private exchange: ccxt.Exchange


  constructor (exchange: ccxt.Exchange) {
    this.exchange = exchange
  }


  /**
   * This abstract function should be implemented by all the exchanges we are integrating with.
   * Here basically a loop or a websocket connection must be started which continously calls
   * this.onPriceUpdate(....) with the latest price for the any of the given symbols.
   */
  protected abstract startListening (): void


  protected async onPriceUpdate (symbol: string, last: number) {
    debug('processing triggers for', symbol, 'at', last)

    const triggers = await Controller.getSpecificTriggers('123')
    triggers.forEach(function(obj){
      let exchangeId = obj.exchangeId
      const exchange: ccxt.Exchange = new ccxt[exchangeId]
      let symbol :string = obj.symbol
      let strategy = obj.strategy
      let params = obj.params
      let stopLossPrice:number = params.stopLossPrice
      let takeProfitPrice:number = params.takeProfitPrice
      //let exchange:any = ccxt.Exchange
      //console.log( stopLossPrice)
          //strategy == 'stop-loss'
      if (  strategy == 'stop-loss' && stopLossPrice < last ) {
        try {
            console.log('less')
            Controller.deleteTriggers('123')
        } catch (error) {
          console.log(error)
        }
      }

      if ( strategy == 'take-profit' && last >= takeProfitPrice ) {
        //if( last >= takeProfitPrice){
          //console.log('last', last, 'stopLossPrice', stopLossPrice )
          exchange.createMarketSellOrder()
        //}
      }
    })
    //console.log('trigger',triggers)
    // loop through all the avaialbe triggers for this exchange and symbol
    // check if the trigger conditions are met
  }


  public start () {
    //Controller.readDetails()
    // 1. load triggers from the DB
    // 2. start listening for price changes
    this.startListening()
    //this.onPriceUpdate()
  }
}
