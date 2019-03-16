/**
 * This is the starting point of the application. Here we initialize the database and start the server..
 */
import server from './server'
import Binance from './exchanges/Binance'
import * as Database from './database'

// init the database
Database.init()

// start all the exchanges listeners
// const binance = new Binance()
// binance.startListening()

// start the servers
const port = process.env.PORT || 8080
server.listen(port, () => console.log('listening on port', port))
