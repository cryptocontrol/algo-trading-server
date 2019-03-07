const DB = require('node-json-db')
import * as _ from 'underscore'
import * as hat from 'hat'


const apiKeysDB = new DB('./storage/apikeys', true, false)
const triggersDB = new DB('./storage/triggers', true, false)


export interface IAPIKey {
  exchange: string
  uid: string
  params: {
    [key: string]: string
  }
}


// todo: check for params
export const addApiKeys = async (uid, exchange, params) => apiKeysDB.push(`/${exchange}/${uid}`, params, true)


export const addTrigger = async (uid: string, symbol: string, exchange: string, strategy: string, params: string[]) => {
  const trigger = {
    strategy,
    params,
    uid,
    addedAt: (new Date()).getTime(),
    active: true
  }

  triggersDB.push(`/${exchange}/${symbol}/${hat()}`, trigger, false)
  return trigger
}


export const deleteTriggers = async (uid: string) => await triggersDB.delete(`/${uid}`)
export const getSpecificTriggers = async (uid: string) =>  await triggersDB.getData(`/${uid}`)


/**
 * Get all the active triggers for the given user
 * @param uid the user id
 */
export const getTriggersForUser = async (uid: string) => {
  const data = await triggersDB.getData('/')

  const results = []

  _.mapObject(data, (symbols, exchange) => {
    _.mapObject(symbols, (triggerIds, symbol) => {
      _.mapObject(triggerIds, (trigger, id) => {
        if (trigger.uid !== uid) return
        results.push({ id, trigger, symbol, exchange })
      })
    })
  })

  return results
}


/**
 * Get the API keys for the given user
 * @param uid the user id
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


/**
 * Delete the API keys for the given exchange
 * @param uid the user id
 * @param exchange the exchange id
 */
export const deleteApiKeys = async (uid: string, exchange: string) => await apiKeysDB.delete(`/${exchange}/${uid}`)
