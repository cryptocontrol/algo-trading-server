"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const Database = require("./database");
// init the database
Database.init();
// start all the exchanges listeners
// const binance = new Binance()
// binance.startListening()
// start the servers
const port = process.env.PORT || 8080;
server_1.default.listen(port, () => console.log('listening on port', port));
