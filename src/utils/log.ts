/**
 * Lightweight logger, print everything that is send to error, warn
 * and messages to stdout (the terminal). If config.debug is set in config
 * also print out everything send to debug.
 */
import * as _ from 'underscore'

const moment = require('moment')
const fmt = require('util').format
// const util = require('./util')
const config: any = {} // util.getConfig()
const debug = config.debug
const silent = config.silent


const sendToParent = function() {
  const send = method => (...args) => {
    process.send({log: method, message: args.join(' ')})
  }

  return {
    error: send('error'),
    warn: send('warn'),
    info: send('info'),
    write: send('write')
  }
}


const Log = function() {
  _.bindAll(this)
  this.env = 'standalone' // util.gekkoEnv()

  if (this.env === 'standalone') this.output = console
  else if (this.env === 'child-process') this.output = sendToParent()
}


Log.prototype = {
  _write: function(method, args, name) {
    if(!name) name = method.toUpperCase()

    let message = moment().format('YYYY-MM-DD HH:mm:ss')
    message += ' (' + name + '):\t'
    message += fmt.apply(null, args)

    this.output[method](message)
  },
  error: function() {
    this._write('error', arguments)
  },
  warn: function() {
    this._write('warn', arguments)
  },
  info: function() {
    this._write('info', arguments)
  },
  write: function() {
    const args = _.toArray(arguments)
    const message = fmt.apply(null, args)
    this.output.info(message)
  }
}

if(debug) Log.prototype.debug = function() { this._write('info', arguments, 'DEBUG') }
else Log.prototype.debug = _.noop

if(silent) {
  Log.prototype.debug = _.noop
  Log.prototype.info = _.noop
  Log.prototype.warn = _.noop
  Log.prototype.error = _.noop
  Log.prototype.write = _.noop
}


export default new Log
