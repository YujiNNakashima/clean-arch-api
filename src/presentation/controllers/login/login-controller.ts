import { Controller } from '../../protocols/controller'
import { HttpRequest, HttpResponse } from '../signup/signup-protocols'
import { badRequest, serverError, unauthorized, ok } from '../../helpers/http/http-helper'
import { Authentication } from '../../../domain/usecases/authentication'
import { Validation } from '../../../validation/validators/validation'

export class LoginController implements Controller {
  private readonly validation: Validation
  private readonly authentication: Authentication

  constructor (authentication: Authentication, validation: Validation) {
    this.validation = validation
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { email, password } = httpRequest.body
      const accessToken = await this.authentication.auth({ email, password })
      if (!accessToken) {
        return unauthorized()
      }
      return ok({
        accessToken
      })
    } catch (error) {
      return serverError(error)
    }
  }
}
