const JsonDB = require('node-json-db');


const apiKeysDB = new JsonDB("./Storage/apikeys", true, false);
const triggersDB = new JsonDB("./Storage/triggers", true, false);


export const writeApiKeys = async ( apiKey, secret, exchange) => {
  var newData = {
    [exchange]:{
      apiKey: apiKey,
      secret: secret
    }
  }
  apiKeysDB.push("exchangeDetails", newData, false)
}

export const addTriggers = async ( userId, symbol, exchangeId, strategy, stopLossPrice, takeProfitPrice) => {
  var trigger = {
    [userId]:[{
      exchangeId: exchangeId,
      symbol: symbol,
      strategy: strategy,
      params:{
        stopLossPrice : stopLossPrice,
        takeProfitPrice : takeProfitPrice
      }
    }]
  }
  triggersDB.push("triggers", trigger, false)
}

export const getTriggers = async () => {
  let details = await triggersDB.getData("/binance")
  return details
}

export const getSpecificTriggers = async (userId) => {
  try {
    let details = await triggersDB.getData(`/${userId}`)
    return details
  } catch (error) {
    console.log(error)
  }
}

export const deleteTriggers = async ( userId ) => {
  try{
    let details = await triggersDB.delete(`/${userId}`)
    return { sucess: true }
  } catch (error) {
    console.log(error)
  }
}

export const readDetails = async () => {
  try {
    let details = apiKeysDB.getData("/")
    console.log(details)
    return details
  } catch (error) {
    console.log(error)
  }
}
