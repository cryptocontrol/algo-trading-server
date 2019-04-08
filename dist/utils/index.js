"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.die = (m, soft = false) => {
    // if(_gekkoEnv === 'child-process') {
    //   return process.send({ type: 'error', error: '\n ERROR: ' + m + '\n' })
    // }
    const log = console.log.bind(console);
    if (m) {
        if (soft)
            log('\n ERROR: ' + m + '\n\n');
        else {
            log(`\nGekko encountered an error and can\'t continue`);
            log('\nError:\n');
            log(m, '\n\n');
            log('\nMeta debug info:\n');
            // log(util.logVersion())
            log('');
        }
    }
    process.exit(1);
};
