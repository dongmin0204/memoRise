import { create } from 'zustand'
import { HomeState } from '../types'

interface HomeStore extends HomeState {
  changeUsername: (username: string) => void
  clearUsername: () => void
}

export const useHomeStore = create<HomeStore>((set) => ({
  username: '',
  changeUsername: (username: string) =>
    set({
      username: username.replace(/@/gi, ''),
    }),
  clearUsername: () => set({ username: '' }),
}))
