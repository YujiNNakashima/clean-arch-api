export class PasswordNotMatching extends Error {
  constructor () {
    super('Password not matching')
    this.name = 'PasswordNotMatching'
  }
}
