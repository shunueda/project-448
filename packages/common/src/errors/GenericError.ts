import { Data } from 'effect'

export abstract class GenericError extends Data.TaggedError(
  'GenericError'
)<Error> {
  constructor(error?: Error | null) {
    super({
      name: GenericError.name || '',
      message: error?.message || '',
      stack: error?.stack
    })
    const { name } = this.constructor
    // @ts-ignore
    this.name = name
    // @ts-ignore
    this._tag = name
  }
}
