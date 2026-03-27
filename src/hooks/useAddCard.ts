import { useCallback } from 'react'
import { useDeckStore } from '@/store/useDeckStore'

interface AddCardInput {
  front: string
  back: string
  tags?: string[] | string
  imageUrl?: string
}

type AddCardResult = { ok: true } | { ok: false; error: 'FRONT_REQUIRED' | 'BACK_REQUIRED' }

const normalizeTags = (tags: AddCardInput['tags']) => {
  if (!tags) return []
  if (Array.isArray(tags)) {
    return tags.map((tag) => tag.trim()).filter(Boolean)
  }
  return tags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
}

export function useAddCard(deckId: string) {
  const addCard = useDeckStore((s) => s.addCard)

  return useCallback(
    (input: AddCardInput): AddCardResult => {
      const front = input.front.trim()
      const back = input.back.trim()

      if (!front) return { ok: false, error: 'FRONT_REQUIRED' }
      if (!back) return { ok: false, error: 'BACK_REQUIRED' }

      addCard(deckId, {
        front,
        back,
        tags: normalizeTags(input.tags),
        imageUrl: input.imageUrl?.trim() || undefined,
      })

      return { ok: true }
    },
    [addCard, deckId],
  )
}

