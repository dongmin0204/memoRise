// GitHub Repository 타입
export interface Repository {
  id: number
  name: string
  description: string | null
  stargazers_count: number
  forks_count: number
  html_url: string
  language: string | null
  updated_at: string
}

// Redux Store 상태 타입들
export interface AppState {
  loading: boolean
  error: string | false
  currentUser: string | false
  userData: {
    repositories: Repository[] | false
  }
}

export interface HomeState {
  username: string
}

export interface LanguageState {
  locale: 'en' | 'de' | 'ko'
}

// Legacy type - kept for compatibility (Zustand uses separate stores)
export interface RootState {
  app: AppState
  home: HomeState
  language: LanguageState
}

// 번역 메시지 타입
export interface TranslationMessages {
  [key: string]: string
}

// 언어 설정 타입
export interface AppLocale {
  code: 'en' | 'de' | 'ko'
  name: string
  messages: TranslationMessages
}

// API 응답 타입
export interface ApiResponse<T> {
  data: T
  status: number
  message?: string
}

// ─── memoRise 핵심 타입 ─────────────────────────────────

export interface Card {
  id: string
  front: string
  back: string
  tags: string[]
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

export interface Deck {
  id: string
  name: string
  description: string
  cards: Card[]
  createdAt: string
  updatedAt: string
}

export type SwipeDirection = 'left' | 'right'

export type StudyResult = 'unknown' | 'memorized'

export interface StudyRecord {
  cardId: string
  result: StudyResult
  timestamp: string
}

export interface StudySession {
  deckId: string
  currentIndex: number
  totalCards: number
  records: StudyRecord[]
  isFlipped: boolean
  isComplete: boolean
}
