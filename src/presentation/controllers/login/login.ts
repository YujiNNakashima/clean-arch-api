import { Controller } from '../../protocols/controller'
import { HttpRequest, HttpResponse } from '../signup/signup-protocols'
import { badRequest } from '../../helpers/http-helper'
import { MissingParamError } from '../../errors/missing-param-error'

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.password) {
      return new Promise(resolve => resolve(badRequest(new MissingParamError('password'))))
    }

    if (!httpRequest.body.email) {
      return new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
    }
  }
}
