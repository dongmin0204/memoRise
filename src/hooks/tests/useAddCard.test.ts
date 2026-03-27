import { describe, expect, it, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAddCard } from '../useAddCard'
import { useDeckStore } from '@/store/useDeckStore'

describe('useAddCard', () => {
  beforeEach(() => {
    useDeckStore.getState().reset()
  })

  it('앞/뒤 텍스트를 trim 후 카드를 추가한다', () => {
    useDeckStore.getState().addDeck('덱', '설명')
    const deckId = useDeckStore.getState().decks[0].id
    const { result } = renderHook(() => useAddCard(deckId))

    let response: ReturnType<typeof result.current> | null = null
    act(() => {
      response = result.current({
        front: '  Apple  ',
        back: '  사과  ',
        tags: ' 과일, 영어 ',
      })
    })

    expect(response).toEqual({ ok: true })
    const deck = useDeckStore.getState().getDeckById(deckId)
    expect(deck?.cards).toHaveLength(1)
    expect(deck?.cards[0].front).toBe('Apple')
    expect(deck?.cards[0].back).toBe('사과')
    expect(deck?.cards[0].tags).toEqual(['과일', '영어'])
  })

  it('앞면이 비어 있으면 실패를 반환한다', () => {
    useDeckStore.getState().addDeck('덱', '설명')
    const deckId = useDeckStore.getState().decks[0].id
    const { result } = renderHook(() => useAddCard(deckId))

    let response: ReturnType<typeof result.current> | null = null
    act(() => {
      response = result.current({
        front: '   ',
        back: '정답',
      })
    })

    expect(response).toEqual({ ok: false, error: 'FRONT_REQUIRED' })
    const deck = useDeckStore.getState().getDeckById(deckId)
    expect(deck?.cards).toHaveLength(0)
  })
})

