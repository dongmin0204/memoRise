/**
 * Validate the shape of a Zustand store
 * Zustand stores have getState, setState, subscribe, and getInitialState (optional)
 */

interface ZustandStoreShape {
  getState: () => unknown
  setState: (partial: unknown) => void
  subscribe: (listener: (state: unknown) => void) => () => void
}

const checkStore = (store: ZustandStoreShape) => {
  const shape = {
    getState: expect.any(Function),
    setState: expect.any(Function),
    subscribe: expect.any(Function),
  }
  expect(store).toMatchObject(shape)

  // Validate required properties exist
  if (!store.getState || typeof store.getState !== 'function') {
    throw new Error('Store must have a getState function')
  }
  if (!store.setState || typeof store.setState !== 'function') {
    throw new Error('Store must have a setState function')
  }
  if (!store.subscribe || typeof store.subscribe !== 'function') {
    throw new Error('Store must have a subscribe function')
  }
}

export default checkStore
