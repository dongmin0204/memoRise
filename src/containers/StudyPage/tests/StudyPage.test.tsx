import { describe, it, expect, beforeEach } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { render } from '@test/test-utils'
import StudyPage from '../StudyPage'
import { useDeckStore } from '@/store/useDeckStore'
import { useStudyStore } from '@/store/useStudyStore'

const setupDeck = () => {
  useDeckStore.getState().reset()
  useStudyStore.getState().reset()
  useDeckStore.getState().addDeck('테스트덱', '테스트')
  const deckId = useDeckStore.getState().decks[0].id
  useDeckStore.getState().addCard(deckId, {
    front: 'Apple',
    back: '사과',
    tags: ['과일'],
  })
  useDeckStore.getState().addCard(deckId, {
    front: 'Banana',
    back: '바나나',
    tags: ['과일'],
  })
  return deckId
}

const setupEmptyDeck = () => {
  useDeckStore.getState().reset()
  useStudyStore.getState().reset()
  useDeckStore.getState().addDeck('빈덱', '테스트')
  return useDeckStore.getState().decks[0].id
}

describe('StudyPage', () => {
  beforeEach(() => {
    useDeckStore.getState().reset()
    useStudyStore.getState().reset()
  })

  it('덱이 없으면 안내 메시지를 보여준다', () => {
    const { getByText } = render(<StudyPage deckId="nonexistent" />)
    expect(getByText(/덱을 찾을 수 없습니다/i)).toBeInTheDocument()
  })

  it('첫 번째 카드의 앞면을 보여준다', () => {
    const deckId = setupDeck()
    const { getByText } = render(<StudyPage deckId={deckId} />)
    expect(getByText('Apple')).toBeInTheDocument()
  })

  it('진행 상태를 표시한다 (1/2)', () => {
    const deckId = setupDeck()
    const { getByText } = render(<StudyPage deckId={deckId} />)
    expect(getByText('1')).toBeInTheDocument()
    expect(getByText('2')).toBeInTheDocument()
  })

  it('"암기함" 클릭 시 다음 카드로 넘어간다', () => {
    const deckId = setupDeck()
    const { getByText, getByRole } = render(<StudyPage deckId={deckId} />)
    fireEvent.click(getByRole('button', { name: /암기함/i }))
    expect(getByText('Banana')).toBeInTheDocument()
  })

  it('"모르겠음" 클릭 시 카드가 뒤집힌다', () => {
    const deckId = setupDeck()
    const { getByText, getByRole } = render(<StudyPage deckId={deckId} />)
    fireEvent.click(getByRole('button', { name: /모르겠음/i }))
    expect(getByText('사과')).toBeInTheDocument()
  })

  it('카드 추가 폼으로 새 카드를 추가할 수 있다', () => {
    const deckId = setupDeck()
    const { getByRole } = render(<StudyPage deckId={deckId} />)

    fireEvent.change(getByRole('textbox', { name: /카드 앞면/i }), {
      target: { value: 'Cherry' },
    })
    fireEvent.change(getByRole('textbox', { name: /카드 뒷면/i }), {
      target: { value: '체리' },
    })
    fireEvent.change(getByRole('textbox', { name: /카드 태그/i }), {
      target: { value: '과일, 빨강' },
    })
    fireEvent.click(getByRole('button', { name: /카드 추가/i }))

    const deck = useDeckStore.getState().getDeckById(deckId)
    expect(deck?.cards).toHaveLength(3)
    expect(deck?.cards[2].front).toBe('Cherry')
    expect(deck?.cards[2].back).toBe('체리')
    expect(deck?.cards[2].tags).toEqual(['과일', '빨강'])
  })

  it('0장 덱에서도 카드 추가 폼이 보이고 첫 카드를 추가할 수 있다', () => {
    const deckId = setupEmptyDeck()
    const { getByRole, getByText } = render(<StudyPage deckId={deckId} />)
    expect(
      getByText(/아직 카드가 없습니다. 아래 폼에서 첫 카드를 추가해 주세요./i),
    ).toBeInTheDocument()

    fireEvent.change(getByRole('textbox', { name: /카드 앞면/i }), {
      target: { value: 'Start' },
    })
    fireEvent.change(getByRole('textbox', { name: /카드 뒷면/i }), {
      target: { value: '시작' },
    })
    fireEvent.click(getByRole('button', { name: /카드 추가/i }))

    expect(getByText('Start')).toBeInTheDocument()
    const deck = useDeckStore.getState().getDeckById(deckId)
    expect(deck?.cards).toHaveLength(1)
  })

  it('모든 카드 학습 완료 시 결과 화면을 보여준다', () => {
    const deckId = setupDeck()
    const { getByText, getByRole } = render(<StudyPage deckId={deckId} />)
    fireEvent.click(getByRole('button', { name: /암기함/i }))
    fireEvent.click(getByRole('button', { name: /암기함/i }))
    expect(getByText(/학습 완료/i)).toBeInTheDocument()
  })

  it('학습 완료 후 리렌더되어도 세션이 자동 재시작되지 않는다', () => {
    const deckId = setupDeck()
    const { getByText, getByRole, rerender } = render(<StudyPage deckId={deckId} />)

    fireEvent.click(getByRole('button', { name: /암기함/i }))
    fireEvent.click(getByRole('button', { name: /암기함/i }))
    expect(getByText(/학습 완료/i)).toBeInTheDocument()

    rerender(<StudyPage deckId={deckId} />)
    expect(getByText(/학습 완료/i)).toBeInTheDocument()
    expect(useStudyStore.getState().session?.isComplete).toBe(true)
  })
})
