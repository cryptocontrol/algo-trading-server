import HttpError from './HttpError'


export default class InvalidAPIKeyError extends HttpError {
  constructor(message?: string) {
    super(message || 'Invalid API Key')
    this.status = 401
  }
}
