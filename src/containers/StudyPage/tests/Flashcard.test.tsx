import { describe, it, expect, vi, afterEach } from 'vitest'
import { fireEvent, act } from '@testing-library/react'
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
  afterEach(() => {
    vi.useRealTimers()
  })

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

  it('좌 스와이프 임계값을 넘기면 onSwipeLeft가 호출된다', () => {
    vi.useFakeTimers()
    const onSwipeLeft = vi.fn()
    const { getByTestId } = render(
      <Flashcard {...defaultProps} onSwipeLeft={onSwipeLeft} />,
    )
    const flashcard = getByTestId('flashcard')

    act(() => {
      fireEvent.pointerDown(flashcard, {
        pointerId: 1,
        clientX: 220,
        clientY: 200,
      })
    })
    act(() => {
      fireEvent.pointerMove(flashcard, {
        pointerId: 1,
        clientX: 80,
        clientY: 202,
      })
      fireEvent.pointerUp(flashcard, {
        pointerId: 1,
        clientX: 80,
        clientY: 202,
      })
      vi.advanceTimersByTime(260)
    })
    expect(onSwipeLeft).toHaveBeenCalledTimes(1)
  })

  it('수직 스와이프는 카드 스와이프로 처리하지 않는다', () => {
    vi.useFakeTimers()
    const onSwipeLeft = vi.fn()
    const onSwipeRight = vi.fn()
    const { getByTestId } = render(
      <Flashcard
        {...defaultProps}
        onSwipeLeft={onSwipeLeft}
        onSwipeRight={onSwipeRight}
      />,
    )
    const flashcard = getByTestId('flashcard')

    act(() => {
      fireEvent.pointerDown(flashcard, {
        pointerId: 2,
        clientX: 150,
        clientY: 120,
      })
    })
    act(() => {
      fireEvent.pointerMove(flashcard, {
        pointerId: 2,
        clientX: 154,
        clientY: 220,
      })
      fireEvent.pointerUp(flashcard, {
        pointerId: 2,
        clientX: 154,
        clientY: 220,
      })
      vi.advanceTimersByTime(260)
    })
    expect(onSwipeLeft).not.toHaveBeenCalled()
    expect(onSwipeRight).not.toHaveBeenCalled()
  })
})
