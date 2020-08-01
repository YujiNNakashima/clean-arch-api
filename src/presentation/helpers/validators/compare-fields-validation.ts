import { Validation } from './validation'
import { InvalidParamError } from '../../errors'

export class CompareFieldsValidation implements Validation {
  private readonly fieldName: string
  private readonly fieldCompaneName: string

  constructor (fieldName: string, fieldCompaneName: string) {
    this.fieldName = fieldName
    this.fieldCompaneName = fieldCompaneName
  }

  validate (input: any): Error {
    if (input[this.fieldName] !== input[this.fieldCompaneName]) {
      return new InvalidParamError(this.fieldCompaneName)
    }
  }
}
