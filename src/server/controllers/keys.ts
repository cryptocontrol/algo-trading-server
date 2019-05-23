import * as ccxt from 'ccxt'
import * as _ from 'underscore'


import UserExchanges from 'src/database/models/userexchanges'


/**
 * Set the API key for an exchange for the logged in user
 */
export const setAPIKey = async (uid: string, exchange: string, data: any) => {
  // first authenticate with the exchange and see if the API key works
  const ccxtExchange = new ccxt[exchange]({
    apiKey: data.key,
    secret: data.secret,
    password: data.password,
    useServerTime: true,
    enableRateLimit: true
  })

  // Make a sample request to fetch the user's balance; If this fn returns successfully
  // then we save the API keys and continue
  await ccxtExchange.fetchBalance()

  // find or update logic
  const found = await UserExchanges.findOne({ where: { uid, exchange } })

  if (found) {
    found.apiKey = data.key
    found.apiSecret = data.secret
    found.apiPassword = data.password
    await found.save()
    return found
  }

  const row = new UserExchanges({
    uid,
    exchange,
    apiKey: data.key,
    apiSecret: data.secret,
    apiPassword: data.password
  })

  await row.save()
  return row
}


/**
 * Get all the API keys saved for the logged in user
 */
export const getAllUserApiKeys = async (uid: string) => {
  return await UserExchanges.findAll({ where: { uid } })
  .then(data => {

    // hide the secret keys
    const parsedKeys = data.map(row => {
      const json = row.toJSON()
      return _.mapObject(json, (val, key) => {
        if (key !== 'apiSecret' && key !== 'apiPassword' || !val) return val
        return val.replace(/./gi, '*')
      })
    })

    return parsedKeys
  })
}


export const deleteApiKey = async (uid: string, exchange: string) => {
  return await UserExchanges.destroy({ where: { uid, exchange }})
}
