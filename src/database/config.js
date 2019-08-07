module.exports = {
  development: {
    username: 'root',
    password: 'root',
    database: 'cctrader_dev',
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false
  },
  test: {
    username: 'root',
    password: null,
    database: 'cctrader_test',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  production: {
    username: 'root',
    password: null,
    database: 'cctrader_prod',
    host: '127.0.0.1',
    dialect: 'mysql'
  }
}
