import * as _ from 'underscore'

import Advices from '../../database/models/advices'



/**
 * get all advices for a user
 */
export const getAdvices = async (uid: string) => {
  const advices = await Advices.findAll({ where: { uid } })
  return advices
}
