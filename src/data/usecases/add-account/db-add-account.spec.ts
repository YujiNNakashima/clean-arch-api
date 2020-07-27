import { DbAddAccount } from './db-add-account'
import { AddAccountModel, AddAccount, Encrypter, AccountModel, AddAccountRepository } from './db-add-account-protocols'

describe('DBAddAccount Usecase', () => {
  const makeEncrypterStub = (): Encrypter => {
    class EncrypterStub implements Encrypter {
      async encrypt (value: string): Promise<string> {
        return new Promise((resolve) => resolve('hashed_password'))
      }
    }

    return new EncrypterStub()
  }

  const makeAddAccountRepositoryStub = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
      async add (accountData: AddAccountModel): Promise<AccountModel> {
        return new Promise((resolve) => resolve(makeFakeAccount()))
      }
    }
    return new AddAccountRepositoryStub()
  }

  const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email',
    password: 'hashed_password'
  })

  const makeFakeAccountData = (): AddAccountModel => (
    {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
  )

  interface SutTypes {
    encrypterStub: Encrypter
    sut: AddAccount
    addAccountRepositoryStub: AddAccountRepository
  }

  const makeSut = (): SutTypes => {
    const encrypterStub = makeEncrypterStub()
    const addAccountRepositoryStub = makeAddAccountRepositoryStub()
    const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)

    return {
      encrypterStub,
      addAccountRepositoryStub,
      sut
    }
  }

  test('should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.add(makeFakeAccountData())
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('should throw error if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.add(makeFakeAccountData())
    await expect(promise).rejects.toThrow()
  })

  test('should call AddAccountRepository', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(makeFakeAccountData())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    })
  })

  test('should throw if throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.add(makeFakeAccountData())
    await expect(promise).rejects.toThrow()
  })

  test('should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(makeFakeAccountData())
    expect(account).toEqual(makeFakeAccount())
  })
})
