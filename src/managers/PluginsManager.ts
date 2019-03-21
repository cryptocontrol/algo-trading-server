import * as _ from 'underscore'

import { IAdvice } from 'src/interfaces'
import BasePlugin from 'src/plugins/BasePlugin'
import BaseTrigger from 'src/triggers/BaseTrigger'
import Plugins from 'src/database/models/plugins'
import SlackPlugin from 'src/plugins/slack'
import TelegramPlugin from 'src/plugins/telegram'


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


  public onTrigger (trigger: BaseTrigger, advice: IAdvice, price?: number, amount?: number) {
    const plugins = this.plugins[trigger.getUID()] || []

    const pluginKeys = _.keys(plugins)
    pluginKeys.forEach(key => plugins[key].onTriggered(trigger, advice, price, amount))
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
