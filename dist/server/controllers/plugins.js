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
const PluginsManager_1 = require("src/managers/PluginsManager");
const plugins_1 = require("src/database/models/plugins");
/**
 * create a new plugin for a user
 */
exports.regsiterPlugin = (uid, kind, config) => __awaiter(this, void 0, void 0, function* () {
    const plugin = new plugins_1.default({
        uid,
        kind,
        config: JSON.stringify(config),
        isActive: true
    });
    yield plugin.save();
    // once the plugin is register, we start tracking it in our DB
    PluginsManager_1.default.getInstance().registerPlugin(plugin);
    return plugin;
});
exports.updatePlugin = (uid, id, config) => __awaiter(this, void 0, void 0, function* () {
    const plugin = yield plugins_1.default.findOne({ where: { uid, id } });
    if (plugin) {
        plugin.config = JSON.stringify(config);
        plugin.save();
        PluginsManager_1.default.getInstance().registerPlugin(plugin);
    }
});
/**
 * get all existing plugins for a user
 */
exports.getPlugins = (uid) => __awaiter(this, void 0, void 0, function* () {
    const plugins = yield plugins_1.default.findAll({ where: { uid } });
    return plugins;
});
/**
 * Delete a specific plugin
 */
exports.deleteplugin = (uid, id) => __awaiter(this, void 0, void 0, function* () {
    const plugin = yield plugins_1.default.findOne({ where: { uid, id } });
    if (plugin)
        plugin.destroy();
});
