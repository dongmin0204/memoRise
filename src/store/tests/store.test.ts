/**
 * Test store configuration (Zustand)
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAppStore } from '../useAppStore'
import { useHomeStore } from '../useHomeStore'
import { useLanguageStore } from '../useLanguageStore'

describe('Zustand stores', () => {
  beforeEach(() => {
    useAppStore.setState({
      loading: false,
      error: false,
      currentUser: false,
      userData: { repositories: false },
    })
    useHomeStore.setState({ username: '' })
    useLanguageStore.setState({ locale: 'en' })
  })

  describe('useAppStore', () => {
    it('should have correct initial state', () => {
      const state = useAppStore.getState()
      expect(state.loading).toBe(false)
      expect(state.error).toBe(false)
      expect(state.currentUser).toBe(false)
      expect(state.userData.repositories).toBe(false)
    })

    it('should have store methods', () => {
      const state = useAppStore.getState()
      expect(typeof state.clearError).toBe('function')
      expect(typeof state.clearRepos).toBe('function')
      expect(typeof state.loadRepos).toBe('function')
    })
  })

  describe('useHomeStore', () => {
    it('should have correct initial state', () => {
      const state = useHomeStore.getState()
      expect(state.username).toBe('')
    })

    it('should have store methods', () => {
      const state = useHomeStore.getState()
      expect(typeof state.changeUsername).toBe('function')
      expect(typeof state.clearUsername).toBe('function')
    })
  })

  describe('useLanguageStore', () => {
    it('should have correct initial state', () => {
      const state = useLanguageStore.getState()
      expect(state.locale).toBe('en')
    })

    it('should have store methods', () => {
      const state = useLanguageStore.getState()
      expect(typeof state.changeLocale).toBe('function')
    })
  })
})
