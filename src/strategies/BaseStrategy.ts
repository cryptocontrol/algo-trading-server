export default abstract class BaseStrategy {
  // static createFromTrigger (id: string, trigger: any) {
  //   console.log(id, trigger)
  // }
  abstract process (lastprice: number): void

}
