export default {
  "trigger": {
    "symbol": "LTC/BTC",
    "exchange": "binance",
    "targetPrice": "0.01126",
    "targetVolume": "0.24",
    "uid": "123456",
    "kind": "stop-loss-buy",
    "lastTriggeredAt":"null",
    "hasTriggered": "boolean",
    "closedAt": "2019-05-23 08:41:51",
    "isActive": true,
    "orderId": 123
  },
  "trade": {
    "amount": 4040.22,
    "datetime": "2019-05-23 08:41:51",
    "id": "1",
    "info": {},
    "price": 4040.22,
    "timestamp": 1558581111000,
    "side": "sell",
    "symbol": 'BTC/USDT',

    "takerOrMaker": 'taker',
    "cost": 1000,
    "fee": {
      type: "taker",
      currency: "BTC",
      rate: 10,
      cost: 100
    }
  }
}
