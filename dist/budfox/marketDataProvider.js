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
const _ = require("underscore");
const events_1 = require("events");
const tradeBatcher_1 = require("./tradeBatcher");
const heart_1 = require("./heart");
const log_1 = require("src/utils/log");
/**
 * The market data provider will fetch data from a datasource on tick. It emits:
 *
 * - `trades`: batch of newly detected trades
 * - `trade`: the last new trade
 * - `market-update`: after Igunana fetched new trades, this will be the most recent one.
 * - `market-start`: contains the time timestamp of the first trade (a market start event)...
 */
class MarketDataProvider extends events_1.EventEmitter {
    constructor(exchange, symbol) {
        super();
        this.marketStarted = false;
        this.firstFetch = true;
        this.relayTrades = (e) => {
            if (!e.trades)
                return;
            if (this.marketStarted) {
                this.marketStarted = true;
                this.emit('market-start', e.first.timestamp);
            }
            this.emit('market-update', e.last.timestamp);
            this.emit('trades', e.trades);
            this.emit('trade', e.last);
        };
        this.fetch = () => __awaiter(this, void 0, void 0, function* () {
            let since;
            // if (this.firstFetch) {
            //   since = this.firstSince
            //   this.firstFetch = false
            // }
            // this.tries = 0
            log_1.default.debug('Requested', this.symbol, 'trade data from', this.exchange.id, '...');
            const trades = yield this.exchange.getTrades(this.symbol, since, false);
            this.processTrades(trades);
            // .catch(e => {
            //   log.warn(this.exchange.name, 'returned an error while fetching trades:', e)
            //   log.debug('refetching...')
            // })
        });
        this.exchange = exchange;
        this.symbol = symbol;
        this.heart = new heart_1.default;
        this.batcher = new tradeBatcher_1.default;
        // connect the heart to the fetch fn
        this.heart.on('tick', this.fetch);
        // relay newly fetched trades
        this.batcher.on('new batch', this.relayTrades);
    }
    start() {
        // first fetch the first set of trades
        this.fetch();
        // check if the exchange has streaming capabilities
        if (this.exchange.canStreamTrades(this.symbol)) {
            // then we start streaming trades in real-time
            this.exchange.on('trade', (trade) => {
                if (trade.symbol === this.symbol)
                    this.processTrades([trade]);
            });
            log_1.default.debug('Streaming', this.symbol, 'trades from', this.exchange.id, '...');
            this.exchange.streamTrades(this.symbol);
            return;
        }
        // else we poll the exchange; (by starting the heart!)
        this.heart.pump();
    }
    stop() {
        this.heart.attack();
    }
    processTrades(trades) {
        if (_.isEmpty(trades)) {
            log_1.default.debug('trade fetch came back empty, refetching...');
            // setTimeout(this._fetch, +moment.duration(1, 's'))
            return;
        }
        this.batcher.write(trades);
    }
}
exports.default = MarketDataProvider;
