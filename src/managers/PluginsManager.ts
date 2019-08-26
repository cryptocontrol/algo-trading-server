import * as _ from 'underscore'

import { IAdvice } from '../interfaces'
import BasePlugin from '../plugins/BasePlugin'
import BaseStrategy from 'src/strategies/BaseStrategy'
import BaseTrigger from '../triggers/BaseTrigger'
import Plugins from '../database/models/plugins'
import SlackPlugin from '../plugins/SlackPlugin'
import TelegramPlugin from '../plugins/TelegramPlugin'
import Advices from 'src/database/models/advices';


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


  /**
   * Registers a plugin.
   *
   * @param p
   */
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


  public onAdvice (from: string, advice: Advices) {
    this.getUserPlugins(advice.uid).forEach(p => p.onAdvice(from, advice))
  }


  public onError (error: Error, from: string, advice: Advices) {
    this.getUserPlugins(advice.uid).forEach(p => p.onError(error, from, advice))
  }


  /**
   * Helper function to get all the plugins for a given user
   *
   * @param uid the user id
   */
  private getUserPlugins (uid: string): BasePlugin<any>[] {
    const plugins = this.plugins[uid] || []
    return _.keys(plugins).map(key => plugins[key])
  }


  static getInstance () {
    return PluginsManager.instance
  }
}
