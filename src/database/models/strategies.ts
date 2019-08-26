import { Table, Column, Model } from 'sequelize-typescript'


@Table({ timestamps: true })
export default class Strategies extends Model<Strategies> {
  @Column
  symbol: string

  @Column
  exchange: string

  @Column
  uid: string

  @Column
  kind: string

  @Column
  lastTriggeredAt: Date

  @Column
  params: string

  @Column
  isActive: boolean

  @Column
  isDeleted: boolean
}
