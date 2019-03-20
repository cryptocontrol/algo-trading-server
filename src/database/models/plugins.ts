import { Table, Column, Model } from 'sequelize-typescript'


@Table({ timestamps: true })
export default class Plugins extends Model<Plugins> {
  @Column
  uid: string

  @Column
  kind: string

  @Column
  config: string

  @Column
  isActive: boolean
}
