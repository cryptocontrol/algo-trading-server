import * as ccxt from 'ccxt'
import * as _ from 'underscore'

import { EventEmitter } from 'events'
import { IOrderBook, IAdvanceOrderTypes, IOrderRequest } from 'src/interfaces'


export type IExchangeFeature = 'view_deposits' | 'view_withdrawals' | 'get_deposit_address' | 'margin_trading'
export type IChartInterval = '1m' | '3m' | '5m' | '15m' | '30m' | '1h' | '2h' | '4h'
| '6h' | '8h' | '12h' | '1d' | '3d' | '1w' | '1M' | '1Y' | 'YTD'

export default abstract class BaseExchange extends EventEmitter {
  public readonly id: string
  public readonly name: string

  constructor (id: string, name: string) {
    super()
    this.id = id
    this.name = name
  }


  public abstract hasFeature (id: IExchangeFeature, symbolOrCurrency?: string): Boolean


  public abstract streamTrades (symbol: string): void
  public abstract streamOrderbook (symbol: string): void

  public abstract stopStreamingTrades (symbol: string): void
  public abstract stopStreamingOrderbook (symbol: string): void

  // public abstract loadMarkets (): void
  // public abstract fetchMarkets (): void
  // public abstract fetchTickers (symbol: string): void

  public supportedOrderTypes (): IAdvanceOrderTypes[] { return [] }

  /* Margin trading functions */
  public abstract allowsMarginTrading (symbol: string): boolean


  // public abstract executeSpotOrder (order: IOrderRequest): ccxt.Order
  // public abstract executePaperOrder (order: IOrderRequest): ccxt.Order
  // public abstract cancelOrder (orderId: string): ccxt.Order

  public abstract getTrades (symbol: string, since?: number, descending?: boolean): Promise<ccxt.Trade[]>
  public abstract getOrderbook (symbol: string): Promise<IOrderBook>
  // public abstract createMarginOrder (symbol: string)
  // public abstract createSpotOrder (symbol: string)
  // public abstract createPaperOrder (symbol: string)

  /* private methods */
  public abstract getUserBalance (): Promise<ccxt.Balances>
  public abstract getOpenOrders (symbol: string): Promise<ccxt.Order[]>
  public abstract getClosedOrders (symbol: string): Promise<ccxt.Order[]>

  public abstract executeOrder (symbol: string, order: IOrderRequest): Promise<ccxt.Order>
  public abstract executeMarginOrder (order: IOrderRequest): ccxt.Order
  public abstract cancelOrder (symbol: string, orderId: string): Promise<Boolean>


  public abstract getMarkets (): Promise<{[symbol: string]: ccxt.Market}>
  public abstract getTickers (): Promise<{[x: string]: ccxt.Ticker}>

  public abstract getOHLVC(symbol: string, interval: IChartInterval, from?: number, to?: number): Promise<ccxt.OHLCV[]>

  public abstract getSpotBalance (): Promise<ccxt.Balances>
  public abstract getMarginBalance (): Promise<ccxt.Balances>

  public abstract getDepositTxs (currency?: string, since?: number): Promise<ccxt.Transaction[]>
  public abstract getWithdrawTxs (currency?: string, since?: number): Promise<ccxt.Transaction[]>
  public abstract getDepositAddress (currency: string): Promise<ccxt.DepositAddressResponse>


  public toString () {
    return this.id
  }
}
