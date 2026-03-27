import React, { useEffect, useState } from 'react'
import { useDeckStore } from '@/store/useDeckStore'
import { useStudyStore } from '@/store/useStudyStore'
import { useAddCard } from '@/hooks/useAddCard'
import Flashcard from './components/Flashcard'
import StudyResult from './components/StudyResult'
import Toast from './components/Toast'

interface StudyPageProps {
  deckId: string
  onGoHome?: () => void
}

const StudyPage: React.FC<StudyPageProps> = ({ deckId, onGoHome }) => {
  const deck = useDeckStore((s) => s.getDeckById(deckId))
  const { session, toasts, startSession, flipCard, swipe, currentCard, getSessionSummary, addToast, removeToast } = useStudyStore()
  const addCard = useAddCard(deckId)
  const [frontInput, setFrontInput] = useState('')
  const [backInput, setBackInput] = useState('')
  const [tagsInput, setTagsInput] = useState('')

  useEffect(() => {
    // persist hydrate 이후 deck이 늦게 생길 수 있으므로 deck/startSession도 의존성에 포함한다.
    if (!deck) return

    // 동일한 덱 세션이 이미 초기화되어 있으면 재초기화하지 않는다.
    if (session?.deckId === deckId) return

    startSession(deckId)
  }, [deck, deckId, session?.deckId, startSession])
  if (!deck) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-gray-500 text-lg">덱을 찾을 수 없습니다</p>
      </div>
    )
  }

  const isEmptySession = session?.isComplete && session.totalCards === 0

  if (session?.isComplete && !isEmptySession) {
    const summary = getSessionSummary()
    return (
      <StudyResult
        memorized={summary?.memorized ?? 0}
        unknown={summary?.unknown ?? 0}
        total={summary?.total ?? 0}
        onRestart={() => startSession(deckId)}
        onGoHome={onGoHome ?? (() => {})}
      />
    )
  }

  const card = currentCard()
  const handleAddCard = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const result = addCard({
      front: frontInput,
      back: backInput,
      tags: tagsInput,
    })

    if (!result.ok) {
      addToast(
        result.error === 'FRONT_REQUIRED'
          ? '앞면 내용을 입력해 주세요'
          : '뒷면 내용을 입력해 주세요',
        'error',
      )
      return
    }

    setFrontInput('')
    setBackInput('')
    setTagsInput('')
    addToast('카드가 추가되었습니다', 'success')
    startSession(deckId)
  }

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto">
      {session && (
        <div className="rounded-2xl border border-gray-200 bg-white/90 p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="font-semibold text-indigo-700">
              {session.currentIndex + 1}
            </span>
            <span>/</span>
            <span className="text-gray-700">{session.totalCards}</span>
          </div>
        </div>
      )}

      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600 transition-all duration-300"
          style={{
            width: session
              ? session.totalCards === 0
                ? '0%'
                : `${((session.currentIndex + 1) / session.totalCards) * 100}%`
              : '0%',
          }}
        />
      </div>

      {card && (
        <div className="rounded-2xl border border-gray-200 bg-[#f7f3e8] p-3">
          <Flashcard
            front={card.front}
            back={card.back}
            isFlipped={session?.isFlipped ?? false}
            onSwipeLeft={() => {
              swipe('left')
              addToast('카드가 "모르겠음"으로 기록되었습니다', 'info')
            }}
            onSwipeRight={() => {
              swipe('right')
              addToast('저장되었습니다', 'success')
            }}
            onFlip={flipCard}
          />
        </div>
      )}

      {!card && session?.totalCards === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-600">
          아직 카드가 없습니다. 아래 폼에서 첫 카드를 추가해 주세요.
        </div>
      )}

      <form
        onSubmit={handleAddCard}
        className="rounded-2xl border border-gray-200 bg-white p-4 space-y-3"
      >
        <div className="space-y-1">
          <label htmlFor="study-add-front" className="text-sm font-medium text-gray-800">
            카드 앞면
          </label>
          <input
            id="study-add-front"
            type="text"
            value={frontInput}
            onChange={(event) => setFrontInput(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            placeholder="예: Apple"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="study-add-back" className="text-sm font-medium text-gray-800">
            카드 뒷면
          </label>
          <input
            id="study-add-back"
            type="text"
            value={backInput}
            onChange={(event) => setBackInput(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            placeholder="예: 사과"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="study-add-tags" className="text-sm font-medium text-gray-800">
            카드 태그
          </label>
          <input
            id="study-add-tags"
            type="text"
            value={tagsInput}
            onChange={(event) => setTagsInput(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            placeholder="예: 과일, 영어"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          카드 추가
        </button>
      </form>

      <div className="fixed bottom-4 left-0 right-0 flex flex-col items-center gap-2 px-4 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <Toast
              message={t.message}
              type={t.type}
              onDismiss={() => removeToast(t.id)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default StudyPage