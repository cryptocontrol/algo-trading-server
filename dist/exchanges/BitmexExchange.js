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
class BitmexExchange extends CCXTExchange_1.default {
    constructor(exchange) {
        super(exchange);
        const client = new WebSocket('wss://www.bitmex.com/realtime');
        this.clientws = client;
    }
    canStreamTrades(_symbol) {
        return true;
    }
    streamTrades(symbol) {
        // check if we are already streaming this symbol or not
        // if (this.streamingTradesSymbol.indexOf(symbol) >= 0) return
        // this.streamingTradesSymbol.push(symbol)
        const wsSymbol = symbol.replace('/', '').toUpperCase();
        this.clientws.on('open', () => {
            console.log('ws opened');
            this.clientws.send(`{'op': 'subscribe', 'args': 'trade:${wsSymbol}'}`);
            // this.clientws.send('{'op': 'subscribe', 'args': 'trade'}') //for all symbols
        });
        this.clientws.on('message', (trade) => {
            const parsedJSON = JSON.parse(trade);
            try {
                const data = parsedJSON.data;
                if (data) {
                    data.forEach(obj => {
                        var price = obj.price;
                        var size = obj.size;
                        var ts = obj.timestamp;
                        var symbol2 = obj.symbol; // this will be needed for all symbols
                        var timestamp = Date.parse(ts);
                        var grossValue = obj.grossValue;
                        const ccxtTrade = {
                            amount: Number(size),
                            datetime: (new Date(timestamp)).toISOString(),
                            id: String(obj.trdMatchID),
                            price: Number(price),
                            info: {},
                            timestamp: timestamp,
                            side: obj.side,
                            symbol: symbol2,
                            takerOrMaker: trade.maker ? 'maker' : 'taker',
                            cost: Number(price) * Number(size),
                            fee: undefined
                        };
                        console.log(ccxtTrade);
                        this.emit('trade', ccxtTrade);
                    });
                }
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
            this.clientws.send(`{'op': 'subscribe', 'args': 'orderBook10:${wsSymbol}'}`);
        });
        this.clientws.on('message', (orders) => {
            const parsedJSON = JSON.parse(orders);
            try {
                const data = parsedJSON.data;
                data.forEach(obj => {
                    const bids = obj.bids.map(bid => {
                        return {
                            asset: wsSymbol,
                            price: bid[0],
                            amount: bid[1]
                        };
                    });
                    const asks = obj.asks.map(ask => {
                        return {
                            asset: wsSymbol,
                            price: ask[0],
                            amount: ask[1]
                        };
                    });
                    const orderBook = {
                        bids: bids,
                        asks: asks
                    };
                    console.log(orderBook);
                    this.emit('orderbook', orderBook);
                });
            }
            catch (e) {
                // console.log(e)
            }
        });
    }
    getTrades(symbol, since, _descending) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.exchange.fetchTrades(symbol, since);
        });
    }
}
exports.default = BitmexExchange;
// const main = async () => {
//   const bitmex = new BitmexExchange()
//   // bitmex.streamTrades('ETHUSD')
//   bitmex.streamOrderbook('ETHUSD')
// }
// main()
