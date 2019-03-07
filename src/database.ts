const DB = require('node-json-db')


const apiKeysDB = new DB("./storage/apikeys", true, false);
const triggersDB = new DB("./storage/triggers", true, false);


export const writeApiKeys = async ( apiKey, secret, exchange) => {
  const newData = { [exchange]: { apiKey, secret } }
  apiKeysDB.push("exchangeDetails", newData, false)
}


export const addTriggers = async (userId: string, symbol: string, exchange: string, strategy: string, params: string[]) => {
  const trigger = {
    [userId]: [{ exchange, symbol, strategy, params }]
  }

  triggersDB.push("triggers", trigger, false)
}


export const deleteTriggers = async (userId) => await triggersDB.delete(`/${userId}`)
export const getSpecificTriggers = async (userId) =>  await triggersDB.getData(`/${userId}`)
export const getTriggers = async () => await triggersDB.getData("/binance")
export const readDetails = async () => apiKeysDB.getData("/")
