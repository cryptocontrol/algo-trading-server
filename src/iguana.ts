/**
 * This is the starting point of the application. Here we initialize the database and start the server..
 */
import TriggerManger from './managers/TriggerManager'
import PluginsManager from './managers/PluginsManager'



export const start = () => {
  // connect all plugins \

  // init plugins
  const pluginManager = PluginsManager.getInstance()
  pluginManager.loadPlugins()

  // Create the budfox manager and add budfoxes
  const manager = TriggerManger.getInstance()
  manager.loadTriggers()
}
