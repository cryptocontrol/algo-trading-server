"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This is the starting point of the application. Here we initialize the database and start the server..
 */
const TriggerManager_1 = require("./managers/TriggerManager");
const PluginsManager_1 = require("./managers/PluginsManager");
exports.start = () => {
    // connect all plugins \
    // init plugins
    const pluginManager = PluginsManager_1.default.getInstance();
    pluginManager.loadPlugins();
    // Create the budfox manager and add budfoxes
    const manager = TriggerManager_1.default.getInstance();
    manager.loadTriggers();
};
