import BaseStrategy from "./BaseStrategy"


export default class StopLossStrategy extends BaseStrategy {
  private constructor (id: string, trigger: any) {
    // do nothing... for now
    super('stop-loss')
  }


  static create (id: string, trigger: any) {
    return new StopLossStrategy(id, trigger)
  }


  process (lastprice: number) {
    // process the trigger

    // triggers.forEach(trigger => {
    //   let strategy = trigger.strategy
    //   let params = trigger.params
    //   let stopLossPrice:number = params.stopLossPrice
    //   let takeProfitPrice:number = params.takeProfitPrice
    //   //let exchange:any = ccxt.Exchange
    //   //console.log( stopLossPrice)
    //       //strategy == 'stop-loss'
    //   if (strategy == 'stop-loss' && stopLossPrice < last ) {
    //     try {
    //         console.log('less')
    //         Controller.deleteTriggers('123')
    //     } catch (error) {
    //       console.log(error)
    //     }
    //   }

    //   if ( strategy == 'take-profit' && last >= takeProfitPrice ) {
    //     //if( last >= takeProfitPrice){
    //       //console.log('last', last, 'stopLossPrice', stopLossPrice )
    //       exchange.createMarketSellOrder()
    //     //}
    //   }
    // })
    //console.log('trigger',triggers)
    // loop through all the avaialbe triggers for this exchange and symbol
    // check if the trigger conditions are met
  }
}
