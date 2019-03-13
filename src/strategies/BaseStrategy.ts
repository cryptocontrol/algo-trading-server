import * as hat from 'hat'


export default abstract class BaseStrategy {
  public readonly name: string
  public readonly uid: string


  constructor (name: string) {
    this.uid = hat()
    this.name = name
  }


  advice (reason?: string) {
    // do nothing
  }

  abstract process (lastprice: number): void
}
