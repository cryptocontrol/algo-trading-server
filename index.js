/**
 * Entry Script
 */
require('dotenv').config()

process.env.ROOT_PATH = __dirname


if (process.env.NODE_ENV == 'production' || process.env.NODE_ENV == 'test') {
  require('./dist')
  return
}

require('./src')
