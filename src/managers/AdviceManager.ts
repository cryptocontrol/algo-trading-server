import * as ccxt from 'ccxt'

import { IAdvice } from 'src/interfaces'
import Advices from 'src/database/models/advices'
import BaseTrigger from 'src/triggers/BaseTrigger'
import PluginsManager from './PluginsManager'
import UserExchanges from 'src/database/models/userexchanges'


/**
 * The advice manager is where all the advices get executed. An advice is an action for a trade or some kind of action.
 * When an advice is added (from a trigger/strategy that makes an advice) a couple of things happen.
 *
 * - An entry gets added into the DB
 * - All the plugins get notified about the advice
 * - according the advice (buy/sell etc..) an order is created and executed
 *
 * This class is a singleton.
 */
export default class AdviceManager {
  private static readonly instance = new AdviceManager()


  public async addAdvice (t: BaseTrigger, advice: IAdvice, price: number, amount: number) {
    // create and save the advice into the DB
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
    await adviceDB.save()

    // notify all the plugins about the advice made...
    PluginsManager.getInstance().onAdvice(t, advice, price, amount)

    // find the user's credentials and execute the advice...
    await UserExchanges.findOne({ where: { uid: t.getUID(), exchange: t.getExchange() } })
    .then(async data => {
      // create the exchange instance
      const exchange = new ccxt[t.getExchange()]({ apiKey: data.apiKey, secret: data.apiSecret, password: data.apiPassword })

      /* execute the advice */

      try {
        // market buy
        if (adviceDB.advice === 'market-buy') await exchange.createOrder(t.getSymbol(), 'market', 'buy', amount)

        // market sell
        if (adviceDB.advice === 'market-sell') await exchange.createOrder(t.getSymbol(), 'market', 'sell', amount)

        // limit sell
        if (adviceDB.advice === 'limit-sell') await exchange.createOrder(t.getSymbol(), 'limit', 'sell', amount, price)

        // limit buy
        if (adviceDB.advice === 'limit-buy') await exchange.createOrder(t.getSymbol(), 'limit', 'buy', amount, price)
      } catch (e) {
        // TODO: if we encounter some kind of error; we notify the plugins about it
        PluginsManager.getInstance().onError(e, t, advice, price, amount)
      }
    })
  }


  static getInstance () {
    return AdviceManager.instance
  }
}
