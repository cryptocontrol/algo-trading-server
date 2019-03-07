import server from './server'
import BinanceInterface from './BinanceInterface'


const binance = new BinanceInterface()
// binance.startListening()

const port = process.env.PORT || 8080
server.listen(port, () => console.log('listening on port', port))
