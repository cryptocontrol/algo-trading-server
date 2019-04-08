"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A plugin is something that integrates with the trader; It can't be used
 * to influence the decision of a trade, but it can be used to trigger 3rd
 * party applications.
 *
 * For code that is used to influnce the decision of a trade; see Strategies.
 */
class BasePlugin {
    /**
     * @param pluginDB  The plugin DB instance
     */
    constructor(pluginDB) {
        this.pluginDB = pluginDB;
        this.options = JSON.parse(pluginDB.config);
    }
    getUID() {
        return this.pluginDB.uid;
    }
    getConfig() {
        return JSON.parse(this.pluginDB.config);
    }
}
exports.default = BasePlugin;
