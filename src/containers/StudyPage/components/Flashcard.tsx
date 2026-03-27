import React, { useRef, useState } from 'react'

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
  const SWIPE_THRESHOLD = 80
  const SWIPE_OUT_X = 420
  const RESET_MS = 250
  const [translateX, setTranslateX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [dragTransition, setDragTransition] = useState('transform 500ms ease')
  const dragStartRef = useRef({ x: 0, y: 0 })
  const dragPointerIdRef = useRef<number | null>(null)
  const dragDirectionLockedRef = useRef<'horizontal' | 'vertical' | null>(null)
  const movedRef = useRef(false)

  const resetDrag = () => {
    setDragTransition('transform 180ms ease-out')
    setTranslateX(0)
    setIsDragging(false)
    dragDirectionLockedRef.current = null
    movedRef.current = false
    window.setTimeout(() => {
      setDragTransition('transform 500ms ease')
    }, 180)
  }

  const runSwipeAnimation = (direction: 'left' | 'right') => {
    const targetX = direction === 'left' ? -SWIPE_OUT_X : SWIPE_OUT_X
    setIsAnimating(true)
    setIsDragging(false)
    setDragTransition('transform 220ms ease-out')
    setTranslateX(targetX)

    window.setTimeout(() => {
      if (direction === 'left') {
        onSwipeLeft()
      } else {
        onSwipeRight()
      }
      setDragTransition('none')
      setTranslateX(0)
      requestAnimationFrame(() => {
        setDragTransition('transform 500ms ease')
        setIsAnimating(false)
      })
    }, RESET_MS)
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (isAnimating) return
    dragPointerIdRef.current = event.pointerId
    dragStartRef.current = { x: event.clientX, y: event.clientY }
    dragDirectionLockedRef.current = null
    movedRef.current = false
    setIsDragging(true)
    setDragTransition('none')
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || dragPointerIdRef.current !== event.pointerId || isAnimating) return

    const dx = event.clientX - dragStartRef.current.x
    const dy = event.clientY - dragStartRef.current.y

    if (!dragDirectionLockedRef.current) {
      const absDx = Math.abs(dx)
      const absDy = Math.abs(dy)
      if (absDx < 8 && absDy < 8) return
      if (absDx > absDy * 1.2) {
        dragDirectionLockedRef.current = 'horizontal'
      } else {
        dragDirectionLockedRef.current = 'vertical'
      }
    }

    if (dragDirectionLockedRef.current === 'vertical') {
      setIsDragging(false)
      dragPointerIdRef.current = null
      return
    }

    event.preventDefault()
    movedRef.current = Math.abs(dx) > 6
    setTranslateX(dx)
  }

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragPointerIdRef.current !== event.pointerId || isAnimating) return
    const dx = event.clientX - dragStartRef.current.x
    dragPointerIdRef.current = null

    if (dragDirectionLockedRef.current !== 'horizontal') {
      resetDrag()
      return
    }
    if (dx <= -SWIPE_THRESHOLD) {
      runSwipeAnimation('left')
      return
    }
    if (dx >= SWIPE_THRESHOLD) {
      runSwipeAnimation('right')
      return
    }
    resetDrag()
  }

  const handlePointerCancel = () => {
    dragPointerIdRef.current = null
    if (!isAnimating) resetDrag()
  }

  const handleClick = () => {
    if (isAnimating || movedRef.current) return
    onFlip()
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto">
      <div
        data-testid="flashcard"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onClick={handleClick}
        className="relative w-full aspect-[3/4] cursor-pointer [perspective:1000px] touch-pan-y select-none"
      >
        <div
          className={`relative w-full h-full [transform-style:preserve-3d] ${
            isFlipped ? '[transform:rotateY(180deg)]' : ''
          }`}
          style={{
            transform: `${isFlipped ? 'rotateY(180deg) ' : ''}translateX(${translateX}px) rotate(${translateX * 0.04}deg)`,
            transition: isDragging ? 'none' : dragTransition,
          }}
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
          disabled={isAnimating}
          className="flex-1 py-3 px-4 rounded-xl bg-rose-500 text-white font-semibold hover:bg-rose-600 active:scale-95 transition-all"
        >
          모르겠음
        </button>
        <button
          onClick={onSwipeRight}
          disabled={isAnimating}
          className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 active:scale-95 transition-all"
        >
          암기함
        </button>
      </div>
    </div>
  )
}

export default Flashcard
