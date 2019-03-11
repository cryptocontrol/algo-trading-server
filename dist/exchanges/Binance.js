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
var ccxt = require("ccxt");
var binance_api_node_1 = require("binance-api-node");
var BaseExchange_1 = require("./BaseExchange");
var Binance = /** @class */ (function (_super) {
    __extends(Binance, _super);
    function Binance() {
        var _this = this;
        var binance = new ccxt.binance();
        _this = _super.call(this, binance) || this;
        return _this;
    }
    Binance.prototype.startListening = function () {
        var _this = this;
        var client = binance_api_node_1.default();
        client.ws.trades(['BTCUSDT'], function (trade) { return _this.onPriceUpdate('BTCUSDT', Number(trade.price)); });
    };
    return Binance;
}(BaseExchange_1.default));
exports.default = Binance;
