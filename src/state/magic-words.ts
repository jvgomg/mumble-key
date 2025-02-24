"use server"

import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { cache } from "react"
import { MAGIC_WORDS_PHRASE_LENGTH, MagicWords } from "./domain"

/**
 * magic words public methods
 */

export const getMagicWords = async (seed: number): Promise<MagicWords> => {
  const phaseLength = MAGIC_WORDS_PHRASE_LENGTH
  const words = await getWordList()

  // LCG parameters (using common values)
  const m = words.length // modulus (using word list length)
  const a = 1597 // multiplier
  const c = 51749 // increment

  // Generate sequence of indices using LCG
  const indices = Array.from({ length: phaseLength }, (_, i) => {
    // X_(n+1) = (a * X_n + c) mod m
    const index = Math.abs((a * (seed + i) + c) % m)
    return index
  })

  const magicWords = indices.map((index) => words[index])
  return magicWords as MagicWords
}

/**
 * private
 */

const getWordList = cache(async (): Promise<string[]> => {
  const lines = await readFile(
    join(process.cwd(), "src/magic-words.txt"),
    "utf-8",
  )
  const words = lines.split("\n").filter(Boolean)
  return words
})
