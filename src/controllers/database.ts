const JsonDB = require('node-json-db');


const apiKeysDB = new JsonDB("./storage/apikeys", true, false);
const triggersDB = new JsonDB("./storage/triggers", true, false);


export const writeApiKeys = async ( apiKey, secret, exchange) => {
  const newData = {
    [exchange]:{
      apiKey: apiKey,
      secret: secret
    }
  }
  apiKeysDB.push("exchangeDetails", newData, false)
}


export const addTriggers = async ( userId, symbol, exchangeId, strategy, stopLossPrice, takeProfitPrice) => {
  const trigger = {
    [userId]:[{
      exchangeId: exchangeId,
      symbol: symbol,
      strategy: strategy,
      params: {
        stopLossPrice: stopLossPrice,
        takeProfitPrice : takeProfitPrice
      }
    }]
  }

  triggersDB.push("triggers", trigger, false)
}


export const deleteTriggers = async (userId) => await triggersDB.delete(`/${userId}`)
export const getSpecificTriggers = async (userId) =>  await triggersDB.getData(`/${userId}`)
export const getTriggers = async () => await triggersDB.getData("/binance")
export const readDetails = async () => apiKeysDB.getData("/")
