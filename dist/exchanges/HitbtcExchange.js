"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocket = require("ws");
const CCXTExchange_1 = require("./core/CCXTExchange");
class HitbtcExchange extends CCXTExchange_1.default {
    constructor(exchange) {
        super(exchange);
        const client = new WebSocket('wss://api.hitbtc.com/api/2/ws');
        this.clientws = client;
        this.streamingTradesSymbol = [];
    }
    canStreamTrades(_symbol) {
        return true;
    }
    streamTrades(symbol) {
        // check if we are already streaming this symbol or not
        // if (this.streamingTradesSymbol.indexOf(symbol) >= 0) return
        // this.streamingTradesSymbol.push(symbol)
        //
        const wsSymbol = symbol.replace('/', '').toUpperCase();
        this.clientws.on('open', () => {
            console.log('ws opened');
            this.clientws.send(`{ "method":"subscribeTrades","params": { "symbol": "${wsSymbol}" }, "id":123 }`);
        });
        this.clientws.on('message', (trade) => {
            const parsedJSON = JSON.parse(trade);
            const params = parsedJSON.params;
            try {
                const data = params.data;
                data.forEach(obj => {
                    const price = obj.price;
                    const quantity = obj.quantity;
                    const timestamp = Date.parse(obj.timestamp);
                    // console.log(price, quantity, timestamp)
                    const ccxtTrade = {
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
                    };
                    console.log(ccxtTrade);
                    this.emit('trade', ccxtTrade);
                });
            }
            catch (e) {
                // test
            }
        });
    }
    streamOrderbook(symbol) {
        const wsSymbol = symbol.replace('/', '').toUpperCase();
        this.clientws.on('open', () => {
            console.log('ws opened');
            this.clientws.send(`{"method": "subscribeOrderbook","params": {  "symbol": "${wsSymbol}"},  "id": 123}`);
        });
        this.clientws.on('message', (orders) => {
            const parsedJSON = JSON.parse(orders);
            const params = parsedJSON.params;
            try {
                const bids = params.bid.map(bid => {
                    return {
                        asset: wsSymbol,
                        price: bid.price,
                        amount: bid.size
                    };
                });
                const asks = params.ask.map(ask => {
                    return {
                        asset: wsSymbol,
                        price: ask.price,
                        amount: ask.size
                    };
                });
                const orderBook = {
                    bids: bids,
                    asks: asks
                };
                this.emit('orderbook', orderBook);
                console.log(orderBook);
            }
            catch (e) {
                // test
            }
        });
    }
    getTrades(symbol, since, _descending) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.exchange.fetchTrades(symbol, since);
        });
    }
}
exports.default = HitbtcExchange;
