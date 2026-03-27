import React from 'react'

interface FlashcardProps {
  front: string
  back: string
  isFlipped: boolean
  onSwipeLeft: () => void
  onSwipeRight: () => void
  onFlip: () => void
}

const Flashcard: React.FC<FlashcardProps> = ({
  front,
  back,
  isFlipped,
  onSwipeLeft,
  onSwipeRight,
  onFlip,
}) => {
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto">
      <div
        data-testid="flashcard"
        onClick={onFlip}
        className="relative w-full aspect-[3/4] cursor-pointer [perspective:1000px]"
      >
        <div
          className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
            isFlipped ? '[transform:rotateY(180deg)]' : ''
          }`}
        >
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-[#f7f3e8] shadow-sm border border-[#e4dcc0] p-6 [backface-visibility:hidden]">
            <p className="text-2xl font-bold text-gray-900 text-center break-words leading-tight">
              {front}
            </p>
          </div>

          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white shadow-sm border border-[#e4dcc0] p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <p className="text-2xl font-bold text-gray-900 text-center break-words leading-tight">
              {back}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 w-full">
        <button
          onClick={onSwipeLeft}
          className="flex-1 py-3 px-4 rounded-xl bg-rose-500 text-white font-semibold hover:bg-rose-600 active:scale-95 transition-all"
        >
          모르겠음
        </button>
        <button
          onClick={onSwipeRight}
          className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 active:scale-95 transition-all"
        >
          암기함
        </button>
      </div>
    </div>
  )
}

export default Flashcard
