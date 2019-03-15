import * as _ from 'underscore'

import UserExchanges from 'src/database/models/userexchanges'
import { IAppRequest } from 'src/interfaces'



/**
 * Set the API key for an exchange for the logged in user
 */
export const setAPIKey = async (req: IAppRequest, res, next) => {
  try {
    // find or update logic
    const found = await UserExchanges.findOne({
      where: {
        uid: req.uid,
        exchange: req.params.exchange
      }
    })

    if (found) {
      found.apiKey = req.body.key
      found.apiSecret = req.body.secret
      found.apiPassword = req.body.pasword
      await found.save()
      return res.json(found)
    }

    const row = new UserExchanges({
      uid: req.uid,
      exchange: req.params.exchange,
      apiKey: req.body.key,
      apiSecret: req.body.secret,
      apiPassword: req.body.password
    })

    await row.save()
    res.json(row)
  } catch (e) {
    next(e)
  }
}
