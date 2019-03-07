Trading Server for Advanced Orders
==================================

This server is meant to be used by the CryptoControl Terminal to execute advanced orders like stop-losses, trailing stop-losses, take profit and more.

The codebase is open-sourced so that anybody can host the trading server on their own and keep their API key off of CryptoControl. The trading server can easily be deployed via docker.

For a quick start with docker-compose run
```
docker-compose up
```
or via docker
```
docker run -p 8080:8080 cryptocontrol-trading-server
```

## Disclaimer
USE THE SOFTWARE AT YOUR OWN RISK. YOU ARE RESPONSIBLE FOR YOUR OWN MONEY. PAST PERFORMANCE IS NOT NECESSARILY INDICATIVE OF FUTURE RESULTS.

THE AUTHORS AND ALL AFFILIATES ASSUME NO RESPONSIBILITY FOR YOUR TRADING RESULTS.

## Authentication
The trading server uses (JWT)[https://jwt.io/] to authenticate users. The JWT's secret key is taken from the environment variable `SERVER_SECRET`. The JWT token must be passed via the `x-jwt` header and is automatically sent from the CryptoControl terminal.

## Storage of API keys
All API keys are stored in a json file in the `./storage` folder which is encrypted with the `SERVER_SECRET` environment variable. If you change the secret, you'll have to re-enter your API keys. API keys once uploaded cannot be viewed again by the client.

## Supported Strategies
As of now, the trading server supports
- Stop Loss
- Take Profit
- Trailing Take Profit

## Supported Exchanges
The following exchanges are supported: Binance, Bittrex
