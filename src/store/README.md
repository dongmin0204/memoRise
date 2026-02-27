# Zustand Store 가이드

이 프로젝트는 **Zustand**를 사용하여 상태 관리를 구현합니다. Zustand는 경량이면서도 강력한 상태 관리 라이브러리로, Redux보다 간단한 API를 제공합니다.

## 📁 Store 구조

```
src/store/
├── index.ts              # Store 내보내기
├── useAppStore.ts        # 앱 전체 상태 (repos 로딩 등)
├── useHomeStore.ts       # 홈페이지 상태
├── useLanguageStore.ts   # 언어 설정 (persist 적용)
└── tests/                # Store 테스트 파일들
    ├── store.test.ts     # Store 설정 테스트
    └── appStore.test.ts  # AppStore 테스트
```

## 🔧 Store 설정

### **useAppStore (비동기 포함)**
```typescript
import { create } from 'zustand'

export const useAppStore = create<AppStore>((set) => ({
  loading: false,
  error: false,
  loadRepos: async (username: string) => {
    set({ loading: true, error: false })
    try {
      const repos = await request(`/users/${username}/repos`)
      set({ loading: false, userData: { repositories: repos } })
    } catch (error) {
      set({ loading: false, error: (error as Error).message })
    }
  },
}))
```

### **useLanguageStore (persist)**
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      locale: 'en',
      changeLocale: (locale) => set({ locale }),
    }),
    { name: 'language-storage', partialize: (state) => ({ locale: state.locale }) }
  )
)
```

## 🎯 사용 방법

### **컴포넌트에서 사용**

```typescript
import { useHomeStore } from '../store'

function HomePage() {
  const { username, changeUsername } = useHomeStore()
  
  return (
    <input 
      value={username}
      onChange={(e) => changeUsername(e.target.value)}
    />
  )
}
```

### **선택적 구독 (성능 최적화)**
```typescript
// locale만 구독 - 다른 상태 변경 시 리렌더 안 함
const locale = useLanguageStore((state) => state.locale)
```

## 📚 추가 리소스

- [Zustand 공식 문서](https://zustand.docs.pmnd.rs/)
- [Zustand GitHub](https://github.com/pmndrs/zustand)
