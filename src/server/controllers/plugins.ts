
import * as _ from 'underscore'
import PluginsManager from 'src/managers/PluginsManager'
import Plugins from 'src/database/models/plugins'
import TelegramPlugin from 'src/plugins/TelegramPlugin';

/**
 * create a new plugin for a user
 */
export const register = async (uid: string, kind: string, config: any) => {
  const plugin = new Plugins({
    uid,
    kind,
    config: JSON.stringify(config),
    isActive: true,
    isDeleted: false,
  })

  await plugin.save()

  // once the plugin is register, we start tracking it in our DB
  PluginsManager.getInstance().registerPlugin(plugin)

  return plugin
}


export const update = async (uid: string, id: string, config: any) => {
  const plugin = await Plugins.findOne({ where: { uid, id } })
  if (!plugin) throw new Error('plugin not found')

  plugin.config = JSON.stringify(config)
  plugin.save()

  PluginsManager.getInstance().registerPlugin(plugin)

  return plugin
}


/**
 * get all existing plugins for a user
 */
export const fetchAll = async (uid: string) => await Plugins.findAll({ where: { uid, isDeleted: false } })


/**
 * Delete a specific plugin
 */
export const remove = async (uid: string, id: number) => {
  const plugin = await Plugins.findOne({ where: { uid, id } })
  if (plugin) plugin.destroy()

  // todo set the delete flag as true
}


/**
 * Enable / Disable a plugin
 */
export const enableDisable = async (uid: string, id: number, action: 'enable' | 'disable') => {
  const plugin = await Plugins.findOne({ where: { uid, id } })
  if (!plugin) throw new Error('plugin not found')
  if (!action) throw new Error('missing action')

  if (action === 'enable') plugin.isActive = true
  if (action === 'disable') plugin.isActive = false

  plugin.save()
  return plugin
}


/**
 * To set telegram params
 */
export const setConfig = async (uid: string, id: string, config: object) => {
  const plugin = await Plugins.findOne({ where: { uid, id, isActive: true } })
  if (!plugin) throw new Error('plugin not found')

  plugin.config = JSON.stringify(config)
  plugin.save()

  return plugin
}
