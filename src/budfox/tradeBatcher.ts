import * as _ from 'underscore'
import * as moment from 'moment'
import { EventEmitter } from 'events'
import { Trade } from 'ccxt'

import log from '../utils/log'


export interface ITradesBatchEvent {
  count: number
  start: number
  end: number
  last: Trade
  first: Trade
  trades: Trade[]
}


/**
 * Small wrapper that only propagates new trades.
 *
 * - Emits `new batch` - all new trades.
 */
export default class TradeBatcher extends EventEmitter {
  private lastTrade: Trade


  write (trades: Trade[] = []) {
    if (trades.length === 0) return log.debug('Trade fetch came back empty.')

    // filter and count trades
    const filteredBatch = this.filter(trades)
    const count = filteredBatch.length
    if (count === 0) return // log.debug('No new trades.')

    // pick first & last trades
    const last = _.last(filteredBatch)
    const first = _.first(filteredBatch)

    const firstDate = moment(first.timestamp), lastDate = moment(last.timestamp)
    log.debug(`Processing ${count} new trades from ${first.timestamp} UTC to ${last.timestamp} UTC ` +
      `(${firstDate.from(lastDate, true)})`)

    // log.debug(
    //   'Processing', amount, 'new trades.',
    //   'From',
    //   first.date.format('YYYY-MM-DD HH:mm:ss'),
    //   'UTC to',
    //   last.date.format('YYYY-MM-DD HH:mm:ss'),
    //   'UTC.',
    //   '(' + first.date.from(last.date, true) + ')'
    // )

    this.emit('new batch', {
      count,
      start: first.timestamp,
      end: last.timestamp,
      last,
      first,
      trades: filteredBatch
    })

    this.lastTrade = last
  }


  private filter (batch: Trade[]) {
    // remove trades that have zero amount
    // see @link
    // https://github.com/askmike/gekko/issues/486
    batch = _.filter(batch, trade => trade.amount > 0)

    // weed out known trades
    // TODO: optimize by stopping as soon as the
    // first trade is too old (reverse first)
    if (this.lastTrade) return _.filter(batch, trade => this.lastTrade.timestamp < trade.timestamp)
    return batch
  }
}
