export default abstract class Strategy {
  // static createFromTrigger (id: string, trigger: any) {
  //   console.log(id, trigger)
  // }
  abstract process (lastprice: number): void

}
