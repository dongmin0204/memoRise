import React from 'react'

interface CardDetailSheetProps {
  isOpen: boolean
  back: string
  tags: string[]
  imageUrl?: string
  onClose: () => void
}

const CardDetailSheet: React.FC<CardDetailSheetProps> = ({
  isOpen,
  back,
  tags,
  imageUrl,
  onClose,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
      <div className="w-full max-w-lg bg-[#f7f3e8] rounded-t-2xl p-6 pb-8 animate-slide-up max-h-[80vh] overflow-y-auto border-t border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">카드 상세</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
            aria-label="닫기"
          >
            &times;
          </button>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white/70 p-4 mb-4">
          <p className="text-xl text-gray-900 leading-relaxed break-words">{back}</p>
        </div>

        {imageUrl && (
          <img
            src={imageUrl}
            alt="카드 이미지"
            className="w-full rounded-lg mb-4 object-cover max-h-60"
          />
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-white border border-gray-200 text-gray-800 rounded-full text-sm font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CardDetailSheet
