import BaseTrigger from 'src/triggers/BaseTrigger'
import BasePlugin from 'src/plugins/BasePlugin'
import { IAdvice } from 'src/interfaces';
import Plugins from 'src/database/models/plugins';
import SlackPlugin from 'src/plugins/slack';
import TelegramPlugin from 'src/plugins/telegram';


interface IPlugins {
  [exchangeSymbol: string]: BasePlugin<any>[]
}


export default class PluginsManager {
  private readonly plugins: IPlugins = {}
  private static readonly instance = new PluginsManager()


  public async loadPlugins () {
    const plugins = await Plugins.findAll({ where: { isActive: true }})
    plugins.forEach(p => this.registerPlugin(p))
  }


  public onTrigger (trigger: BaseTrigger, advice: IAdvice, price?: number, amount?: number) {
    const triggers = this.plugins[trigger.getUID()] || []
    triggers.forEach(t => t.onTriggered(trigger, advice, price, amount))
  }


  public registerPlugin (p: Plugins) {
    const plugin = this.getPlugin(p)
    if (!plugin) return

    const userplugins = this.plugins[p.uid] || []
    userplugins.push(plugin)
    this.plugins[p.uid] = userplugins
  }


  private getPlugin (plugin: Plugins) {
    if (plugin.kind === 'slack') return new SlackPlugin(plugin, JSON.parse(plugin.config))
    if (plugin.kind === 'telegram') return new TelegramPlugin(plugin, JSON.parse(plugin.config))
  }


  static getInstance () {
    return PluginsManager.instance
  }
}
