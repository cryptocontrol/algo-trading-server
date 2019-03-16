import * as EventEmitter from 'events'

// Note: as of now only supports trailing the price going up (after
// a buy), on trigger (when the price moves down) you should sell.


// @param initialPrice: initial price, preferably buy price
// @param trail: fixed offset from the price
// @param onTrigger: fn to call when the stop triggers
export default abstract class BaseTrigger extends EventEmitter {
  protected isLive: boolean = true

  // constructor({ trail, initialPrice, onTrigger }) {
  constructor () {
    super()

    // this.trail = trail
    // this.onTrigger = onTrigger

    // this.previousPrice = initialPrice
    // this.trailingPoint = initialPrice - this.trail
  }


  protected abstract updatePrice (price: number): void


  trigger (price: number) {
    if (!this.isLive) return
    this.emit('trigger', price)
  }
}
