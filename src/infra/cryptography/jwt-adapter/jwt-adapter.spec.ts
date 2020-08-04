import { Encrypter } from '../../../data/protocols/cryptography/encrypter'
import { JwtAdapter } from './jwt-adapter'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return new Promise(resolve => resolve('any_token'))
  }
}))

describe('JwtAdapter', () => {
  interface SutTypes {
    sut: Encrypter
  }

  const makeSut = (): SutTypes => {
    const sut = new JwtAdapter('secret')
    return {
      sut
    }
  }

  test('should call sign with correct values', async () => {
    const { sut } = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_id')
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
  })

  test('should return a token on sign success', async () => {
    const { sut } = makeSut()
    const token = await sut.encrypt('any_id')
    expect(token).toBe('any_token')
  })
})
