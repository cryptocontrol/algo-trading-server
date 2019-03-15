import * as moment from 'moment'
import * as _ from 'underscore'
import { EventEmitter } from 'events'

import { die } from 'src/utils'
import log from 'src/utils/log'
import CandleCreator from './candleCreator'


/**
 * The heart schedules and emit ticks every 20 seconds.
 */
export default class CandleManager extends EventEmitter {
  private lastTick = 0
  private tickrate: number
  private creator: CandleCreator


  constructor (tickrate: number = 20) {
    super()
    this.creator = new CandleCreator

    this.creator.on('candles', e => this.emit('candles', e))
  }
}


// The candleManager consumes trades and emits:
// - `candles`: array of minutly candles.
// - `candle`: the most recent candle after a fetch Gekko.


var Manager = function() {
  _.bindAll(this);

  this.candleCreator = new CandleCreator;

  this.candleCreator
    .on('candles', this.relayCandles);
};

util.makeEventEmitter(Manager);
Manager.prototype.processTrades = function(tradeBatch) {
  this.candleCreator.write(tradeBatch);
}

Manager.prototype.relayCandles = function(candles) {
  this.emit('candles', candles);
}

module.exports = Manager;
