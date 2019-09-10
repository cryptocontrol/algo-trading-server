import BaseExchange from 'src/exchanges/core/BaseExchange'
import * as ccxt from 'ccxt'
import CCXTExchange from 'src/exchanges/core/CCXTExchange'
import BinanceExchange from 'src/exchanges/BinanceExchange'
import { EventEmitter } from 'events';
import RSIStrategy from 'src/strategies/RSIStrategy'
import Strategy from 'src/database/models/strategies'

export default class BackTesting extends EventEmitter {
  private readonly exchangeId: string;
  private readonly pair: string;
  private readonly timeframe: string;
  private readonly since: string;
  private readonly strategy: any;

  constructor(exchangeId, pair, timeframe, since) {
    super();

    this.exchangeId = exchangeId;
    this.pair = pair;
    this.timeframe = timeframe
    this.since = since
    // add strategy from db
    // @ts-ignore
    this.strategy = new RSIStrategy({
      "symbol": 'BTC/USDT',
      exchange: 'binance',
      uid: '123456789',
      kind: 'rsi',
      params: '{}',
      isActive: true,
      isDeleted: false,
    })



  }

  async fetch() {
    const ccxtExchange = new ccxt[this.exchangeId]({ enableRateLimit: true })

    const candleData = await ccxtExchange.fetchOHLCV(this.pair, this.timeframe, this.since);

    // const tradeData = await ccxtExchange.fetchTrades(this.pair, this.since);

    return candleData;
  }

  async onCandle() {
    const data: any = await this.fetch()

    data.forEach(c => {
      // TODO: convert candle data to proper formatt
      const advice = {
        symbol: this.pair,
        exchange: this.exchangeId,
        open: c[1],
        high: c[2],
        low: c[3],
        volume: c[5],
        close: c[4],
        // vwp:
        start: this.since
        // trades:
      }
      this.emit("candle", c)
      this.strategy.onCandle(advice)
    })
  }

  async onTrade() {
  }
}
