"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This is the starting point of the application. Here we initialize the database and start the server..
 */
const server_1 = require("./server");
const Iguana = require("./iguana");
const Database = require("./database");
const log_1 = require("./utils/log");
// init the database
Database.init();
// start iguana
Iguana.start();
// start the servers
const port = process.env.PORT || 8080;
server_1.default.listen(port, () => log_1.default.info('listening on port', port));
