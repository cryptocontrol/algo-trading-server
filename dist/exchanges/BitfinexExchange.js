"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BitfinexApi = require("bitfinex-api-node");
const CCXTExchange_1 = require("./core/CCXTExchange");
class BitfinexExchange extends CCXTExchange_1.default {
    constructor(exchange) {
        super(exchange);
        const client = new BitfinexApi({
            ws: {
                autoReconnect: false,
                manageCandles: true
            }
        });
        this.clientws = client.ws(2, { transform: true });
        this.clientws.open();
        this.streamingTradesSymbol = [];
        this.streamingOrderbookSymbol = [];
    }
    streamTrades(symbol) {
        // check if we are already streaming this symbol or not
        if (this.streamingTradesSymbol.indexOf(symbol) >= 0)
            return;
        this.streamingTradesSymbol.push(symbol);
        const wsSymbol = symbol.replace('/', '').toUpperCase();
        this.clientws.subscribeTrades(`t${wsSymbol}`);
        this.clientws.onTrades({ symbol: `t${wsSymbol}` }, trade => {
            trade.forEach(result => {
                const ccxtTrade = {
                    amount: Number(result.amount),
                    datetime: (new Date(result.mts)).toISOString(),
                    id: String(result.id),
                    price: Number(result.price),
                    info: {},
                    timestamp: result.mts,
                    side: trade.isBuyerMaker ? 'sell' : 'buy',
                    symbol: undefined,
                    takerOrMaker: trade.maker ? 'maker' : 'taker',
                    cost: Number(result.price) * Number(result.amount),
                    fee: undefined
                };
                this.emit(`trade:${symbol}`, ccxtTrade);
            });
        });
    }
    streamOrderbook(symbol) {
        // check if we are already streaming this symbol or not
        if (this.streamingOrderbookSymbol.indexOf(symbol) >= 0)
            return;
        this.streamingOrderbookSymbol.push(symbol);
        const wsSymbol = symbol.replace('/', '').toUpperCase();
        this.clientws.subscribeOrderBook(`${wsSymbol}`);
        this.clientws.onOrderBook({ symbol: `t${wsSymbol}` }, (orders) => {
            const bids = orders.bids.map(bid => {
                return {
                    asset: wsSymbol,
                    price: bid[0],
                    amount: bid[2]
                };
            });
            const asks = orders.asks.map(ask => {
                return {
                    asset: wsSymbol,
                    price: Math.abs(ask[0]),
                    amount: Math.abs(ask[2])
                };
            });
            this.emit(`orderbook:${symbol}`, { bids, asks });
        });
    }
}
exports.default = BitfinexExchange;
