/**
 * This is the starting point of the application. Here we initialize the database and start the server..
 */
import TriggerManger from './managers/TriggerManager'



export const start = () => {
  // connect all plugins \

  // Create the budfox manager and add budfoxes
  const manager = TriggerManger.getInstance()
  manager.loadTriggers()
}
