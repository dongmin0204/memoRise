import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDeckStore } from '@/store/useDeckStore'

const getActiveDeckId = (pathname: string) => {
  // pathname example: /study/<deckId>
  const match = pathname.match(/^\/study\/(.+)$/)
  return match ? match[1] : null
}

interface DeckSidebarProps {
  isOpen: boolean
  onSelectDeck?: () => void
}

const DeckSidebar: React.FC<DeckSidebarProps> = ({ isOpen, onSelectDeck }) => {
  const { decks } = useDeckStore()
  const location = useLocation()
  const activeDeckId = getActiveDeckId(location.pathname)

  return (
    <aside
      className={[
        'bg-white overflow-hidden transition-[width,border-color] duration-200',
        isOpen ? 'w-72 border-r border-gray-200' : 'w-0 border-r-0',
      ].join(' ')}
    >
      <div className="p-4 sticky top-0">
        <div className="text-sm font-semibold text-gray-700 mb-3">
          단어장
        </div>

        {decks.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-[#f7f3e8] px-3 py-3 text-sm text-gray-600">
            덱이 아직 없어요.
          </div>
        ) : (
          <nav className="flex flex-col gap-2">
            {decks.map((deck) => {
              const isActive = activeDeckId === deck.id
              return (
                <Link
                  key={deck.id}
                  to={`/study/${deck.id}`}
                  onClick={() => onSelectDeck?.()}
                  className={[
                    'rounded-xl border px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'border-gray-400 bg-[#f7f3e8] text-gray-900'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-[#f7f3e8]',
                  ].join(' ')}
                >
                  <div className="font-semibold leading-snug">{deck.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {deck.cards.length}장
                  </div>
                </Link>
              )
            })}
          </nav>
        )}
      </div>
    </aside>
  )
}

export default DeckSidebar

