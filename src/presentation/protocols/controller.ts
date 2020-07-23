import { HttpRequest, HttpResponse } from './http'

export interface Controller {
  handle(param: HttpRequest): Promise<HttpResponse>
}
