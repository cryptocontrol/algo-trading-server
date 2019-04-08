"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("underscore");
const candleCreator_1 = require("./candleCreator");
const candles_1 = require("src/database/models/candles");
const log_1 = require("src/utils/log");
const marketDataProvider_1 = require("./marketDataProvider");
const trades_1 = require("src/database/models/trades");
const events_1 = require("events");
/**
 * Budfox is the realtime market for Iguana! It was initially built by the team
 * that built Gekko but was modified to support CCXT exchanges and websocket connections.
 *
 * Budfox takes an exchange and a symbol, and tracks all new trades and emits out candles.
 *
 * Read more here what Budfox does (Gekko's version):
 * @link https://github.com/askmike/gekko/blob/stable/docs/internals/budfox.md
 */
class BudFox extends events_1.EventEmitter {
    constructor(exchange, symbol) {
        super();
        this.processCandles = (candles) => {
            candles.forEach(c => {
                // write to stream
                this.emit('candle', c);
                // save into the DB
                const candle = new candles_1.default({
                    open: c.open,
                    high: c.high,
                    low: c.low,
                    volume: c.volume,
                    close: c.close,
                    vwp: c.vwp,
                    start: c.start,
                    trades: c.trades,
                    exchange: this.exchange.id,
                    symbol: this.symbol
                });
                candle.save().catch(_.noop);
            });
        };
        this.processTrades = (trades) => {
            trades.forEach(t => {
                this.emit('trade', t);
                const trade = new trades_1.default({
                    exchange: this.exchange.id,
                    price: t.price,
                    symbol: this.symbol,
                    tradedAt: new Date(t.timestamp),
                    side: t.side,
                    tradeId: String(t.id),
                    volume: t.amount
                });
                trade.save().catch(_.noop);
            });
        };
        log_1.default.debug('init budfox for', exchange.id, symbol);
        this.exchange = exchange;
        this.symbol = symbol;
        // init the different components
        this.marketDataProvider = new marketDataProvider_1.default(exchange, symbol);
        this.candlesCreator = new candleCreator_1.default;
        // connect them together
        // on new trade data create candles and stream it
        this.marketDataProvider.on('trades', this.candlesCreator.write);
        this.candlesCreator.on('candles', this.processCandles);
        // relay a market-start, market-update and trade events
        this.marketDataProvider.on('market-start', e => this.emit('market-start', e));
        this.marketDataProvider.on('market-update', e => this.emit('market-update', e));
        this.marketDataProvider.on('trades', this.processTrades);
        // once everything is connected, we start the market data provider
        this.marketDataProvider.start();
    }
    _read() {
        // do nothing
    }
    /**
     * Stop budfox
     */
    murder() {
        log_1.default.debug('murdered budfox for', this.exchange.id, this.symbol);
        this.marketDataProvider.stop();
    }
}
exports.default = BudFox;
