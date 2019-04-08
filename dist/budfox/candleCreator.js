"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const _ = require("underscore");
const events_1 = require("events");
/**
 * The CandleCreator creates one minute candles based on trade batches. Note that it
 * also adds empty candles to fill gaps with no volume.
 *
 * Emits `candles` event with a list of new candles
 * Emits `candle` event with the last candle
 */
class CandleCreator extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        this.threshold = 0;
        // This also holds the leftover between fetches
        this.buckets = {};
        this.write = (batch) => {
            const trades = this.filter(batch);
            if (_.isEmpty(trades))
                return;
            this.fillBuckets(trades);
            let candles = this.calculateCandles();
            candles = this.addEmptyCandles(candles);
            if (_.isEmpty(candles))
                return;
            // the last candle is not complete
            this.threshold = candles.pop().start.unix();
            this.emit('candles', candles);
            this.emit('candle', _.last(candles));
        };
        /**
         * make sure we only include trades more recent than the previous emitted candle
         * @param trades
         */
        this.filter = (trades) => _.filter(trades, t => t.timestamp > this.threshold);
    }
    /**
     * put each trade in a per minute bucket
     * @param trades
     */
    fillBuckets(trades) {
        _.each(trades, trade => {
            const minute = moment(trade.timestamp).format('YYYY-MM-DD HH:mm');
            if (!(minute in this.buckets))
                this.buckets[minute] = [];
            this.buckets[minute].push(trade);
        });
        this.lastTrade = _.last(trades);
    }
    /**
     * convert each bucket into a candle
     */
    calculateCandles() {
        let lastMinute, candles = [];
        // catch error from high volume getTrades
        if (this.lastTrade !== undefined)
            // create a string referencing the minute this trade happened in
            lastMinute = moment(this.lastTrade.timestamp).format('YYYY-MM-DD HH:mm');
        _.mapObject(this.buckets, (bucket, name) => {
            const candle = this.calculateCandle(bucket);
            // clean all buckets, except the last one:
            // this candle is not complete
            if (name !== lastMinute)
                delete this.buckets[name];
            candles.push(candle);
        });
        return candles;
    }
    calculateCandle(trades) {
        const first = _.first(trades);
        const candle = {
            start: moment(first.timestamp).clone().startOf('minute'),
            open: first.price,
            high: first.price,
            low: first.price,
            close: _.last(trades).price,
            vwp: 0,
            volume: 0,
            trades: _.size(trades)
        };
        _.each(trades, function (trade) {
            candle.high = _.max([candle.high, trade.price]);
            candle.low = _.min([candle.low, trade.price]);
            candle.volume += trade.amount;
            candle.vwp += trade.price * trade.amount;
        });
        candle.vwp /= candle.volume;
        return candle;
    }
    /**
     * Iguana expects a candle every minute, if nothing happened during a particilar
     * minute we will add empty candles with:
     *
     * - open, high, close, low, vwp are the same as the close of the previous candle.
     * - trades, volume are 0
     *
     * @param candles
     */
    addEmptyCandles(candles) {
        const amount = _.size(candles);
        if (!amount)
            return candles;
        // iterator
        const start = _.first(candles).start.clone();
        const end = _.last(candles).start;
        let i, j = -1;
        const minutes = _.map(candles, candle => +candle.start);
        while (start < end) {
            start.add(1, 'm');
            i = +start;
            j++;
            // if we have a candle for this minute
            if (_.contains(minutes, i))
                continue;
            const lastPrice = candles[j].close;
            candles.splice(j + 1, 0, {
                start: start.clone(),
                open: lastPrice,
                high: lastPrice,
                low: lastPrice,
                close: lastPrice,
                vwp: lastPrice,
                volume: 0,
                trades: 0
            });
        }
        return candles;
    }
}
exports.default = CandleCreator;
