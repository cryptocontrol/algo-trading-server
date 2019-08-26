import * as _ from 'underscore'

import { IAdvice } from '../interfaces'
import BasePlugin from './BasePlugin'
import BaseTrigger from '../triggers/BaseTrigger'
import log from '../utils/log'
import Plugins from '../database/models/plugins'
import BaseStrategy from 'src/strategies/BaseStrategy';
import Advices from 'src/database/models/advices';

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



  onAdvice (from: string, adviceDB: Advices) {
    // if (tjos.advice. == 'soft' && this.options.muteSoft) return

    const color = adviceDB.advice === 'long' ? 'good' :
      adviceDB.advice === 'short' ? 'danger' : 'warning'

    const body = this._createResponse(
      color,
      `${from} adviced to ${adviceDB.advice}! Current price is ${adviceDB.price}`
    )

    this._send(body)
  }


  onError (error: Error, from: string) {
    const body = this._createResponse(
      'danger',
      `Error: ${from}` + error
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
