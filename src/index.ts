import server from './server'
import Binance from './exchanges/Binance'


const binance = new Binance()
binance.startListening()

const port = process.env.PORT || 8080
server.listen(port, () => console.log('listening on port', port))
