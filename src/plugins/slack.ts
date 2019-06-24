import * as _ from 'underscore'

import { IAdvice } from 'src/interfaces'
import BasePlugin from './BasePlugin'
import BaseTrigger from 'src/triggers/BaseTrigger'
import log from '../utils/log'
import Plugins from 'src/database/models/plugins'

const WebClient = require('@slack/client').WebClient


interface ISlackOptions {
  token: string
  sendMessageOnStart: boolean
  channel: string
  muteSoft: boolean
}


export default class SlackPlugin extends BasePlugin<ISlackOptions> {
  public readonly name = 'Slack'
  public readonly description = 'Sends notifications to slack channel.'
  public readonly version = 1

  private readonly slack: any


  constructor (pluginDB: Plugins) {
    super(pluginDB)
    this.slack = new WebClient(this.options.token)

    if (this.options.sendMessageOnStart){
      const body = this._createResponse('#439FE0', 'Gekko started!')
      this._send(body)
    } else log.debug('Skipping Send message on startup')
  }


  kill () {

  }


  onTriggerAdvice (trigger: BaseTrigger, advice: IAdvice, price?: number) {
    if (advice == 'soft' && this.options.muteSoft) return

    const color = advice === 'long' ? 'good' :
      advice === 'short' ? 'danger' :
      'warning'

    const body = this._createResponse(
      color,
      `There is a new trend! The advice is to go ${advice}! Current price is ${price}`
    )

    this._send(body)
  }


  onError (error: Error) {
    const body = this._createResponse(
      'danger',
      `Error: ` + error
    )

    this._send(body)
  }


  checkResults (error) {
    if (error) log.warn('error sending slack', error)
    else log.info('Send advice via slack.')
  }


  private _send (content) {
    this.slack.chat.postMessage(this.options.channel, '', content, (error, response) => {
      if (error || !response) log.error('Slack ERROR:', error)
      else log.info('Slack Message Sent')
    })
  }


  private _createResponse (color: string, text: string) {
    const template = {
      // username: `${this.exchange.toUpperCase()}-${this.symbol}`,
      // icon_url: this.createIconUrl(),
      attachments: [
        {
          fallback: '',
          color,
          text,
          mrkdwn_in: ['text']
        }
      ]
    }

    return template
  }


  // createIconUrl () {
  //   const asset = config.watch.asset === 'XBT' ? 'btc' :config.watch.asset.toLowerCase()
  //   return 'https://github.com/cjdowner/cryptocurrency-icons/raw/master/128/icon/' + asset + '.png'
  // }
}
