import HttpError from './HttpError'


export default class NotFoundError extends HttpError {
  constructor (message?: string) {
    super(message || 'Page not found')
    this.status = 404
  }
}
