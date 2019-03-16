import * as _ from 'underscore'

import Triggers from 'src/database/models/triggers'


/**
 * create a new trigger for a user
 */
export const createTrigger = async (uid: string, exchange: string, symbol: string, strategy: string, params: any) => {
  const trigger = new Triggers({
    uid,
    symbol,
    exchange,
    strategy,
    price: params.price,
    params: JSON.stringify(params)
  })

  await trigger.save()
  return trigger
}


/**
 * get all existing triggers for a user
 */
export const getTriggers = async (uid: string) => {
  const triggers = await Triggers.find({ where: { uid } })
  return triggers
}


/**
 * Delete a specific trigger
 */
export const deleteTrigger = async (uid: string, id: number) => {
  const triggers = await Triggers.findOne({ where: { uid, id } })
  if (triggers) triggers.destroy()
}
