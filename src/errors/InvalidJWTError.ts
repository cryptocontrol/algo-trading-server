import HttpError from './HttpError'


export default class InvalidJWTError extends HttpError {
  constructor(message?: string) {
    super(message || 'Invalid JWT; Please check your server secret')
    this.status = 401
  }
}
