import { describe, it, expect } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { render } from '@test/test-utils'
import StudyResult from '../components/StudyResult'

const defaultProps = {
  memorized: 8,
  unknown: 2,
  total: 10,
  onRestart: () => {},
  onGoHome: () => {},
}

describe('StudyResult (이슈 #4: 공부 결과 UI)', () => {
  it('"학습 완료" 타이틀을 보여준다', () => {
    const { getByText } = render(<StudyResult {...defaultProps} />)
    expect(getByText(/학습 완료/i)).toBeInTheDocument()
  })

  it('암기한 카드 수를 보여준다', () => {
    const { getByText } = render(<StudyResult {...defaultProps} />)
    expect(getByText('8')).toBeInTheDocument()
  })

  it('모르는 카드 수를 보여준다', () => {
    const { getByText } = render(<StudyResult {...defaultProps} />)
    expect(getByText('2')).toBeInTheDocument()
  })

  it('전체 카드 수를 보여준다', () => {
    const { getByText } = render(<StudyResult {...defaultProps} />)
    expect(getByText('10')).toBeInTheDocument()
  })

  it('"다시 학습" 버튼 클릭 시 onRestart가 호출된다', () => {
    let restarted = false
    const { getByRole } = render(
      <StudyResult {...defaultProps} onRestart={() => (restarted = true)} />,
    )
    fireEvent.click(getByRole('button', { name: /다시 학습/i }))
    expect(restarted).toBe(true)
  })

  it('"홈으로" 버튼 클릭 시 onGoHome이 호출된다', () => {
    let wentHome = false
    const { getByRole } = render(
      <StudyResult {...defaultProps} onGoHome={() => (wentHome = true)} />,
    )
    fireEvent.click(getByRole('button', { name: /홈으로/i }))
    expect(wentHome).toBe(true)
  })
})
