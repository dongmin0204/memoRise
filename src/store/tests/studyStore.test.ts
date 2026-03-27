import { describe, it, expect, beforeEach } from 'vitest'
import { useStudyStore } from '../useStudyStore'
import { useDeckStore } from '../useDeckStore'

describe('useStudyStore', () => {
  beforeEach(() => {
    useDeckStore.getState().reset()
    useStudyStore.getState().reset()
  })

  const setupDeckWithCards = () => {
    useDeckStore.getState().addDeck('테스트덱', '설명')
    const deckId = useDeckStore.getState().decks[0].id
    useDeckStore.getState().addCard(deckId, {
      front: 'Hello',
      back: '안녕',
      tags: [],
    })
    useDeckStore.getState().addCard(deckId, {
      front: 'World',
      back: '세계',
      tags: [],
    })
    useDeckStore.getState().addCard(deckId, {
      front: 'React',
      back: '리액트',
      tags: [],
    })
    return deckId
  }

  describe('세션 시작', () => {
    it('덱 ID로 학습 세션을 시작한다', () => {
      const deckId = setupDeckWithCards()
      useStudyStore.getState().startSession(deckId)
      const session = useStudyStore.getState().session
      expect(session).not.toBeNull()
      expect(session!.deckId).toBe(deckId)
      expect(session!.currentIndex).toBe(0)
      expect(session!.totalCards).toBe(3)
      expect(session!.records).toEqual([])
      expect(session!.isFlipped).toBe(false)
      expect(session!.isComplete).toBe(false)
    })

    it('현재 카드를 반환한다', () => {
      const deckId = setupDeckWithCards()
      useStudyStore.getState().startSession(deckId)
      const card = useStudyStore.getState().currentCard()
      expect(card).not.toBeNull()
      expect(card!.front).toBe('Hello')
    })
  })

  describe('카드 뒤집기', () => {
    it('카드를 뒤집는다 (앞→뒤)', () => {
      const deckId = setupDeckWithCards()
      useStudyStore.getState().startSession(deckId)
      useStudyStore.getState().flipCard()
      expect(useStudyStore.getState().session!.isFlipped).toBe(true)
    })

    it('뒤집힌 카드를 다시 앞으로 돌린다', () => {
      const deckId = setupDeckWithCards()
      useStudyStore.getState().startSession(deckId)
      useStudyStore.getState().flipCard()
      useStudyStore.getState().flipCard()
      expect(useStudyStore.getState().session!.isFlipped).toBe(false)
    })
  })

  describe('스와이프 처리', () => {
    it('좌 스와이프: "모르겠음"으로 기록하고 카드를 뒤집는다', () => {
      const deckId = setupDeckWithCards()
      useStudyStore.getState().startSession(deckId)
      useStudyStore.getState().swipe('left')
      const session = useStudyStore.getState().session!
      expect(session.isFlipped).toBe(true)
      expect(session.records).toHaveLength(1)
      expect(session.records[0].result).toBe('unknown')
    })

    it('우 스와이프: "암기함"으로 기록하고 다음 카드로 이동한다', () => {
      const deckId = setupDeckWithCards()
      useStudyStore.getState().startSession(deckId)
      useStudyStore.getState().swipe('right')
      const session = useStudyStore.getState().session!
      expect(session.currentIndex).toBe(1)
      expect(session.isFlipped).toBe(false)
      expect(session.records).toHaveLength(1)
      expect(session.records[0].result).toBe('memorized')
    })

    it('뒤집힌 상태에서 우 스와이프하면 다음 카드로 넘어간다', () => {
      const deckId = setupDeckWithCards()
      useStudyStore.getState().startSession(deckId)
      useStudyStore.getState().swipe('left')
      expect(useStudyStore.getState().session!.isFlipped).toBe(true)
      useStudyStore.getState().swipe('right')
      const session = useStudyStore.getState().session!
      expect(session.currentIndex).toBe(1)
      expect(session.isFlipped).toBe(false)
    })

    it('마지막 카드에서 우 스와이프하면 세션이 완료된다', () => {
      const deckId = setupDeckWithCards()
      useStudyStore.getState().startSession(deckId)
      useStudyStore.getState().swipe('right') // card 1
      useStudyStore.getState().swipe('right') // card 2
      useStudyStore.getState().swipe('right') // card 3
      const session = useStudyStore.getState().session!
      expect(session.isComplete).toBe(true)
      expect(session.records).toHaveLength(3)
    })
  })

  describe('학습 결과', () => {
    it('결과를 집계한다 (암기/미암기 수)', () => {
      const deckId = setupDeckWithCards()
      useStudyStore.getState().startSession(deckId)
      useStudyStore.getState().swipe('right') // 암기
      useStudyStore.getState().swipe('left')  // 모르겠음
      useStudyStore.getState().swipe('right') // 다음 (뒤집힌 상태에서)
      useStudyStore.getState().swipe('right') // 암기
      const summary = useStudyStore.getState().getSessionSummary()
      expect(summary).not.toBeNull()
      expect(summary!.memorized).toBe(2)
      expect(summary!.unknown).toBe(1)
      expect(summary!.total).toBe(3)
    })
  })

  describe('토스트 알림', () => {
    it('토스트를 추가한다', () => {
      useStudyStore.getState().addToast('저장되었습니다', 'success')
      const toasts = useStudyStore.getState().toasts
      expect(toasts).toHaveLength(1)
      expect(toasts[0].message).toBe('저장되었습니다')
      expect(toasts[0].type).toBe('success')
    })

    it('토스트를 제거한다', () => {
      useStudyStore.getState().addToast('메시지', 'success')
      const toastId = useStudyStore.getState().toasts[0].id
      useStudyStore.getState().removeToast(toastId)
      expect(useStudyStore.getState().toasts).toHaveLength(0)
    })

    it('중복 토스트를 방지한다 (같은 메시지)', () => {
      useStudyStore.getState().addToast('같은 메시지', 'success')
      useStudyStore.getState().addToast('같은 메시지', 'success')
      expect(useStudyStore.getState().toasts).toHaveLength(1)
    })
  })
})
