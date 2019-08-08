import * as ccxt from 'ccxt'
import * as WebSocket from 'ws'
import { isArray } from 'util'

import CCXTExchange from './core/CCXTExchange'

interface ISocketTradeMessage {
  e: string
  E: number
  s: string
  t: number
  p: string
  q: string
  b: number
  a: number
  T: number
  m: boolean
  M: boolean
}



interface ISocketDiffDepthMessage {
  a: [string, string][]
  b: [string, string][]
  E: number
  e: string
  s: string
  U: number
  u: number
}


type ICCXTSymbol = string
type IBFXSymbol = string

export default class BitfinexExchange extends CCXTExchange {
  private readonly socket: WebSocket
  private isSocketOpened: boolean = false

  private readonly channelIdToBFXSymbol: {
    [channelId: number]: IBFXSymbol
  } = {}

  private readonly bfXSymbolToCCXTSymbol: {
    [bfxSymbol in IBFXSymbol]: ICCXTSymbol
  } = {}

  private readonly streamingTradesChannelIds: {
    [bfxSymbol in IBFXSymbol]: number
  } = {}

  private readonly streamingOrderbookSymbolChannelIds: {
    [bfxSymbol in IBFXSymbol]: number
  } = {}


  private readonly supportedWebsocketSymbols = [
    'BTCUSD', 'LTCUSD', 'LTCBTC', 'ETHUSD', 'ETHBTC', 'ETCBTC', 'ETCUSD', 'RRTUSD', 'RRTBTC', 'ZECUSD', 'ZECBTC',
    'XMRUSD', 'XMRBTC', 'DSHUSD', 'DSHBTC', 'BTCEUR', 'XRPUSD', 'XRPBTC', 'IOTUSD', 'IOTBTC', 'IOTETH', 'EOSUSD',
    'EOSBTC', 'EOSETH', 'SANUSD', 'SANBTC', 'SANETH', 'OMGUSD', 'OMGBTC', 'OMGETH', 'BCHUSD', 'BCHBTC', 'BCHETH',
    'NEOUSD', 'NEOBTC', 'NEOETH', 'ETPUSD', 'ETPBTC', 'ETPETH', 'QTMUSD', 'QTMBTC', 'QTMETH', 'AVTUSD', 'AVTBTC',
    'AVTETH', 'EDOUSD', 'EDOBTC', 'EDOETH', 'BTGUSD', 'BTGBTC', 'DATUSD', 'DATBTC', 'DATETH', 'QSHUSD', 'QSHBTC',
    'QSHETH', 'YYWUSD', 'YYWBTC', 'YYWETH', 'GNTUSD', 'GNTBTC', 'GNTETH', 'SNTUSD', 'SNTBTC', 'SNTETH', 'IOTEUR',
    'BATUSD', 'BATBTC', 'BATETH', 'MNAUSD', 'MNABTC', 'MNAETH', 'FUNUSD', 'FUNBTC', 'FUNETH', 'ZRXUSD', 'ZRXBTC',
    'ZRXETH', 'TNBUSD', 'TNBBTC', 'TNBETH', 'SPKUSD', 'SPKBTC', 'SPKETH', 'TRXUSD', 'TRXBTC', 'TRXETH', 'RCNUSD',
    'RCNBTC', 'RCNETH', 'RLCUSD', 'RLCBTC', 'RLCETH', 'AIDUSD', 'AIDBTC', 'AIDETH', 'SNGUSD', 'SNGBTC', 'SNGETH',
    'REPUSD', 'REPBTC', 'REPETH', 'ELFUSD', 'ELFBTC', 'ELFETH'
  ]

  constructor (exchange: ccxt.Exchange) {
    super(exchange)

    const url = `wss://api-pub.bitfinex.com/ws/2`
    this.socket = new WebSocket(url)

    this.socket.on('message', this.onWebsocketMessage)
    this.socket.on('close', _event => { this.isSocketOpened = true })
  }


  public async streamTrades (symbol: ICCXTSymbol) {
    if (!symbol) return
    const wsSymbol = this.getBFXSymbol(symbol)
    if (!this.hasWebsocketSupport(wsSymbol)) return super.streamTrades(symbol)

    // check if we are already streaming this symbol or not
    if (this.streamingTradesChannelIds[wsSymbol]) return

    // first download all the recent trades
    super.getTrades(symbol)
    .then(trades => this.emit(`trade:full:${symbol}`, trades))

    // then start streaming from websockets
    this.send({ event: 'subscribe', channel: 'trades', symbol: `t${wsSymbol}` })
  }


  public async stopStreamingTrades (symbol: ICCXTSymbol) {
    const wsSymbol = this.getBFXSymbol(symbol)
    if (!this.hasWebsocketSupport(wsSymbol)) return super.stopStreamingTrades(symbol)
    if (!this.streamingTradesChannelIds[wsSymbol]) return

    await this.send({
      event: 'unsubscribe',
      chanId: this.streamingTradesChannelIds[wsSymbol]
    })

    delete this.streamingTradesChannelIds[wsSymbol]
  }


  private onWebsocketMessage = async (event: any) => {
    this.isSocketOpened = true

    try {
      const data = JSON.parse(event.data)

      // capture the channel id
      if (data.event === 'subscribed' && data.channel === 'trades') {
        this.streamingTradesChannelIds[data.pair] = data.chanId
        this.channelIdToBFXSymbol[data.chanId] = data.pair
        return
      }

      if (!isArray(data)) return

      const [chanId, abbrv, tradeData] = data
      const bfxSymbol = this.channelIdToBFXSymbol[chanId]
      const ccxtSymbol = this.getCCXTSymbol(bfxSymbol)

      // if this is not a trade update; we bail
      // abbrevations over here: https://docs.bitfinex.com/v2/docs/abbreviations-glossary
      if (abbrv !== 'tu') return

      const [tradeId, timestamp, amount, price] = tradeData
      // parse the trade over here...

      const ccxtTrade: ccxt.Trade = {
        amount: Math.abs(amount),
        cost: Math.abs(amount) * Number(price),
        datetime: (new Date(timestamp)).toISOString(),
        fee: undefined,
        id: String(tradeId),
        info: {},
        price: Number(price),
        side: amount < 0 ? 'sell' : 'buy',
        symbol: ccxtSymbol,
        takerOrMaker: undefined, // data.m ? 'maker' : 'taker',
        timestamp
      }

      this.emit('trade', ccxtTrade)
    } catch (e) {
      // do nothing
    }
  }


  private async send (data: any) {
    // serialize to json
    const msg = JSON.stringify(data)

    // wait for the connection to be opened
    await this.awaitForConnection()

    // send bitches!
    this.socket.send(msg)
  }


  private async awaitForConnection () {
    return new Promise((resolve, reject) => {
      // if socket is closed..
      if (!this.socket) return reject()

      // if already opened
      if (this.isSocketOpened) return resolve()

      // check if the connection is opened every second
      setTimeout(() => { if (this.isSocketOpened) return resolve() }, 1000)

      // if connection doesn't happen in 30s; then we bail
      setTimeout(reject, 30 * 1000)
    })
  }


  private getBFXSymbol (ccxtSymbol: string): IBFXSymbol {
    const bfxSymbol = `${ccxtSymbol.toUpperCase()}`.replace('/', '')
    this.bfXSymbolToCCXTSymbol[bfxSymbol] = ccxtSymbol
    return `${ccxtSymbol.toUpperCase()}`.replace('/', '')
  }


  private getCCXTSymbol (bfxSymbol: string): ICCXTSymbol {
    return this.bfXSymbolToCCXTSymbol[bfxSymbol]
  }


  private hasWebsocketSupport (bfxSymbol: IBFXSymbol) {
    return this.supportedWebsocketSymbols.indexOf(bfxSymbol) >= 0
  }
}
