import HttpError from './HttpError'


export default class RateLimitExceededError extends HttpError {
  constructor (message?: string) {
    super(message || 'Rate Limit Exceeded')
    this.status = 403
  }
}
