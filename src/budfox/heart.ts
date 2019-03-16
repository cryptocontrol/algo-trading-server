import * as _ from 'underscore'
import { EventEmitter } from 'events'

import { die } from 'src/utils'
import log from 'src/utils/log'


/**
 * The heart schedules and emit ticks every 20 seconds.
 */
export default class Heart extends EventEmitter {
  private lastTick = 0
  private tickrate: number
  private interval: NodeJS.Timeout


  constructor (tickrate: number = 20) {
    super()
    this.tickrate = tickrate
  }


  pump () {
    log.debug('scheduling ticks')
    this.scheduleTicks()
  }


  attack () {
    log.debug('stopping ticks')
    clearInterval(this.interval)
  }


  private tick = () => {
    if (this.lastTick) {
      // make sure the last tick happened not too long ago
      // @link https://github.com/askmike/gekko/issues/514
      if (this.lastTick < Date.now() - this.tickrate * 3000)
        die('Failed to tick in time, see https://github.com/askmike/gekko/issues/514 for details', true)
    }

    this.lastTick = Date.now()
    this.emit('tick')
  }


  private scheduleTicks () {
    this.interval = setInterval(this.tick, this.tickrate * 1000)
    _.defer(this.tick)
  }
}
