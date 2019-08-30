
import * as _ from 'underscore'
import PluginsManager from 'src/managers/PluginsManager'
import Plugins from 'src/database/models/plugins'
import TelegramPlugin from 'src/plugins/telegram';

/**
 * create a new plugin for a user
 */
export const regsiterPlugin = async (uid: string, kind: string, config: any) => {
  const plugin = new Plugins({
    uid,
    kind,
    config: JSON.stringify(config),
    isActive: true
  })

  await plugin.save()

  // once the plugin is register, we start tracking it in our DB
  PluginsManager.getInstance().registerPlugin(plugin)

  return plugin
}


export const updatePlugin = async (uid: string, id: string, config: any) => {
  const plugin = await Plugins.findOne({ where: { uid, id } })
  if (plugin) {
    plugin.config = JSON.stringify(config)
    plugin.save()

    PluginsManager.getInstance().registerPlugin(plugin)
  }
}


/**
 * get all existing plugins for a user
 */
export const getPlugins = async (uid: string) => {
  const plugins = await Plugins.findAll({ where: { uid } })
  return plugins
}


/**
 * Delete a specific plugin
 */
export const deleteplugin = async (uid: string, id: number) => {
  const plugin = await Plugins.findOne({ where: { uid, id } })
  if (plugin) plugin.destroy()
}

/**
 * Enable / Disable a plugin
 */
export const enableDisablePlugin = async (
  uid: string, id: string, action: 'enable' | 'disable') => {
  const plugin = await Plugins.findOne({ where: { uid, id } })

  if (!plugin) return // TODO: code on failure

  if (!action) throw new Error("Missing action in req body")

  if (action === 'enable') plugin.isActive = true

  if (action === 'disable') plugin.isActive = false

  plugin.save()

  PluginsManager.getInstance().registerPlugin(plugin)

  return plugin;
}

/**
 * To set telegram params
 */
export const setTelegramParams = async (
  uid: string, chatId: string) => {
  const plugin = await Plugins.findOne({
     where: { uid, kind: "telegram", isActive: true } })

  if (!plugin) return // TODO: code on failure

  const config = JSON.parse(plugin.config)

  plugin.config = JSON.stringify({
    ...config,
    chatId
  })

  plugin.save();

  PluginsManager.getInstance().registerPlugin(plugin)

  return plugin
}
