import * as _ from 'underscore'
import * as Telegram from 'node-telegram-bot-api'

import { IAdvice } from 'src/interfaces'
import log from '../utils/log'
import Plugin from './Plugin'
import BaseTrigger from 'src/triggers/BaseTrigger';



interface ITelegramOptions {
  token: string
  sendMessageOnStart: boolean
  channel: string
  muteSoft: boolean
}


export default class TelegramPlugin extends Plugin<ITelegramOptions> {
  public readonly name = 'Telegram'
  public readonly description = 'Sends notifications to a Telegram bot.'
  public readonly version = 1

  private bot: Telegram
  private chatId: string


  constructor (uid: string, options?: ITelegramOptions) {
    super(uid, options)

    this.bot = new Telegram(options.token, { polling: true })
    this.bot.sendMessage(this.chatId, 'I\'m now connected to the trading server!')
  }


  onTriggered (trigger: BaseTrigger, advice: IAdvice, price?: number) {
    const message = `${trigger.name} triggered! and adviced to ${advice} ` +
      `on ${trigger.getExchange()} ${trigger.getSymbol()}! Current price is ${price}`

    this.bot.sendMessage(this.chatId, message)
  }
}
