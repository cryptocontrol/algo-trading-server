"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const binance_api_node_1 = require("binance-api-node");
const CCXTExchange_1 = require("./core/CCXTExchange");
class BinanceExchange extends CCXTExchange_1.default {
    constructor(exchange) {
        super(exchange);
        const client = binance_api_node_1.default();
        this.clientws = client.ws;
        this.streamingTradesSymbol = [];
        this.streamingOrderbookSymbol = [];
    }
    canStreamTrades(symbol) {
        return true;
    }
    streamTrades(symbol) {
        // check if we are already streaming this symbol or not
        if (this.streamingTradesSymbol.indexOf(symbol) >= 0)
            return;
        this.streamingTradesSymbol.push(symbol);
        const wsSymbol = symbol.replace('/', '').toUpperCase();
        this.clientws.trades([wsSymbol], trade => {
            const ccxtTrade = {
                amount: Number(trade.quantity),
                cost: Number(trade.price) * Number(trade.quantity),
                datetime: (new Date(trade.eventTime)).toISOString(),
                fee: undefined,
                id: String(trade.tradeId),
                info: {},
                price: Number(trade.price),
                side: trade.maker ? 'sell' : 'buy',
                symbol,
                takerOrMaker: trade.maker ? 'maker' : 'taker',
                timestamp: Number(trade.eventTime)
            };
            this.emit(`trade:${symbol}`, ccxtTrade);
        });
    }
    streamOrderbook(symbol) {
        // check if we are already streaming this symbol or not
        if (this.streamingOrderbookSymbol.indexOf(symbol) >= 0)
            return;
        this.streamingOrderbookSymbol.push(symbol);
        const wsSymbol = symbol.replace('/', '').toUpperCase();
        this.clientws.depth(wsSymbol, depth => {
            const bids = depth.bidDepth.map(bid => {
                return {
                    // asset: symbol,
                    price: Number(bid.price),
                    amount: Number(bid.quantity)
                };
            });
            const asks = depth.askDepth.map(ask => {
                return {
                    // asset: depth.symbol,
                    price: Number(ask.price),
                    amount: Number(ask.quantity)
                };
            });
            this.emit(`orderbook:${symbol}`, { bids, asks });
        });
    }
}
exports.default = BinanceExchange;
