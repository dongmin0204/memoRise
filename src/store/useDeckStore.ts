import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Card, Deck } from '../types'

interface DeckStore {
  decks: Deck[]
  addDeck: (name: string, description: string) => void
  createDeck: (
    name: string,
    description: string,
  ) => { ok: true; deckId: string } | { ok: false; error: string }
  removeDeck: (deckId: string) => void
  updateDeck: (
    deckId: string,
    updates: Partial<Pick<Deck, 'name' | 'description'>>,
  ) => void
  getDeckById: (deckId: string) => Deck | undefined
  addCard: (
    deckId: string,
    card: Pick<Card, 'front' | 'back' | 'tags'> & { imageUrl?: string },
  ) => void
  removeCard: (deckId: string, cardId: string) => void
  updateCard: (
    deckId: string,
    cardId: string,
    updates: Partial<Pick<Card, 'front' | 'back' | 'tags' | 'imageUrl'>>,
  ) => void
  reset: () => void
}

const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

export const useDeckStore = create<DeckStore>()(
  persist(
    (set, get) => ({
      decks: [],

      addDeck: (name, description) =>
        set((state) => ({
          decks: [
            ...state.decks,
            {
              id: generateId(),
              name,
              description,
              cards: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        })),

      createDeck: (name, description) => {
        const trimmedName = name.trim()
        const trimmedDescription = description.trim()

        if (!trimmedName) {
          return { ok: false as const, error: 'NAME_REQUIRED' }
        }

        const deckId = generateId()
        set((state) => ({
          decks: [
            ...state.decks,
            {
              id: deckId,
              name: trimmedName,
              description: trimmedDescription,
              cards: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        }))

        return { ok: true as const, deckId }
      },

      removeDeck: (deckId) =>
        set((state) => ({
          decks: state.decks.filter((d) => d.id !== deckId),
        })),

      updateDeck: (deckId, updates) =>
        set((state) => ({
          decks: state.decks.map((d) =>
            d.id === deckId
              ? { ...d, ...updates, updatedAt: new Date().toISOString() }
              : d,
          ),
        })),

      getDeckById: (deckId) => get().decks.find((d) => d.id === deckId),

      addCard: (deckId, cardData) =>
        set((state) => ({
          decks: state.decks.map((d) =>
            d.id === deckId
              ? {
                  ...d,
                  cards: [
                    ...d.cards,
                    {
                      id: generateId(),
                      front: cardData.front,
                      back: cardData.back,
                      tags: cardData.tags,
                      imageUrl: cardData.imageUrl,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                    },
                  ],
                  updatedAt: new Date().toISOString(),
                }
              : d,
          ),
        })),

      removeCard: (deckId, cardId) =>
        set((state) => ({
          decks: state.decks.map((d) =>
            d.id === deckId
              ? {
                  ...d,
                  cards: d.cards.filter((c) => c.id !== cardId),
                  updatedAt: new Date().toISOString(),
                }
              : d,
          ),
        })),

      updateCard: (deckId, cardId, updates) =>
        set((state) => ({
          decks: state.decks.map((d) =>
            d.id === deckId
              ? {
                  ...d,
                  cards: d.cards.map((c) =>
                    c.id === cardId
                      ? {
                          ...c,
                          ...updates,
                          updatedAt: new Date().toISOString(),
                        }
                      : c,
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : d,
          ),
        })),

      reset: () => set({ decks: [] }),
    }),
    { name: 'memorise-decks' },
  ),
)
