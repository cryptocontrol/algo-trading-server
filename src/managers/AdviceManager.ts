import * as ccxt from 'ccxt'

import { IAdvice } from '../interfaces'
import Advices from '../database/models/advices'
import BaseTrigger from '../triggers/BaseTrigger'
import PluginsManager from './PluginsManager'
import UserExchanges from '../database/models/userexchanges'
import BaseStrategy, { IAccount } from '../strategies/BaseStrategy'


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


  public async addAdviceFromTrigger (t: BaseTrigger, advice: IAdvice, price: number, amount: number, extras: any) {
    // create and save the advice into the DB
    const adviceDB = new Advices({
      advice,
      amount,
      exchange: t.getExchange(),
      mode: 'realtime',
      price,
      symbol: t.getSymbol(),
      trigger_id: t.getDBId(),
      uid: t.getUID()
    })
    await adviceDB.save()

    this.executeAdvice(t.toString(), adviceDB, extras)
  }


  public async addAdviceFromStrategy (s: BaseStrategy<any>, account: IAccount, advice: IAdvice, price: number, volume: number, extras: any) {
    // create and save the advice into the DB
    const adviceDB = new Advices({
      advice,
      // exchange: s.getExchange(),
      exchange: account.exchange,
      mode: 'realtime',
      price,
      strategy_id: s.getDBId(),
      symbol: s.getSymbol(),
      uid: s.getUID(),
      volume
    })
    await adviceDB.save()

    this.executeAdvice(s.toString(), adviceDB, extras)
  }


  private async executeAdvice (from: string, adviceDB: Advices, extras?: any) {
    // notify all the plugins about the advice made...
    PluginsManager.getInstance().onAdvice(from, adviceDB)

    // find the user's credentials and execute the advice...
    await UserExchanges.findOne({ where: { uid: adviceDB.uid, exchange: adviceDB.exchange } })
    .then(async data => {
      // create the exchange instance
      // todo: decrypt the keys
      const exchange: ccxt.Exchange = new ccxt[adviceDB.exchange]({ apiKey: data.apiKey, secret: data.apiSecret, password: data.apiPassword })

      /* execute the advice */

      try {
        // market buy
        if (adviceDB.advice === 'market-buy') {
          const res = await exchange.createOrder(adviceDB.symbol, 'market', 'buy', adviceDB.volume)

          adviceDB.order_id = res.info.orderId
          adviceDB.save()
        }

        // market sell
        if (adviceDB.advice === 'market-sell') {
          const res = await exchange.createOrder(adviceDB.symbol, 'market', 'sell', adviceDB.volume)

          adviceDB.order_id = res.info.orderId
          adviceDB.save()
        }

        // limit sell
        if (adviceDB.advice === 'limit-sell') {
          const res = await exchange.createOrder(adviceDB.symbol, 'limit', 'sell', adviceDB.volume, adviceDB.price)

          adviceDB.order_id = res.info.orderId
          adviceDB.save()
        }

        // limit buy
        if (adviceDB.advice === 'limit-buy') {
          const res = await exchange.createOrder(adviceDB.symbol, 'limit', 'buy', adviceDB.volume, adviceDB.price)

          adviceDB.order_id = res.info.orderId
          adviceDB.save()
        }

        // cancel order
        if (adviceDB.advice === 'cancel-order') {
          await exchange.cancelOrder(extras.orderId, adviceDB.symbol)
          adviceDB.order_id = extras.orderId
          adviceDB.save()
        }

        //TODO: Add short & long
      } catch (e) {
        adviceDB.error_msg = e.message
        adviceDB.save()
        // TODO: if we encounter some kind of error we notify the plugins about it
        PluginsManager.getInstance().onError(e, from, adviceDB)
      }
    })
  }


  static getInstance () {
    return AdviceManager.instance
  }
}
