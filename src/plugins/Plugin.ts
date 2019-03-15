/**
 * A plugin is something that integrates with the trader; It can be used
 * to create custom functionality that a user would like to create.
 */
export default abstract class Plugin {
  /**
   * Called when a given user wants to implement this plugin
   *
   * @param uid     The uid of the user
   * @param options An object of options passed from the user
   */
  abstract setup (uid: string, options?: any): void


  abstract onAdvice (uid: string, exchange: string, symbol: string, advice: string, price?: number): void
}
