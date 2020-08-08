import { DbAddAccount } from './db-add-account'
import { AddAccountModel, AddAccount, Hasher, AccountModel, AddAccountRepository } from './db-add-account-protocols'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

describe('DBAddAccount Usecase', () => {
  const makeHasherStub = (): Hasher => {
    class HasherStub implements Hasher {
      async hash (value: string): Promise<string> {
        return new Promise((resolve) => resolve('hashed_password'))
      }
    }

    return new HasherStub()
  }

  const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
      async loadByEmail (email: string): Promise<AccountModel> {
        return new Promise(resolve => resolve(null))
      }
    }
    return new LoadAccountByEmailRepositoryStub()
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
    email: 'valid_email@mail.com',
    password: 'hashed_password'
  })

  const makeFakeAccountData = (): AddAccountModel => (
    {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
  )

  interface SutTypes {
    hasherStub: Hasher
    sut: AddAccount
    addAccountRepositoryStub: AddAccountRepository
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  }

  const makeSut = (): SutTypes => {
    const hasherStub = makeHasherStub()
    const addAccountRepositoryStub = makeAddAccountRepositoryStub()
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
    const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)

    return {
      hasherStub,
      addAccountRepositoryStub,
      loadAccountByEmailRepositoryStub,
      sut
    }
  }

  test('should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hasherSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(makeFakeAccountData())
    expect(hasherSpy).toHaveBeenCalledWith('valid_password')
  })

  test('should throw error if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(
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
      email: 'valid_email@mail.com',
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

  test('should return null of LoadAccountByEmailRepository not return null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(new Promise(resolve => resolve(makeFakeAccount())))
    const account = await sut.add(makeFakeAccountData())
    expect(account).toBeNull()
  })

  test('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.add(makeFakeAccountData())
    expect(loadSpy).toHaveBeenCalledWith('valid_email@mail.com')
  })
})
