// InvalidParamError
export class InvalidParamError extends Error {
  constructor (paramName: string) {
    super(`invalid param error: ${paramName}`)
    this.name = 'InvalidParamError'
  }
}
