import BadRequestError from './BadRequestError'


export default class NotAuthorizedError extends BadRequestError {
  constructor(message?: string) {
    super('You are not authorised to access this page')
    this.status = 401
  }
}
