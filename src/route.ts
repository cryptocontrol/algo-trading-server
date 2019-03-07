import * as Controller from './controllers/database'
import * as express from 'express'

const app = express()
const port = 8080

app.use(express.static('public'));


app.post('/apikeys', function(req, res) {
  let apiKey = req.query.apiKey;
  let secret = req.query.secret;
  let exchange = req.query.exchange

  Controller.writeApiKeys(apiKey, secret, exchange)
  res.send({ sucess: true })
});


app.get('/getData', async function(req, res) {
  let localStorage = await Controller.readDetails()
  res.send(localStorage)
})


interface ITrigger {
  userId: string
  symbol: string
  exchangeId: string // from ccxt
  strategy: 'stop-loss' | 'take-profit'
  params: any[]
}


// create a new trigger for a user
app.post('/trigger', function ( req, res) {
  let userId = req.query.userId
  let symbol = req.query.symbol
  let exchangeId = req.query.exchangeId
  let strategy = req.query.strategy
  let stopLossPrice = req.query.stopLossPrice
  let takeProfitPrice = req.query.takeProfitPrice

  Controller.addTriggers( userId, symbol, exchangeId, strategy, stopLossPrice, takeProfitPrice)
  res.send({ sucess: true })
})


// get all existing triggers for a user
app.get('/getALLTriggers', async function ( req, res ) {
  let triggerDetails = await Controller.getTriggers()
  res.send(triggerDetails)
})


app.get('/getSpecificTriggers', async function ( req, res ){
  let userId = req.query.userId
  let triggerDetails = await Controller.getSpecificTriggers(userId)
  res.send(triggerDetails)
})


// delete a trigger for a user
app.get('/deleteTriggers', async function ( req, res ) {
  let userId = req.query.userId
  let deleteTriggers = await Controller.deleteTriggers(userId)
  res.send('deleted sucessfully')
})


app.listen(port, function() {
  console.log('server up and running at port:', port);
});
