import server from './server'
import Binance from './exchanges/Binance'


// start all the exchanges listeners
const binance = new Binance()
binance.startListening()

// start the servers
const port = process.env.PORT || 8080
server.listen(port, () => console.log('listening on port', port))
