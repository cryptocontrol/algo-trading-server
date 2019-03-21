import * as _ from 'underscore'

import PluginsManager from 'src/managers/PluginsManager'
import Plugins from 'src/database/models/plugins'


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
