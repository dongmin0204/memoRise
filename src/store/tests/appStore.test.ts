import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAppStore } from '../useAppStore'

// Mock the request function
vi.mock('../../utils/request', () => ({
  default: vi.fn(),
}))

describe('useAppStore', () => {
  beforeEach(() => {
    useAppStore.setState({
      loading: false,
      error: false,
      currentUser: false,
      userData: { repositories: false },
    })
  })

  it('should handle initial state', () => {
    const state = useAppStore.getState()
    expect(state.loading).toBe(false)
    expect(state.error).toBe(false)
    expect(state.currentUser).toBe(false)
    expect(state.userData.repositories).toBe(false)
  })

  it('should handle clearError', () => {
    useAppStore.getState().clearError()
    const state = useAppStore.getState()
    expect(state.error).toBe(false)
  })

  it('should handle clearRepos', () => {
    useAppStore.getState().clearRepos()
    const state = useAppStore.getState()
    expect(state.userData.repositories).toBe(false)
    expect(state.currentUser).toBe(false)
  })

  it('should handle loadRepos loading state', async () => {
    const request = (await import('../../utils/request')).default
    vi.mocked(request).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve([] as never), 100)
        )
    )

    const loadPromise = useAppStore.getState().loadRepos('testuser')
    const loadingState = useAppStore.getState()
    expect(loadingState.loading).toBe(true)
    expect(loadingState.error).toBe(false)
    expect(loadingState.userData.repositories).toBe(false)

    await loadPromise
  })

  it('should handle loadRepos success', async () => {
    const mockRepos = [
      {
        id: 1,
        name: 'repo1',
        description: 'test repo',
        stargazers_count: 10,
        forks_count: 5,
        html_url: 'http://example.com',
        language: 'ts',
        updated_at: '2024-01-01',
      },
      {
        id: 2,
        name: 'repo2',
        description: 'test repo 2',
        stargazers_count: 20,
        forks_count: 10,
        html_url: 'http://example.com',
        language: 'js',
        updated_at: '2024-01-01',
      },
    ]

    const request = (await import('../../utils/request')).default
    vi.mocked(request).mockResolvedValue(mockRepos)

    await useAppStore.getState().loadRepos('testuser')

    const state = useAppStore.getState()
    expect(state.loading).toBe(false)
    expect(state.userData.repositories).toEqual(mockRepos)
    expect(state.currentUser).toBe('testuser')
  })

  it('should handle loadRepos error', async () => {
    const request = (await import('../../utils/request')).default
    vi.mocked(request).mockRejectedValue(new Error('API Error'))

    await useAppStore.getState().loadRepos('testuser')

    const state = useAppStore.getState()
    expect(state.loading).toBe(false)
    expect(state.error).toBe('API Error')
  })
})
