"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var BaseStrategy_1 = require("./BaseStrategy");
var StopLossStrategy = /** @class */ (function (_super) {
    __extends(StopLossStrategy, _super);
    function StopLossStrategy(id, trigger) {
        // do nothing... for now
        return _super.call(this) || this;
    }
    StopLossStrategy.create = function (id, trigger) {
        return new StopLossStrategy(id, trigger);
    };
    StopLossStrategy.prototype.process = function (lastprice) {
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
    };
    return StopLossStrategy;
}(BaseStrategy_1.default));
exports.default = StopLossStrategy;
