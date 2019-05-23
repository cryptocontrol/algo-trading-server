import * as ccxt from 'ccxt'

import BaseTrigger from 'src/triggers/BaseTrigger'
import Advices from 'src/database/models/advices'
import UserExchanges from 'src/database/models/userexchanges'
import PluginsManager from './PluginsManager'
import { IAdvice } from 'src/interfaces'


export default class AdviceManager {
  private static readonly instance = new AdviceManager()


  public async addAdvice (t: BaseTrigger, advice: IAdvice, price: number, amount: number) {
    // whenever a trigger executes
    const adviceDB = new Advices({
      uid: t.getUID(),
      symbol: t.getSymbol(),
      exchange: t.getExchange(),
      advice,
      price,
      mode: 'realtime',
      volume: amount,
      trigger_id: t.getDBId()
    })

    // save advice into the DB
    await adviceDB.save()

    await UserExchanges.findOne({ where: { uid: t.getUID(), exchange: t.getExchange() } })
    .then(async data => {
      // create the exchange instance
      const exchange = new ccxt[t.getExchange()]({
        apiKey: data.apiKey,
        apiSecret: data.apiSecret,
        apiPassword: data.apiPassword
      })

      /* execute the advice */

      try {
        // market buy
        if (adviceDB.advice === 'market-buy') await exchange.createOrder(t.getSymbol(), 'market', 'buy', amount, price)

        // market sell
        if (adviceDB.advice === 'market-sell') await exchange.createOrder(t.getSymbol(), 'market', 'sell', amount, price)

        // limit sell
        if (adviceDB.advice === 'limit-sell') await exchange.createOrder(t.getSymbol(), 'limit', 'sell', amount, price)

        // limit buy
        if (adviceDB.advice === 'limit-buy') await exchange.createOrder(t.getSymbol(), 'limit', 'buy', amount, price)
      } catch (e) {
        // TODO: if we encounter some kind of error; we notify the bots
        console.log(e)
        PluginsManager.getInstance().onError(e, t, advice, price, amount)
      }
    })
  }


  static getInstance () {
    return AdviceManager.instance
  }
}
