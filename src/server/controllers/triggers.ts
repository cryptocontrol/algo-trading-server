import * as _ from 'underscore'

import Triggers from 'src/database/models/triggers'


/**
 * create a new trigger for a user
 */
export const createTrigger = async (uid: string, exchange: string, symbol: string, kind: string, params: any) => {
  const { price, ...rest } = params
  const trigger = new Triggers({
    uid,
    symbol,
    exchange,
    kind,
    targetPrice: price,
    params: JSON.stringify(rest)
  })

  await trigger.save()
  return trigger
}


/**
 * get all existing triggers for a user
 */
export const getTriggers = async (uid: string) => {
  const triggers = await Triggers.findAll({ where: { uid } })
  return triggers
}


/**
 * Delete a specific trigger
 */
export const deleteTrigger = async (uid: string, id: number) => {
  const triggers = await Triggers.findOne({ where: { uid, id } })
  if (triggers) triggers.destroy()
}
