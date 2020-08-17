import { RequiredFieldValidation } from '../../../../validation/validators/required-field-validation'
import { CompareFieldsValidation } from '../../../../validation/validators/compare-fields-validation'
import { EmailValidation } from '../../../../validation/validators/email-validation'
import { EmailValidatorAdapter } from '../../../../utils/email-validator-adapter'
import { ValidationComposite } from '../../../../validation/validators/validation-composite'

export const makeSignUpValidation = (): ValidationComposite => {
  return new ValidationComposite([
    new RequiredFieldValidation('name'),
    new RequiredFieldValidation('email'),
    new RequiredFieldValidation('password'),
    new RequiredFieldValidation('passwordConfirmation'),
    new CompareFieldsValidation('password', 'passwordConfirmation'),
    new EmailValidation('email', new EmailValidatorAdapter())
  ])
}
