import { describe, it, expect, beforeEach, vi } from 'vitest'
import { fireEvent, waitFor } from '@testing-library/react'
import { render, screen } from '@test/test-utils'
import DeckListPage from '../DeckListPage'
import { useDeckStore } from '@/store/useDeckStore'

describe('DeckListPage (단어장 목록 관리)', () => {
  beforeEach(() => {
    useDeckStore.getState().reset()
  })

  it('덱이 없으면 빈 상태 안내를 보여준다', () => {
    const { getByText } = render(<DeckListPage />)
    expect(getByText(/단어장이 없습니다/i)).toBeInTheDocument()
  })

  it('"새 단어장" 버튼이 있다', () => {
    const { getByRole } = render(<DeckListPage />)
    expect(getByRole('button', { name: /새 단어장/i })).toBeInTheDocument()
  })

  it('덱 목록을 보여준다', () => {
    useDeckStore.getState().addDeck('영어 기초', '기초 영단어')
    useDeckStore.getState().addDeck('일본어 N3', 'JLPT N3 단어')
    const { getByText } = render(<DeckListPage />)
    expect(getByText('영어 기초')).toBeInTheDocument()
    expect(getByText('일본어 N3')).toBeInTheDocument()
  })

  it('각 덱에 카드 수를 표시한다', () => {
    useDeckStore.getState().addDeck('테스트', '설명')
    const deckId = useDeckStore.getState().decks[0].id
    useDeckStore.getState().addCard(deckId, {
      front: 'A',
      back: 'B',
      tags: [],
    })
    useDeckStore.getState().addCard(deckId, {
      front: 'C',
      back: 'D',
      tags: [],
    })
    const { getByText } = render(<DeckListPage />)
    expect(getByText(/2장/)).toBeInTheDocument()
  })

  it('덱 삭제 버튼을 클릭하면 덱이 삭제된다', async () => {
    useDeckStore.getState().addDeck('삭제 테스트', '설명')
    const { getByLabelText, queryByText } = render(<DeckListPage />)
    fireEvent.click(getByLabelText('삭제'))
    await waitFor(() => {
      expect(queryByText('삭제 테스트')).not.toBeInTheDocument()
    })
  })

  it('새 단어장 버튼을 누르면 모달이 열린다', () => {
    render(<DeckListPage />)

    fireEvent.click(screen.getByRole('button', { name: /새 단어장/i }))

    const dialog = screen.getByRole('dialog', { name: /새 단어장 만들기/i })
    expect(dialog).toBeInTheDocument()
    expect(screen.getByLabelText('단어장 이름')).toBeInTheDocument()
    expect(screen.getByLabelText('설명')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /생성/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /취소/i })).toBeInTheDocument()
  })

  it('이름 없이 생성하면 덱이 생성되지 않는다', () => {
    render(<DeckListPage />)

    fireEvent.click(screen.getByRole('button', { name: /새 단어장/i }))
    fireEvent.click(screen.getByRole('button', { name: /생성/i }))

    expect(screen.getByText(/이름을 입력해주세요/i)).toBeInTheDocument()
    expect(useDeckStore.getState().decks).toHaveLength(0)
  })

  it('이름과 설명을 입력하면 덱이 생성된다', async () => {
    const onSelectDeck = vi.fn()

    render(<DeckListPage onSelectDeck={onSelectDeck} />)
    fireEvent.click(screen.getByRole('button', { name: /새 단어장/i }))

    fireEvent.change(screen.getByLabelText('단어장 이름'), {
      target: { value: '새 덱 테스트' },
    })
    fireEvent.change(screen.getByLabelText('설명'), {
      target: { value: '설명 테스트' },
    })

    fireEvent.click(screen.getByRole('button', { name: /생성/i }))

    await waitFor(() => {
      expect(
        screen.queryByRole('dialog', { name: /새 단어장 만들기/i }),
      ).not.toBeInTheDocument()
    })

    expect(screen.getByText('새 덱 테스트')).toBeInTheDocument()

    expect(onSelectDeck).toHaveBeenCalledTimes(1)
    expect(typeof onSelectDeck.mock.calls[0][0]).toBe('string')
  })
})
