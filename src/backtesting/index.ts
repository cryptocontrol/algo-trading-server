import BaseExchange from 'src/exchanges/core/BaseExchange'
import * as ccxt from 'ccxt'
import CCXTExchange from 'src/exchanges/core/CCXTExchange'
import BinanceExchange from 'src/exchanges/BinanceExchange'
import { EventEmitter } from 'events';
import RSIStrategy from 'src/strategies/RSIStrategy'

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
    this.strategy = new RSIStrategy()
  }

  async fetch() {
    const ccxtExchange = new ccxt[this.exchangeId]({ enableRateLimit: true })

    const candleData = await ccxtExchange.fetchOHLCV(this.pair, this.timeframe, this.since);

    // const tradeData = await ccxtExchange.fetchTrades(this.pair, this.since);

    return candleData;
  }

  async onCandle() {
    const data: any = this.fetch()

    data.forEach(c => {
      this.emit("candle", c)
      this.strategy.onCandle(c)
    })
  }
}
