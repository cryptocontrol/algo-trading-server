const DB = require('node-json-db')
import * as _ from 'underscore'
import * as hat from 'hat'


const apiKeysDB = new DB('./storage/apikeys', true, false)
const triggersDB = new DB('./storage/triggers', true, false)


/**
 * Adds the api key for the given user and exchange
 *
 * @param uid the uid of the user
 * @param ex the exchange
 * @param params the api key details
 */
export const addApiKeys = async (uid, ex, params) => apiKeysDB.push(`/${ex}/${uid}`, params, true)


/**
 * Adds a new trigger into the DB
 *
 * @param uid the uid of the user
 * @param sym the symbol being traded
 * @param ex the exchange
 * @param strategy the strategy (stop-loss, trailing-stop-loss etc...)
 * @param params the params for the strategy
 */
export const addTrigger = async (uid: string, sym: string, ex: string, strategy: string, params: string[]) => {
  const trigger = {
    strategy,
    params,
    uid,
    addedAt: (new Date()).getTime(),
    active: true
  }

  triggersDB.push(`/${ex}/${sym}/${hat()}`, trigger, false)
  return trigger
}


/**
 * Get all the active triggers for the given user
 * @param uid the user id
 */
export const getTriggersForUser = async (uid: string) => {
  const data = await triggersDB.getData('/')

  const results: any[] = []

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
 * Gets a specific trigger
 *
 * @param ex the exchange id
 * @param sym the symbol
 * @param id the id of the trigger
 */
export const getTrigger = async (ex: string, sym: string, id: string) => await triggersDB.getData(`/${ex}/${sym}/${id}`)


/**
 * Gets the triggers for the given symbol and exchange
 * @param ex the exchange id
 * @param sym the symbol
 */
export const getTriggersForSymbol = async (ex: string, sym: string) => await triggersDB.getData(`/${ex}/${sym}`)


/**
 * Get the API keys for the given exchange
 *
 * @param ex the exchange id
 */
export const getKeysForExchange = async (ex: string) => await apiKeysDB.getData(`/${ex}`)


/**
 * Delete the API keys for the given exchange, for the given user
 *
 * @param uid the user id
 * @param ex the exchange id
 */
export const deleteApiKey = async (uid: string, ex: string) => await apiKeysDB.delete(`/${ex}/${uid}`)


/**
 * Delete the trigger with the given id
 *
 * @param ex the exchange id
 * @param sym the symbol
 * @param id the id of the trigger
 */
export const deleteTrigger = async (ex: string, sym: string, id: string) => await triggersDB.delete(`/${ex}/${sym}/${id}`)
