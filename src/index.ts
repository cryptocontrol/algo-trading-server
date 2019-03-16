/**
 * This is the starting point of the application. Here we initialize the database and start the server..
 */
import server from './server'
import * as Iguana from './iguana'
import * as Database from './database'
import log from './utils/log';

// init the database
Database.init()

// start iguana
Iguana.start()

// start the servers
const port = process.env.PORT || 8080
server.listen(port, () => log.info('listening on port', port))
