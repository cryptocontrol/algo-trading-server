import { Trade } from 'ccxt'

import { ICandle } from 'src/interfaces'
import BaseTrigger from './BaseTrigger'
import Triggers from 'src/database/models/triggers'


/**
 * A stop loss sell trigger, is executed when the market price goes below a certain
 * threshold. The trigger forces a market sell order.
 */
export default class StopLossSellTrigger extends BaseTrigger {
  constructor (triggerDB: Triggers) {
    super(triggerDB, 'Stop Loss Sell')
  }


  onTrade (trade: Trade) {
    if (!this.isLive) return
    const { price } = trade

    // if price reaches or goes below the stop loss price, then
    // we close the position with a market sell order
    if (price <= this.triggerDB.targetPrice) {
      this.advice('market-sell', price, this.triggerDB.targetVolume)
      this.close()
    }
  }


  onCandle (_candle: ICandle) {
    // do nothing
  }
}
