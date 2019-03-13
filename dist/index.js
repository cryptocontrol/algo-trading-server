"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = require("./server");
var Binance_1 = require("./exchanges/Binance");
// start all the exchanges listeners
var binance = new Binance_1.default();
binance.startListening();
// start the servers
var port = process.env.PORT || 8080;
server_1.default.listen(port, function () { return console.log('listening on port', port); });
