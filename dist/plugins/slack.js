"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BasePlugin_1 = require("./BasePlugin");
const log_1 = require("../utils/log");
const WebClient = require('@slack/client').WebClient;
class SlackPlugin extends BasePlugin_1.default {
    constructor(pluginDB) {
        super(pluginDB);
        this.name = 'Slack';
        this.description = 'Sends notifications to slack channel.';
        this.version = 1;
        this.slack = new WebClient(this.options.token);
        if (this.options.sendMessageOnStart) {
            const body = this._createResponse('#439FE0', 'Gekko started!');
            this._send(body);
        }
        else
            log_1.default.debug('Skipping Send message on startup');
    }
    kill() {
    }
    onTriggered(trigger, advice, price) {
        if (advice == 'soft' && this.options.muteSoft)
            return;
        const color = advice === 'long' ? 'good' :
            advice === 'short' ? 'danger' :
                'warning';
        const body = this._createResponse(color, `There is a new trend! The advice is to go ${advice}! Current price is ${price}`);
        this._send(body);
    }
    checkResults(error) {
        if (error)
            log_1.default.warn('error sending slack', error);
        else
            log_1.default.info('Send advice via slack.');
    }
    _send(content) {
        this.slack.chat.postMessage(this.options.channel, '', content, (error, response) => {
            if (error || !response)
                log_1.default.error('Slack ERROR:', error);
            else
                log_1.default.info('Slack Message Sent');
        });
    }
    _createResponse(color, text) {
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
        };
        return template;
    }
}
exports.default = SlackPlugin;
