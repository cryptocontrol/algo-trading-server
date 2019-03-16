/**
 * Lightweight logger, print everything that is send to error, warn
 * and messages to stdout (the terminal). If config.debug is set in config
 * also print out everything send to debug.
 */
import * as _ from 'underscore'

const moment = require('moment')
const fmt = require('util').format

// todo: get from config
const debug = true
const silent = false

class Log {
  private env: string
  private output: any

  constructor () {
    this.env = 'standalone' // util.gekkoEnv()

    if (this.env === 'standalone') this.output = console
    else if (this.env === 'child-process') this.output = this.sendToParent()
  }


  public error (...args) {
    this._write('error', args)
  }


  public warn (...args) {
    this._write('warn', args)
  }


  public info (...args) {
    this._write('info', args)
  }


  public debug (...args) {
    if (!debug) return
    this._write('debug', args)
  }


  private _write (method: string, args: any[], name?: string) {
    if (silent) return
    if (!name) name = method.toUpperCase()

    let message = moment().format('YYYY-MM-DD HH:mm:ss')
    message += ' (' + name + '):\t'
    message += fmt.apply(null, args)

    this.output[method](message)
  }


  private sendToParent = function() {
    const send = method => (...args) => {
      process.send({ log: method, message: args.join(' ') })
    }

    return {
      error: send('error'),
      warn: send('warn'),
      info: send('info'),
      write: send('write')
    }
  }
}


export default new Log
