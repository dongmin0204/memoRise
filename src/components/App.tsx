import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
  useNavigate,
  Navigate,
} from 'react-router-dom'
import LanguageProvider from '../containers/LanguageProvider/LanguageProvider'
import Header from './Header/Header'
import Footer from './Footer/Footer'
import NotFoundPage from '../containers/NotFoundPage/NotFoundPage'
import DeckListPage from '../containers/DeckListPage/DeckListPage'
import StudyPage from '../containers/StudyPage/StudyPage'
import DeckSidebar from './Sidebar/DeckSidebar'
import { useMediaQuery } from '../hooks/useMediaQuery'

const StudyPageRoute: React.FC = () => {
  const { deckId } = useParams<{ deckId: string }>()
  const navigate = useNavigate()
  if (!deckId) return null
  return <StudyPage deckId={deckId} onGoHome={() => navigate('/decks')} />
}

const DeckListPageRoute: React.FC = () => {
  const navigate = useNavigate()
  return <DeckListPage onSelectDeck={(id) => navigate(`/study/${id}`)} />
}

const App: React.FC = () => {
  const isDesktop = useMediaQuery('(min-width: 721px)')
  const [isDeckSidebarOpen, setIsDeckSidebarOpen] = React.useState(() => isDesktop)

  React.useEffect(() => {
    setIsDeckSidebarOpen(isDesktop)
  }, [isDesktop])

  return (
    <LanguageProvider>
        <Router>
          <div className="min-h-screen bg-gray-100 flex flex-col">
            <Header
              onToggleDeckSidebar={() =>
                setIsDeckSidebarOpen((prev) => !prev)
              }
              isDeckSidebarOpen={isDeckSidebarOpen}
              isDesktop={isDesktop}
            />
            <div className="flex flex-1">
              <DeckSidebar
                isOpen={isDeckSidebarOpen}
                onSelectDeck={() => setIsDeckSidebarOpen(false)}
              />
              <main className="flex-1 px-4 py-8">
                <Routes>
                  <Route path="/" element={<Navigate to="/decks" replace />} />
                  <Route path="/decks" element={<DeckListPageRoute />} />
                  <Route path="/study/:deckId" element={<StudyPageRoute />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
            </div>
            <Footer />
          </div>
        </Router>
      </LanguageProvider>
  )
}

export default App
