import { RequiredFieldValidation } from '../../../../validation/validators/required-field-validation'
import { EmailValidation } from '../../../../validation/validators/email-validation'
import { EmailValidatorAdapter } from '../../../../utils/email-validator-adapter'
import { ValidationComposite } from '../../../../validation/validators/validation-composite'

export const makeLoginValidation = (): ValidationComposite => {
  return new ValidationComposite([
    new RequiredFieldValidation('email'),
    new RequiredFieldValidation('password'),
    new EmailValidation('email', new EmailValidatorAdapter())
  ])
}
