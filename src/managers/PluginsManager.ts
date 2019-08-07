import * as _ from 'underscore'

import { IAdvice } from '../interfaces'
import BasePlugin from '../plugins/BasePlugin'
import BaseTrigger from '../triggers/BaseTrigger'
import Plugins from '../database/models/plugins'
import SlackPlugin from '../plugins/slack'
import TelegramPlugin from '../plugins/telegram'


interface IPlugins {
  [uid: string]: {
    [pluginKind: string]: BasePlugin<any>
  }
}


export default class PluginsManager {
  private readonly plugins: IPlugins = {}
  private static readonly instance = new PluginsManager()


  public async loadPlugins () {
    const plugins = await Plugins.findAll({ where: { isActive: true }})
    plugins.forEach(p => this.registerPlugin(p))
  }


  public onAdvice (trigger: BaseTrigger, advice: IAdvice, price?: number, amount?: number) {
    const plugins = this.plugins[trigger.getUID()] || []

    const pluginKeys = _.keys(plugins)
    pluginKeys.forEach(key => plugins[key].onTriggered(trigger, advice, price, amount))
  }


  public onError (error: Error, trigger: BaseTrigger, advice: IAdvice, price?: number, amount?: number) {
    const plugins = this.plugins[trigger.getUID()] || []

    const pluginKeys = _.keys(plugins)
    pluginKeys.forEach(key => plugins[key].onError(error, trigger, advice, price, amount))
  }


  public registerPlugin (p: Plugins) {
    const plugin = this.getPlugin(p)
    if (!plugin) return

    const userplugins = this.plugins[p.uid] || {}

    // delete the old plugin (if it exists)
    if (userplugins[plugin.name]) {
      userplugins[plugin.name].kill()
      delete userplugins[plugin.name]
    }

    // added plugins
    userplugins[plugin.name] = plugin
    this.plugins[p.uid] = userplugins
  }


  private getPlugin (plugin: Plugins) {
    if (plugin.kind === 'slack') return new SlackPlugin(plugin)
    if (plugin.kind === 'telegram') return new TelegramPlugin(plugin)
  }


  static getInstance () {
    return PluginsManager.instance
  }
}
