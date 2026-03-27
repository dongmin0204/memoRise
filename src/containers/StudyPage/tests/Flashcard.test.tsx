import { describe, it, expect, beforeEach } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { render } from '@test/test-utils'
import Flashcard from '../components/Flashcard'

const defaultProps = {
  front: 'Hello',
  back: '안녕하세요',
  isFlipped: false,
  onSwipeLeft: () => {},
  onSwipeRight: () => {},
  onFlip: () => {},
}

describe('Flashcard', () => {
  it('앞면 텍스트를 보여준다', () => {
    const { getByText } = render(<Flashcard {...defaultProps} />)
    expect(getByText('Hello')).toBeInTheDocument()
  })

  it('뒤집힌 상태에서 뒷면 텍스트를 보여준다', () => {
    const { getByText } = render(
      <Flashcard {...defaultProps} isFlipped={true} />,
    )
    expect(getByText('안녕하세요')).toBeInTheDocument()
  })

  it('카드를 클릭하면 onFlip이 호출된다', () => {
    let flipped = false
    const { getByTestId } = render(
      <Flashcard {...defaultProps} onFlip={() => (flipped = true)} />,
    )
    fireEvent.click(getByTestId('flashcard'))
    expect(flipped).toBe(true)
  })

  it('"모르겠음" 버튼 클릭 시 onSwipeLeft가 호출된다', () => {
    let called = false
    const { getByRole } = render(
      <Flashcard {...defaultProps} onSwipeLeft={() => (called = true)} />,
    )
    fireEvent.click(getByRole('button', { name: /모르겠음/i }))
    expect(called).toBe(true)
  })

  it('"암기함" 버튼 클릭 시 onSwipeRight가 호출된다', () => {
    let called = false
    const { getByRole } = render(
      <Flashcard {...defaultProps} onSwipeRight={() => (called = true)} />,
    )
    fireEvent.click(getByRole('button', { name: /암기함/i }))
    expect(called).toBe(true)
  })
})
