import { MagicWords } from "./domain"

export const makeSeedCountKey = () => `mumble:last_seed`

export const makeSessionToMagicWordsKey = (sessionId: string) =>
  `mumble:session:${sessionId}:words`

export const makeMagicWordsToKeyKey = (magicWords: MagicWords) =>
  `mumble:words:${magicWords.join("_")}:key`

export const makeMagicWordsToMessageKey = (magicWords: MagicWords) =>
  `mumble:words:${magicWords.join("_")}:messages`
