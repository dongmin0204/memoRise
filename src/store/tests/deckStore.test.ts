import { describe, it, expect, beforeEach } from 'vitest'
import { useDeckStore } from '../useDeckStore'

// 이 파일은 UI/컴포넌트가 아니라 “Zustand 스토어 로직”을 검증
// React Testing Library(render) 없이 getState()로 상태를 직접 조작/검증
describe('useDeckStore', () => {
  beforeEach(() => {
    // 각 테스트 간 state가 섞이지 않도록 초기화
    useDeckStore.getState().reset()
  })

  describe('초기 상태', () => {
    // 스토어 초기값이 기대한 형태인지 확인
    it('빈 덱 리스트로 시작한다', () => {
      const { decks } = useDeckStore.getState()
      expect(decks).toEqual([])
    })
  })

  describe('덱 CRUD', () => {
    // addDeck: 덱 생성이 제대로 되는지 확인
    it('새 덱을 추가한다', () => {
      useDeckStore.getState().addDeck('기본 인사', '기본 인사말 모음')
      const { decks } = useDeckStore.getState()
      expect(decks).toHaveLength(1)
      expect(decks[0].name).toBe('기본 인사')
      expect(decks[0].description).toBe('기본 인사말 모음')
      expect(decks[0].cards).toEqual([])

      // 새로 만든 덱은 초기 카드가 비어 있어야 한다.
    })

    // removeDeck: 덱 삭제가 제대로 되는지 확인
    it('덱을 삭제한다', () => {
      useDeckStore.getState().addDeck('테스트', '설명')
      const deckId = useDeckStore.getState().decks[0].id
      useDeckStore.getState().removeDeck(deckId)
      expect(useDeckStore.getState().decks).toHaveLength(0)
    })

    // updateDeck: 덱 이름/설명 업데이트가 되는지 확인
    it('덱 이름/설명을 수정한다', () => {
      useDeckStore.getState().addDeck('원래 이름', '원래 설명')
      const deckId = useDeckStore.getState().decks[0].id
      useDeckStore.getState().updateDeck(deckId, {
        name: '바뀐 이름',
        description: '바뀐 설명',
      })
      const deck = useDeckStore.getState().decks[0]
      expect(deck.name).toBe('바뀐 이름')
      expect(deck.description).toBe('바뀐 설명')
    })

    // getDeckById: 존재하는 ID로 조회 시 데이터가 나오는지 확인
    it('ID로 덱을 조회한다', () => {
      useDeckStore.getState().addDeck('조회 테스트', '설명')
      const deckId = useDeckStore.getState().decks[0].id
      const deck = useDeckStore.getState().getDeckById(deckId)
      expect(deck?.name).toBe('조회 테스트')
    })

    // getDeckById: 없는 ID로 조회하면 undefined를 반환하는 “계약”을 테스트로 고정
    it('없는 ID로 조회하면 undefined를 반환한다', () => {
      const deck = useDeckStore.getState().getDeckById('nonexistent')
      expect(deck).toBeUndefined()
    })
  })

  describe('덱 생성 (createDeck)', () => {
    // 새 덱 생성 로직의 핵심 계약:
    // - name이 공백이면 생성하지 않는다
    it('이름이 공백이면 새 덱을 만들지 않는다', () => {
      const result = useDeckStore.getState().createDeck('   ', '설명')
      expect(result.ok).toBe(false)

      // 실패 시 덱 배열은 변경되면 안 된다.
      expect(useDeckStore.getState().decks).toHaveLength(0)
    })

    // 입력값 trim 적용 + 성공 결과 반환 + 생성된 덱의 데이터 일치 확인
    it('이름은 trim 되어 저장된다', () => {
      const result = useDeckStore.getState().createDeck('  새 단어장  ', '  설명  ')
      expect(result.ok).toBe(true)
      if (!result.ok) throw new Error('expected ok result')

      // result.ok === true 인 경우에만 deckId가 존재하도록 타입이 좁혀진다.
      expect(result.deckId).toBeTruthy()

      const deck = useDeckStore.getState().decks[0]
      expect(deck.name).toBe('새 단어장')
      expect(deck.description).toBe('설명')
    })

    // 정상 생성 시 카드 목록은 비어 있어야 한다.
    it('정상 생성 시 카드 목록은 비어있다', () => {
      const result = useDeckStore.getState().createDeck('덱', '설명')
      expect(result.ok).toBe(true)
      if (!result.ok) throw new Error('expected ok result')

      const deck = useDeckStore.getState().decks[0]
      expect(deck.cards).toHaveLength(0)
    })
  })

  describe('카드 CRUD', () => {
    // 덱 생성 후 addCard로 카드가 들어가는지 확인
    it('덱에 카드를 추가한다', () => {
      useDeckStore.getState().addDeck('덱', '설명')
      const deckId = useDeckStore.getState().decks[0].id
      useDeckStore.getState().addCard(deckId, {
        front: 'Hello',
        back: '안녕하세요',
        tags: ['인사'],
      })
      const deck = useDeckStore.getState().decks[0]
      expect(deck.cards).toHaveLength(1)
      expect(deck.cards[0].front).toBe('Hello')
      expect(deck.cards[0].back).toBe('안녕하세요')
      expect(deck.cards[0].tags).toEqual(['인사'])
    })

    // 덱에서 특정 카드 삭제가 되는지 확인
    it('덱에서 카드를 삭제한다', () => {
      useDeckStore.getState().addDeck('덱', '설명')
      const deckId = useDeckStore.getState().decks[0].id
      useDeckStore.getState().addCard(deckId, {
        front: 'Test',
        back: '테스트',
        tags: [],
      })
      const cardId = useDeckStore.getState().decks[0].cards[0].id
      useDeckStore.getState().removeCard(deckId, cardId)
      expect(useDeckStore.getState().decks[0].cards).toHaveLength(0)
    })

    // 덱 내 특정 카드 수정이 되는지 확인
    it('카드를 수정한다', () => {
      useDeckStore.getState().addDeck('덱', '설명')
      const deckId = useDeckStore.getState().decks[0].id
      useDeckStore.getState().addCard(deckId, {
        front: '원래',
        back: '원래뒤',
        tags: [],
      })
      const cardId = useDeckStore.getState().decks[0].cards[0].id
      useDeckStore.getState().updateCard(deckId, cardId, {
        front: '수정됨',
        back: '수정뒤',
        tags: ['새태그'],
      })
      const card = useDeckStore.getState().decks[0].cards[0]
      expect(card.front).toBe('수정됨')
      expect(card.back).toBe('수정뒤')
      expect(card.tags).toEqual(['새태그'])
    })
  })
})
