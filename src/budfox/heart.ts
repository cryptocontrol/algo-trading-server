import * as moment from 'moment'
import * as _ from 'underscore'
import { EventEmitter } from 'events'

import { die } from 'src/utils'
import log from 'src/utils/log'


/**
 * The heart schedules and emit ticks every 20 seconds.
 */
export default class Heart extends EventEmitter {
  lastTick = 0
  tickrate: number
  interval: NodeJS.Timeout


  constructor (tickrate: number = 20) {
    super()
    this.tickrate = tickrate
  }


  pump () {
    log.debug('scheduling ticks')
    this.scheduleTicks()
  }


  tick () {
    if (this.lastTick) {
      // make sure the last tick happened not to lang ago
      // @link https://github.com/askmike/gekko/issues/514
      if (this.lastTick < moment().unix() - this.tickrate * 3)
        die('Failed to tick in time, see https://github.com/askmike/gekko/issues/514 for details', true)
    }

    this.lastTick = moment().unix()
    this.emit('tick')
  }


  scheduleTicks () {
    this.interval = setInterval(this.tick, +moment.duration(this.tickrate, 's'))

    // start!
    _.defer(this.tick)
  }
}
