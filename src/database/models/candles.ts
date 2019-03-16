import { Table, Column, Model } from 'sequelize-typescript'


@Table({ timestamps: true })
export default class Candles extends Model<Candles> {
  @Column
  symbol: string

  @Column
  exchange: string

  @Column
  open: number

  @Column
  high: number

  @Column
  low: number

  @Column
  volume: number

  @Column
  close: number

  @Column
  vwp: number

  @Column
  start: Date

  @Column
  trades: number
}
