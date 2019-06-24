How it works
============

Iguana is heavily insipired by the popular open-source bitcoin trading bot, [Gekko](https://github.com/askmike/gekko). Hence Iguana has a couple of different components that follow the same layout of Gekko.

All data, including candle data, list of trades streamed from an exchange, list of trades made by the bot is stored in a SQL-compatiable database (MySQL, Postgres, Sqlite etc...). The connection details can be found in [`src/database/config.json`](./src/database/config.json).
