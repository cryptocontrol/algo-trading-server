"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const BudfoxManager_1 = require("./BudfoxManager");
const PluginsManager_1 = require("./PluginsManager");
const StopLossTrigger_1 = require("src/triggers/StopLossTrigger");
const TakeProfitTrigger_1 = require("src/triggers/TakeProfitTrigger");
const triggers_1 = require("src/database/models/triggers");
const advices_1 = require("src/database/models/advices");
class TriggerManger {
    constructor() {
        this.triggers = {};
        this.manager = BudfoxManager_1.default.getInstance();
        this.pluginmanager = PluginsManager_1.default.getInstance();
    }
    loadTriggers() {
        return __awaiter(this, void 0, void 0, function* () {
            const activeTriggers = yield triggers_1.default.findAll({ where: { isActive: true } });
            activeTriggers.forEach(t => this.addTrigger(t));
        });
    }
    addTrigger(t) {
        const trigger = this.getTrigger(t);
        if (!trigger)
            return;
        const exchangeSymbol = `${t.exchange}-${t.symbol}`;
        const budfox = this.manager.getBudfox(t.exchange, t.symbol);
        budfox.on('candle', candle => trigger.onCandle(candle));
        budfox.on('trade', trade => trigger.onTrade(trade));
        // whenever a trigger executes
        trigger.on('triggered', ({ advice, price, amount }) => {
            // notify all the plugins for this user...
            this.pluginmanager.onTrigger(trigger, advice, price, amount);
            const adviceDB = new advices_1.default({
                uid: trigger.getUID(),
                symbol: trigger.getSymbol(),
                exchange: trigger.getExchange(),
                advice,
                price,
                mode: 'realtime',
                volume: amount,
                trigger_id: trigger.getDBId()
            });
            adviceDB.save();
        });
        // once a trigger has finished
        trigger.on('close', () => {
            // we remove the trigger from the array of triggers
            const exchangeSymbolTriggers = this.triggers[exchangeSymbol] || [];
            const index = exchangeSymbolTriggers.indexOf(trigger);
            if (index === -1)
                return;
            this.triggers[exchangeSymbol].splice(index, 1);
            // and remove budfox if there are no more triggers left
            if (this.triggers[exchangeSymbol].length === 0)
                this.manager.removeBudfox(budfox);
        });
        const exchangeSymbolTriggers = this.triggers[exchangeSymbol] || [];
        exchangeSymbolTriggers.push(trigger);
        this.triggers[exchangeSymbol] = exchangeSymbolTriggers;
    }
    removeTrigger(t) {
        const exchangeSymbol = `${t.exchange}-${t.symbol}`;
        const exchangeSymbolTriggers = this.triggers[exchangeSymbol] || [];
        const newTriggers = exchangeSymbolTriggers.filter(e => e.getDBId() !== t.id);
        this.triggers[exchangeSymbol] = newTriggers;
    }
    getTrigger(triggerDB) {
        if (triggerDB.kind === 'stop-loss')
            return new StopLossTrigger_1.default(triggerDB);
        if (triggerDB.kind === 'take-profit')
            return new TakeProfitTrigger_1.default(triggerDB);
        if (triggerDB.kind === 'trailing-stop')
            return new TakeProfitTrigger_1.default(triggerDB);
    }
    static getInstance() {
        return TriggerManger.instance;
    }
}
TriggerManger.instance = new TriggerManger();
exports.default = TriggerManger;
