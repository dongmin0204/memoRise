import { Link } from 'react-router-dom'
import LocaleToggle from '../../containers/LocaleToggle/LocaleToggle'
import { Button } from '../ui/button'
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react'

interface HeaderProps {
  onToggleDeckSidebar?: () => void
  isDeckSidebarOpen?: boolean
  isDesktop?: boolean
}

function Header({
  onToggleDeckSidebar,
  isDeckSidebarOpen = false,
  isDesktop = false,
}: HeaderProps) {
  return (
    <header className="bg-white shadow-md">
      <nav className="container px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isDesktop ? (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={onToggleDeckSidebar}
                aria-label={isDeckSidebarOpen ? '사이드바 접기' : '사이드바 펼치기'}
              >
                {isDeckSidebarOpen ? (
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                )}
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={onToggleDeckSidebar}
                aria-label="단어장 사이드바 토글"
              >
                <span className="sr-only">단어장 토글</span>
                <Menu className="h-4 w-4" aria-hidden="true" />
              </Button>
            )}

            <Link
              to="/decks"
              className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
            >
              memoRise
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link 
              to="/decks"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              단어장
            </Link>
            <LocaleToggle />
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
