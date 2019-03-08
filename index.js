/**
 * Entry Script
 */
require('dotenv').config()

process.env.ROOT_PATH = __dirname


if (process.env.NODE_ENV == 'production' || process.env.NODE_ENV == 'test') {
  if (!process.env.SERVER_SECRET || process.env.SERVER_SECRET === 'secret_keyboard_cat') {
    console.error('you need to set the SERVER_SECRET environment variable to something secretive')
    return process.exit(1)
  }

  require('./dist')
  return
}

require('./src')
