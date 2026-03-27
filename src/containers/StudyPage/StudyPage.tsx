import React, { useEffect } from 'react'
import { useDeckStore } from '@/store/useDeckStore'
import { useStudyStore } from '@/store/useStudyStore'
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

  useEffect(() => {
    if (deck) startSession(deckId)
  }, [deckId])

  if (!deck) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-gray-500 text-lg">덱을 찾을 수 없습니다</p>
      </div>
    )
  }

  if (session?.isComplete) {
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
