import { create } from 'zustand'
import request from '../utils/request'
import { AppState, Repository } from '../types'

interface AppStore extends AppState {
  clearError: () => void
  clearRepos: () => void
  loadRepos: (username: string) => Promise<void>
}

export const useAppStore = create<AppStore>((set) => ({
  loading: false,
  error: false,
  currentUser: false,
  userData: {
    repositories: false,
  },
  clearError: () => set({ error: false }),
  clearRepos: () =>
    set({
      userData: { repositories: false },
      currentUser: false,
    }),
  loadRepos: async (username: string) => {
    set({
      loading: true,
      error: false,
      userData: { repositories: false },
    })
    try {
      const repos = await request<Repository[]>(
        `https://api.github.com/users/${username}/repos?type=all&sort=updated`
      )
      set({
        loading: false,
        userData: { repositories: repos },
        currentUser: username,
      })
    } catch (error) {
      set({
        loading: false,
        error: (error as Error).message,
      })
    }
  },
}))
