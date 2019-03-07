const DB = require('node-json-db')


const apiKeysDB = new DB("./storage/apikeys", true, false)
const triggersDB = new DB("./storage/triggers", true, false)


export const addApiKeys = async (uid, exchange, keys) => apiKeysDB.push(`/keys[]`, { exchange, uid, keys }, true)



export const addTriggers = async (uid: string, symbol: string, exchange: string, strategy: string, params: string[]) => {
  const trigger = {
    [uid]: [{ exchange, symbol, strategy, params }]
  }

  triggersDB.push("triggers", trigger, false)
}


export const deleteTriggers = async (userId: string) => await triggersDB.delete(`/${userId}`)
export const getSpecificTriggers = async (userId: string) =>  await triggersDB.getData(`/${userId}`)
export const getTriggers = async () => await triggersDB.getData("/binance")
export const getKeys = async (userId: string) => apiKeysDB.getData(`/${userId}`)
