import * as _ from 'underscore'
const DB = require('node-json-db')


const apiKeysDB = new DB("./storage/apikeys", true, false)
const triggersDB = new DB("./storage/triggers", true, false)

export interface IAPIKey {
  exchange: string
  uid: string
  params: {
    [key: string]: string
  }
}


// todo: check for params
export const addApiKeys = async (uid, exchange, params) => apiKeysDB.push(`/${exchange}/${uid}`, params, true)



export const addTriggers = async (uid: string, symbol: string, exchange: string, strategy: string, params: string[]) => {
  const trigger = {
    [uid]: [{ exchange, symbol, strategy, params }]
  }

  triggersDB.push("triggers", trigger, false)
}


export const deleteTriggers = async (uid: string) => await triggersDB.delete(`/${uid}`)
export const getSpecificTriggers = async (uid: string) =>  await triggersDB.getData(`/${uid}`)
export const getTriggers = async () => await triggersDB.getData("/binance")


/**
 * Get the API keys for the given user
 * @param uid2 the user id
 */
export const getKeysForUser = async (uid: string) => {
  const data = await apiKeysDB.getData('/')

  const results = {}

  _.mapObject(data, (val, exchange) => {
    for (let uid2 of _.keys(val)) {
      if (uid2 === uid) {
        results[exchange] = val[uid2]
        return
      }
    }
  })

  return results
}


/**
 * Get the API keys for the given exchange
 * @param exchange the exchange id
 */
export const getKeysForExchange = async (exchange: string): Promise<IAPIKey[]> => {
  return await apiKeysDB.getData(`/${exchange}`)
}
