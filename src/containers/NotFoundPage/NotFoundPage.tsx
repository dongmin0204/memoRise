import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="min-h-96 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-600 mb-6">페이지를 찾을 수 없어요</h2>
        <p className="text-gray-500 mb-8">존재하지 않는 주소이거나 이동되었을 수 있습니다.</p>
        <Link 
          to="/decks" 
          className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          단어장으로
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
