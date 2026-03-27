import { useEffect, useState } from 'react'

const defaultMatches = false

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(defaultMatches)

  useEffect(() => {
    // jsdom/tests may not provide matchMedia
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      setMatches(false)
      return
    }

    const mql = window.matchMedia(query)
    const update = () => setMatches(mql.matches)

    update()

    // Safari fallback
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', update)
      return () => mql.removeEventListener('change', update)
    }

    mql.addListener(update)
    return () => mql.removeListener(update)
  }, [query])

  return matches
}

