import { makeLoginValidation } from './login-validation-factory'
import { ValidationComposite } from '@/validation/validators/validation-composite'
import { RequiredFieldValidation } from '../../../../validation/validators/required-field-validation'
import { Validation } from '../../../../validation/validators/validation'
import { EmailValidation } from '../../../../validation/validators/email-validation'
import { EmailValidator } from '../../../../presentation/protocols/email-validator'

jest.mock('../../../../validation/validators/validation-composite.ts')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('SignupValidation', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    const validations: Validation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
