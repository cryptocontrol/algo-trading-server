import * as _ from 'underscore'
import * as Telegram from 'node-telegram-bot-api'

import { IAdvice } from 'src/interfaces'
import BasePlugin from './BasePlugin'
import BaseTrigger from 'src/triggers/BaseTrigger'
import Plugins from 'src/database/models/plugins';



interface ITelegramOptions {
  token: string
  chatId?: string
}


export default class TelegramPlugin extends BasePlugin<ITelegramOptions> {
  public readonly name = 'Telegram'
  public readonly description = 'Sends notifications to a Telegram bot.'
  public readonly version = 1

  private bot: Telegram
  private chatId?: string


  constructor (pluginDB: Plugins, options?: ITelegramOptions) {
    super(pluginDB, pluginDB.uid, options)

    this.bot = new Telegram(options.token, { polling: true })
    this.chatId = options.chatId

    if (this.chatId) this.bot.sendMessage(this.chatId, 'I\'m now connected to the trading server!')

    this.bot.onText(/(.+)/, msg => {
      this.bot.sendMessage(msg.chat.id, 'Hello! your chat id is: ' + msg.chat.id)
    })
  }


  onTriggered (trigger: BaseTrigger, advice: IAdvice, price?: number, amount?: number) {
    const message = `${trigger.name} triggered! and adviced to ${advice} ` +
      `on ${trigger.getExchange()} \`${trigger.getSymbol()}\` for a volume of ${amount}! ` +
      `Current price is \`${price}\``

    this.bot.sendMessage(this.chatId, message)
  }
}
