import { create } from 'zustand'
import type { StudySession, SwipeDirection, StudyRecord, Card } from '../types'
import { useDeckStore } from './useDeckStore'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface SessionSummary {
  memorized: number
  unknown: number
  total: number
}

interface StudyStore {
  session: StudySession | null
  toasts: Toast[]

  startSession: (deckId: string) => void
  flipCard: () => void
  swipe: (direction: SwipeDirection) => void
  currentCard: () => Card | null
  getSessionSummary: () => SessionSummary | null
  addToast: (message: string, type: Toast['type']) => void
  removeToast: (toastId: string) => void
  reset: () => void
}

const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

export const useStudyStore = create<StudyStore>()((set, get) => ({
  session: null,
  toasts: [],

  startSession: (deckId) => {
    const deck = useDeckStore.getState().getDeckById(deckId)
    if (!deck) return
    const totalCards = deck.cards.length
    set({
      session: {
        deckId,
        currentIndex: 0,
        totalCards,
        records: [],
        isFlipped: false,
        isComplete: totalCards === 0,
      },
    })
  },

  flipCard: () =>
    set((state) => {
      if (!state.session) return state
      return {
        session: { ...state.session, isFlipped: !state.session.isFlipped },
      }
    }),

  swipe: (direction) =>
    set((state) => {
      if (!state.session || state.session.isComplete) return state

      const deck = useDeckStore.getState().getDeckById(state.session.deckId)
      if (!deck) return state

      const currentCard = deck.cards[state.session.currentIndex]
      if (!currentCard) return state

      if (direction === 'left') {
        const alreadyRecorded = state.session.records.some(
          (r) => r.cardId === currentCard.id,
        )
        const record: StudyRecord = {
          cardId: currentCard.id,
          result: 'unknown',
          timestamp: new Date().toISOString(),
        }
        const records = alreadyRecorded
          ? state.session.records
          : [...state.session.records, record]
        return {
          session: {
            ...state.session,
            isFlipped: true,
            records,
          },
        }
      }

      // direction === 'right'
      const alreadyRecorded = state.session.records.some(
        (r) => r.cardId === currentCard.id,
      )
      const records = alreadyRecorded
        ? state.session.records
        : [
            ...state.session.records,
            {
              cardId: currentCard.id,
              result: 'memorized' as const,
              timestamp: new Date().toISOString(),
            },
          ]

      const nextIndex = state.session.currentIndex + 1
      const isComplete = nextIndex >= state.session.totalCards
      return {
        session: {
          ...state.session,
          currentIndex: isComplete ? state.session.currentIndex : nextIndex,
          isFlipped: false,
          isComplete,
          records,
        },
      }
    }),

  currentCard: () => {
    const session = get().session
    if (!session) return null
    const deck = useDeckStore.getState().getDeckById(session.deckId)
    if (!deck) return null
    return deck.cards[session.currentIndex] ?? null
  },

  getSessionSummary: () => {
    const session = get().session
    if (!session) return null
    const memorized = session.records.filter(
      (r) => r.result === 'memorized',
    ).length
    const unknown = session.records.filter(
      (r) => r.result === 'unknown',
    ).length
    return { memorized, unknown, total: session.totalCards }
  },

  addToast: (message, type) =>
    set((state) => {
      const duplicate = state.toasts.some((t) => t.message === message)
      if (duplicate) return state
      return {
        toasts: [...state.toasts, { id: generateId(), message, type }],
      }
    }),

  removeToast: (toastId) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== toastId),
    })),

  reset: () => set({ session: null, toasts: [] }),
}))
