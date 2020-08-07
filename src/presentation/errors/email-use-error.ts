export class EmailInUseError extends Error {
  constructor () {
    super('email already in use')
    this.name = 'EmailInUseError'
  }
}
