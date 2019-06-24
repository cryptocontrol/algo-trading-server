import * as _ from 'underscore'

import Triggers from 'src/database/models/triggers'
import TriggerManger from 'src/managers/TriggerManager'


/**
 * create a new trigger for a user
 */
export const createTrigger = async (uid: string, exchange: string, symbol: string, kind: string, params: any) => {
  const { price, volume, orderId, ...rest } = params
  const trigger = new Triggers({
    uid,
    symbol,
    exchange,
    kind,
    orderId,
    isActive: true,
    targetVolume: volume,
    targetPrice: price,
    params: JSON.stringify(rest)
  })

  await trigger.save()

  // once the trigger is created, we start tracking it in our DB
  TriggerManger.getInstance().addTrigger(trigger)

  return trigger
}


/**
 * get all existing triggers for a user
 */
export const getTriggers = async (uid: string) => {
  const triggers = await Triggers.findAll({ where: { uid, isActive: true } })
  return triggers
}


/**
 * Delete a specific trigger
 */
export const deleteTrigger = async (uid: string, id: number) => {
  const trigger = await Triggers.findOne({ where: { uid, id } })
  if (trigger) {
    TriggerManger.getInstance().removeTrigger(trigger)

    trigger.isActive = false
    trigger.save()
  }
}
