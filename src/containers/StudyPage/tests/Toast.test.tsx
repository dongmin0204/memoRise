import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@test/test-utils'
import Toast from '../components/Toast'

describe('Toast (이슈 #4: 토스트 알림)', () => {
  it('메시지를 표시한다', () => {
    const { getByText } = render(
      <Toast message="저장되었습니다" type="success" onDismiss={() => {}} />,
    )
    expect(getByText('저장되었습니다')).toBeInTheDocument()
  })

  it('success 타입에 적절한 스타일을 적용한다', () => {
    const { getByTestId } = render(
      <Toast message="성공" type="success" onDismiss={() => {}} />,
    )
    expect(getByTestId('toast')).toHaveClass('bg-green-500')
  })

  it('error 타입에 적절한 스타일을 적용한다', () => {
    const { getByTestId } = render(
      <Toast message="실패" type="error" onDismiss={() => {}} />,
    )
    expect(getByTestId('toast')).toHaveClass('bg-red-500')
  })

  it('자동으로 사라진다 (3초 후)', () => {
    vi.useFakeTimers()
    let dismissed = false
    render(
      <Toast
        message="자동 닫힘"
        type="success"
        onDismiss={() => (dismissed = true)}
      />,
    )
    vi.advanceTimersByTime(3000)
    expect(dismissed).toBe(true)
    vi.useRealTimers()
  })
})
