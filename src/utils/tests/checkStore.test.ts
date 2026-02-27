/**
 * Test checkStore utility (Zustand store validation)
 */

import { describe, it, expect, beforeEach } from 'vitest'
import checkStore from '../checkStore'

describe('checkStore', () => {
  let store: {
    getState: () => unknown
    setState: (partial: unknown) => void
    subscribe: (listener: (state: unknown) => void) => () => void
  }

  beforeEach(() => {
    store = {
      getState: () => ({}),
      setState: () => {},
      subscribe: () => () => {},
    }
  })

  it('should not throw if passed valid store shape', () => {
    expect(() => checkStore(store)).not.toThrow()
  })

  it('should throw if passed invalid store shape', () => {
    expect(() => checkStore({} as never)).toThrow()
    expect(() =>
      checkStore({
        ...store,
        subscribe: null,
      } as never)
    ).toThrow()
    expect(() =>
      checkStore({
        ...store,
        setState: null,
      } as never)
    ).toThrow()
    expect(() =>
      checkStore({
        ...store,
        getState: null,
      } as never)
    ).toThrow()
  })
})
