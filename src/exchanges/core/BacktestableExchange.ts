import * as _ from 'underscore'

import BaseExchange from './BaseExchange'


export default abstract class BacktestableExchange extends BaseExchange {
  public abstract getHistoricTrades()
}
