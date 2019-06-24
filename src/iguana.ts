/**
 * This is the starting point of the application. Here we initialize the database and
 * start the bot..
 */
import TriggerManger from './managers/TriggerManager'
import PluginsManager from './managers/PluginsManager'



export const start = () => {
  // connect all plugins \

  // init plugins
  const pluginManager = PluginsManager.getInstance()
  pluginManager.loadPlugins()

  // If there are any existing triggers, we load them right away; (new triggers will get added
  // by the express.js server)
  const manager = TriggerManger.getInstance()
  manager.loadTriggers()
}
