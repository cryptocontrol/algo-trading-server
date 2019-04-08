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
const _ = require("underscore");
const plugins_1 = require("src/database/models/plugins");
const slack_1 = require("src/plugins/slack");
const telegram_1 = require("src/plugins/telegram");
class PluginsManager {
    constructor() {
        this.plugins = {};
    }
    loadPlugins() {
        return __awaiter(this, void 0, void 0, function* () {
            const plugins = yield plugins_1.default.findAll({ where: { isActive: true } });
            plugins.forEach(p => this.registerPlugin(p));
        });
    }
    onTrigger(trigger, advice, price, amount) {
        const plugins = this.plugins[trigger.getUID()] || [];
        const pluginKeys = _.keys(plugins);
        pluginKeys.forEach(key => plugins[key].onTriggered(trigger, advice, price, amount));
    }
    registerPlugin(p) {
        const plugin = this.getPlugin(p);
        if (!plugin)
            return;
        const userplugins = this.plugins[p.uid] || {};
        // delete the old plugin (if it exists)
        if (userplugins[plugin.name]) {
            userplugins[plugin.name].kill();
            delete userplugins[plugin.name];
        }
        // added plugins
        userplugins[plugin.name] = plugin;
        this.plugins[p.uid] = userplugins;
    }
    getPlugin(plugin) {
        if (plugin.kind === 'slack')
            return new slack_1.default(plugin);
        if (plugin.kind === 'telegram')
            return new telegram_1.default(plugin);
    }
    static getInstance() {
        return PluginsManager.instance;
    }
}
PluginsManager.instance = new PluginsManager();
exports.default = PluginsManager;
