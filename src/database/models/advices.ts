import { Table, Column, Model } from 'sequelize-typescript'
import { IAdvice } from 'src/interfaces'


@Table({ timestamps: true })
export default class Advices extends Model<Advices> {
  @Column
  symbol: string

  @Column
  exchange: string

  @Column
  uid: string

  @Column
  volume: number

  @Column
  price: number

  @Column
  advice: IAdvice

  @Column
  mode: 'realtime' | 'backtest' | 'paper'

  @Column
  trigger_id?: number

  @Column
  strategy_id?: number

  @Column
  order_id: number

  @Column
  error_msg: string
}
