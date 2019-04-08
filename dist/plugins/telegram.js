"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Telegram = require("node-telegram-bot-api");
const BasePlugin_1 = require("./BasePlugin");
class TelegramPlugin extends BasePlugin_1.default {
    constructor(pluginDB) {
        super(pluginDB);
        this.name = 'Telegram';
        this.description = 'Sends notifications to a Telegram bot.';
        this.version = 1;
        this.onText = (msg, _text) => {
            const text = _text[0];
            const chatId = msg.chat.id;
            switch (text.toLowerCase()) {
                case '/start':
                    this.send(`Hello! your chat id is: \`${chatId}\`. Enter the chat id in the CryptoControl ` +
                        `terminal to recieve all kinds of trading notifications.`, chatId);
                    return;
                case '/help':
                    this.send(`Your chat id is: \`${chatId}\`. \n\nCurrently this bot does support commands :( ` +
                        `\n\nEnter the chat id in the CryptoControl terminal to recieve all kinds of trading notifications.`, chatId);
                    return;
            }
            this.send(`use /help to see a list of commands`, chatId);
        };
        this.bot = new Telegram(this.options.token, { polling: { interval: 1000 } });
        if (this.options.chatId)
            this.send('I\'m now connected to the trading server!');
        this.bot.onText(/(.+)/, this.onText);
    }
    kill() {
        this.bot.stopPolling();
    }
    onTriggered(trigger, advice, price, amount) {
        const message = `${trigger.name} triggered! and adviced to \`${advice}\` ` +
            `on \`${trigger.getExchange().toUpperCase()}\` \`${trigger.getSymbol()}\` with a ` +
            `volume of \`${amount}\`! Current price is \`${price}\``;
        this.send(message);
    }
    send(message, _chatId) {
        const chatId = _chatId || this.options.chatId;
        this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    }
}
exports.default = TelegramPlugin;
