"use server"

import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { cache } from "react"
import { MAGIC_WORDS_PHRASE_LENGTH, MagicWords } from "./domain"

/**
 * magic words public methods
 */

export const getMagicWords = async (seed: number): Promise<MagicWords> => {
  const words = await getWordList()

  const magicWords = selectWords({
    words,
    seed,
    count: MAGIC_WORDS_PHRASE_LENGTH,
  })

  return magicWords as MagicWords
}

/**
 * private
 */

const getWordList = cache(async (): Promise<string[]> => {
  const lines = await readFile(
    join(process.cwd(), "src/magic_words.txt"),
    "utf-8",
  )
  const words = lines.split("\n").filter(Boolean)
  return words
})

// Configurable LCG function
function lcg(
  seed: number,
  multiplier: number,
  increment: number,
  modulus: number,
) {
  return () => {
    seed = (multiplier * seed + increment) % modulus
    return seed / modulus // Normalize to [0,1)
  }
}

function selectWords({
  words,
  seed,
  count,
  multiplier = Number(process.env.LCG_MULTIPLIER) || 1103515245,
  increment = Number(process.env.LCG_INCREMENT) || 12345,
  modulus = Number(process.env.LCG_MODULUS) || 2 ** 31,
}: {
  words: string[]
  seed: number
  count: number
  multiplier?: number
  increment?: number
  modulus?: number
}): string[] {
  if (words.length === 0 || count <= 0) {
    return []
  }

  if (count > words.length) {
    throw new Error(
      "Count cannot be greater than the number of available words.",
    )
  }

  const random = lcg(seed, multiplier, increment, modulus)
  const availableWords = [...words]
  const selectedWords: string[] = []

  for (let i = 0; i < count; i++) {
    const index = Math.floor(random() * availableWords.length)
    selectedWords.push(availableWords.splice(index, 1)[0])
  }

  return selectedWords
}
