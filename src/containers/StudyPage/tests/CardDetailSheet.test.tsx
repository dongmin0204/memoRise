import { describe, it, expect } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { render } from '@test/test-utils'
import CardDetailSheet from '../components/CardDetailSheet'

const defaultProps = {
  isOpen: true,
  back: '안녕하세요',
  tags: ['인사', '기본'],
  onClose: () => {},
}

describe('CardDetailSheet (이슈 #3: 뒷장 디테일 UI)', () => {
  it('열린 상태에서 뒷면 텍스트를 보여준다', () => {
    const { getByText } = render(<CardDetailSheet {...defaultProps} />)
    expect(getByText('안녕하세요')).toBeInTheDocument()
  })

  it('태그를 표시한다', () => {
    const { getByText } = render(<CardDetailSheet {...defaultProps} />)
    expect(getByText('#인사')).toBeInTheDocument()
    expect(getByText('#기본')).toBeInTheDocument()
  })

  it('이미지가 있으면 표시한다', () => {
    const { getByAltText } = render(
      <CardDetailSheet {...defaultProps} imageUrl="https://example.com/img.png" />,
    )
    expect(getByAltText(/카드 이미지/i)).toBeInTheDocument()
  })

  it('이미지가 없으면 이미지 영역을 숨긴다', () => {
    const { queryByAltText } = render(<CardDetailSheet {...defaultProps} />)
    expect(queryByAltText(/카드 이미지/i)).not.toBeInTheDocument()
  })

  it('닫기 버튼 클릭 시 onClose가 호출된다', () => {
    let closed = false
    const { getByRole } = render(
      <CardDetailSheet {...defaultProps} onClose={() => (closed = true)} />,
    )
    fireEvent.click(getByRole('button', { name: /닫기/i }))
    expect(closed).toBe(true)
  })

  it('isOpen이 false면 렌더링하지 않는다', () => {
    const { queryByText } = render(
      <CardDetailSheet {...defaultProps} isOpen={false} />,
    )
    expect(queryByText('안녕하세요')).not.toBeInTheDocument()
  })
})
