import React from 'react'
import { useDeckStore } from '@/store/useDeckStore'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface DeckListPageProps {
  onSelectDeck?: (deckId: string) => void
}

const DeckListPage: React.FC<DeckListPageProps> = ({ onSelectDeck }) => {
  const { decks, removeDeck, createDeck } = useDeckStore()

  // 새 단어장 생성 모달 상태
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [deckName, setDeckName] = React.useState('')
  const [deckDescription, setDeckDescription] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)

  const closeModal = () => {
    setIsCreateOpen(false)
    setDeckName('')
    setDeckDescription('')
    setError(null)
  }

  const submitCreate = () => {
    // 로직 계약: 스토어에서 trim/검증을 처리하고 ok/error 반환한다.
    const result = createDeck(deckName, deckDescription)
    if (!result.ok) {
      setError('이름을 입력해주세요')
      return
    }

    // 생성 성공: 모달 닫고 목록에서 방금 만든 덱으로 진입 시도
    closeModal()
    onSelectDeck?.(result.deckId)
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-6 px-4">
      <div className="rounded-2xl border border-gray-200 bg-[#f7f3e8] p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-900">내 단어장</h1>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-600 active:scale-95 transition-all text-sm"
          >
            새 단어장
          </button>
        </div>

        {decks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-gray-600 text-lg">단어장이 없습니다</p>
            <p className="text-gray-500 text-sm mt-1">
              새 단어장을 만들어 학습을 시작하세요
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {decks.map((deck) => (
              <li
                key={deck.id}
                className="bg-white rounded-xl border border-gray-200 p-3 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={() => onSelectDeck?.(deck.id)}
                    className="flex-1 text-left min-w-0"
                  >
                    <div className="border-l-4 border-gray-300 pl-3">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {deck.name}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {deck.description}
                    </p>
                    <p className="text-xs text-indigo-600 mt-2 font-medium">
                      {deck.cards.length}장
                    </p>
                  </button>

                  <button
                    onClick={() => removeDeck(deck.id)}
                    className="shrink-0 px-3 py-1.5 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    aria-label="삭제"
                  >
                    삭제
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {isCreateOpen && (
        // RTL 안정성을 위해 role="dialog" 사용
        <div
          role="dialog"
          aria-modal="true"
          aria-label="새 단어장 만들기"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onMouseDown={(e) => {
            // 백드롭 클릭으로 닫기
            if (e.target === e.currentTarget) closeModal()
          }}
        >
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-gray-900">새 단어장</div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="닫기"
                onClick={closeModal}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-800">
                단어장 이름
                <input
                  value={deckName}
                  onChange={(e) => setDeckName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </label>

              <label className="block text-sm font-medium text-gray-800">
                설명
                <input
                  value={deckDescription}
                  onChange={(e) => setDeckDescription(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </label>

              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {error}
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <Button type="button" variant="outline" size="default" onClick={closeModal}>
                  취소
                </Button>
                <Button type="button" size="default" onClick={submitCreate}>
                  생성
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DeckListPage
