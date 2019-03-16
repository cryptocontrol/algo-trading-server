import { Table, Column, Model } from 'sequelize-typescript'


@Table({ timestamps: true })
export default class Trades extends Model<Trades> {
  @Column
  symbol: string

  @Column
  exchange: string

  @Column
  price: number

  @Column
  volume: number

  @Column
  tradedAt: Date

  @Column
  tradeId: string

  @Column
  side: string
}
