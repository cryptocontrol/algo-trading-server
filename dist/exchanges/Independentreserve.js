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
const ccxt = require("ccxt");
const CCXTExchange_1 = require("./core/CCXTExchange");
class IndependentreserveExchange extends CCXTExchange_1.default {
    constructor() {
        const independentreserve = new ccxt.independentreserve({ enableRateLimit: true });
        super(independentreserve);
        const client = 'independentreserve';
        // this.clientws = 'client.ws(2, { transform: true })'
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
        // const wsSymbol = symbol.replace('/', '').toUpperCase()
        //
        // this.clientws.open()
        // this.clientws.on('open', () => {
        //   console.log('ws opened')
        //   this.clientws.subscribeTrades(`t${wsSymbol}`)
        // })
        //
        // this.clientws.onTrades({ symbol: `t${wsSymbol}` }, trade => {
        //   trade.forEach((result:any) => {
        //     const ccxtTrade: ccxt.Trade = {
        //       amount: Number(result.amount),
        //       datetime: (new Date(result.mts)).toISOString(),
        //       id: String(result.id),
        //       price: Number(result.price),
        //       info: {},
        //       timestamp: result.mts,
        //       side: trade.isBuyerMaker ? 'sell' : 'buy',
        //       symbol: undefined,
        //       takerOrMaker: trade.maker ? 'maker' : 'taker',
        //       cost: Number(result.price) * Number(result.amount),
        //       fee: undefined
        //     }
        //     console.log(ccxtTrade)
        //     this.emit('trade', ccxtTrade)
        //   })
        // })
    }
    streamOrderbook(symbol) {
        // const wsSymbol = symbol.replace('/', '').toUpperCase()
        //
        // this.clientws.open()
        // this.clientws.on('open', () => {
        //   console.log('ws opened')
        //   this.clientws.subscribeOrderBook(`${wsSymbol}`)
        // })
        //
        // this.clientws.onOrderBook({ symbol: `t${wsSymbol}` }, (orders) => {
        //
        //   const bids: IOrder[] = orders.bids.map(bid => {
        //     return {
        //       asset: wsSymbol,
        //       price: bid[0],
        //       amount: bid[2]
        //     }
        //   })
        //
        //   const asks: IOrder[] = orders.asks.map(ask => {
        //     return {
        //       asset: wsSymbol,
        //       price: ask[0],
        //       amount: ask[2]
        //     }
        //   })
        //
        //
        //   const orderBook:IOrderBook = {
        //     bids: bids,
        //     asks: asks
        //   }
        //   this.emit('orderbook', orderBook)
        //   console.log(orderBook)
        // })
    }
    loadMarkets() {
        return __awaiter(this, void 0, void 0, function* () {
            const markets = yield this.exchange.loadMarkets();
            console.log(markets);
            return yield this.exchange.loadMarkets();
        });
    }
    fetchMarkets() {
        return __awaiter(this, void 0, void 0, function* () {
            const markets = yield this.exchange.fetchMarkets();
            console.log(markets);
            return yield this.exchange.loadMarkets();
        });
    }
    fetchTickers(symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            const wsSymbol = symbol.replace('/', '').toUpperCase();
            const ticker = yield this.exchange.has.fetchTickers;
            if (ticker === false) {
                const fakeTicker = {};
                fakeTicker.symbol = wsSymbol;
                fakeTicker.timestamp = '1553862530261.5288';
                fakeTicker.datetime = 'datetime';
                fakeTicker.high = 9.3e-7;
                fakeTicker.bid = 8.5e-7;
                fakeTicker.bidVolume = undefined;
                fakeTicker.ask = 0.00000103;
                fakeTicker.askVolume = undefined;
                fakeTicker.vwap = undefined;
                fakeTicker.open = undefined;
                fakeTicker.close = 8.5e-7;
                fakeTicker.last = 8.5e-7;
                fakeTicker.previousClose = undefined;
                fakeTicker.change = undefined;
                fakeTicker.percentage = undefined;
                fakeTicker.average = 9.4e-7;
                fakeTicker.baseVolume = 179063.63874;
                fakeTicker.quoteVolume = undefined;
                fakeTicker.info = { mid: '0.00000094',
                    bid: '0.00000085',
                    ask: '0.00000103',
                    last_price: '0.00000085',
                    low: '0.00000072',
                    high: '0.00000093',
                    volume: '179063.63874',
                    timestamp: '1553862530.261528837',
                    pair: wsSymbol };
                console.log('fetchTickers is not supported', '\n', fakeTicker);
            }
            else {
                // const ticker2 = await this.exchange.fetchTickers(symbol)
                // console.log(ticker2)
            }
        });
    }
    getTrades(symbol, since, _descending) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.exchange.fetchTrades(symbol, since);
        });
    }
}
exports.default = IndependentreserveExchange;
