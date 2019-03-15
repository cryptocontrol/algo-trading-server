import {Table, Column, Model} from 'sequelize-typescript'


@Table({ timestamps: true })
export default class UserExchanges extends Model<UserExchanges> {
  @Column
  uid: string

  @Column
  exchange: string

  @Column
  apiKey: string

  @Column
  apiSecret: string

  @Column
  apiPassword: string
}
