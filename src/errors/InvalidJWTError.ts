import HttpError from './HttpError'


export default class InvalidJWTError extends HttpError {
  constructor(message?: string) {
    super(message || 'Bad JWT')
    this.status = 401
  }
}
