import { DbAddAccount } from './db-add-account'
import { Encrypter } from '../../protocols/encrypter'
import { AddAccount } from '@/domain/usecases/add-account'

describe('DBAddAccount Usecase', () => {
  interface sut {
    encrypterStub: Encrypter
    sut: AddAccount
  }

  const makeEncrypterStub = (): Encrypter => {
    class EncrypterStub implements Encrypter {
      async encrypt (value: string): Promise<string> {
        return new Promise((resolve) => resolve('hashed_password'))
      }
    }

    return new EncrypterStub()
  }

  const makeSut = (): any => {
    const encrypterStub = makeEncrypterStub()
    const sut = new DbAddAccount(encrypterStub)

    return {
      encrypterStub,
      sut
    }
  }

  test('should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('should throw error if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error())))
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })
})
