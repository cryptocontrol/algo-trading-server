import Heart from './heart'
import MarketDataProvider from './marketDataProvider'
import { EventEmitter } from 'events'
import { Exchange } from 'ccxt';

// Budfox is the realtime market for Gekko!
//
// Read more here:
// @link https://github.com/askmike/gekko/blob/stable/docs/internals/budfox.md
//
// > [getting up] I don't know. I guess I realized that I'm just Bud Fox.
// > As much as I wanted to be Gordon Gekko, I'll *always* be Bud Fox.
// > [tosses back the handkerchief and walks away]

export default class BudFox extends EventEmitter {
  heart: Heart
  marketDataProvider: MarketDataProvider


  constructor (exchange: Exchange, symbol: string) {
    super()

    // init the different components
    this.heart = new Heart()
    this.marketDataProvider = new MarketDataProvider(exchange, symbol)

    // connect them together

    // on every `tick` retrieve trade data
    this.heart.on('tick', this.marketDataProvider.retrieve)

    // on new trade data create candles and output it
    // this.marketDataProvider.on('trades', this.candleManager.processTrades);
    // this.candleManager.on('candles', this.pushCandles)

    // relay a market-start and market-update event
    this.marketDataProvider.on('market-start', e => this.emit('market-start', e))
    this.marketDataProvider.on('market-update', e => this.emit('market-update', e))

    // once everything is connected, we pump the heart!
    this.heart.pump()
  }
}


// BudFox_.prototype = Object.create(Readable.prototype, {
//   constructor: { value: BudFox_ }
// });

// BudFox_.prototype._read = function noop() {}

// BudFox_.prototype.pushCandles = function(candles) {
//   _.each(candles, this.push);
// }

// module.exports = BudFox_;
