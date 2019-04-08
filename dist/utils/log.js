"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require('moment');
const fmt = require('util').format;
// todo: get from config
const debug = true;
const silent = false;
class Log {
    constructor() {
        this.sendToParent = function () {
            const send = method => (...args) => {
                process.send({ log: method, message: args.join(' ') });
            };
            return {
                error: send('error'),
                warn: send('warn'),
                info: send('info'),
                write: send('write')
            };
        };
        this.env = 'standalone'; // util.gekkoEnv()
        if (this.env === 'standalone')
            this.output = console;
        else if (this.env === 'child-process')
            this.output = this.sendToParent();
    }
    error(...args) {
        this._write('error', args);
    }
    warn(...args) {
        this._write('warn', args);
    }
    info(...args) {
        this._write('info', args);
    }
    debug(...args) {
        if (!debug)
            return;
        this._write('debug', args);
    }
    _write(method, args, name) {
        if (silent)
            return;
        if (!name)
            name = method.toUpperCase();
        let message = moment().format('YYYY-MM-DD HH:mm:ss');
        message += ' (' + name + '):\t';
        message += fmt.apply(null, args);
        this.output[method](message);
    }
}
exports.default = new Log;
