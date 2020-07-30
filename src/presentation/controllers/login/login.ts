import { Controller } from '../../protocols/controller'
import { HttpRequest, HttpResponse } from '../signup/signup-protocols'
import { badRequest } from '../../helpers/http-helper'
import { MissingParamError } from '../../errors/missing-param-error'
import { EmailValidator } from '../../protocols/email-validator'
import { InvalidParamError } from '../../errors/invalid-param-error'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.password) {
      return new Promise(resolve => resolve(badRequest(new MissingParamError('password'))))
    }

    if (!httpRequest.body.email) {
      return new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
    }

    const isValidEmail = this.emailValidator.isValid(httpRequest.body.email)

    if (!isValidEmail) {
      return new Promise(resolve => resolve(badRequest(new InvalidParamError('email'))))
    }

    // return new Promise(resolve => resolve(ok(true)))
  }
}
