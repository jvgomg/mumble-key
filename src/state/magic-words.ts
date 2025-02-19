"use server"

import { readFile } from "node:fs/promises"
import { cache } from "react"

/**
 * magic words types
 */

const MAGIC_WORDS_PHRASE_LENGTH = 3

export type MagicWords = Tuple<string, typeof MAGIC_WORDS_PHRASE_LENGTH>

type Tuple<T, N extends number> = N extends N
  ? number extends N
    ? T[]
    : _TupleOf<T, N, []>
  : never
type _TupleOf<T, N extends number, R extends unknown[]> = R["length"] extends N
  ? R
  : _TupleOf<T, N, [T, ...R]>

/**
 * magic words public methods
 */

export const getMagicWords = async (seed: number): Promise<MagicWords> => {
  const words = await getWordList()

  // LCG parameters (using common values)
  const m = words.length // modulus (using word list length)
  const a = 1597 // multiplier
  const c = 51749 // increment

  // Generate sequence of indices using LCG
  const indices = Array.from({ length: MAGIC_WORDS_PHRASE_LENGTH }, (_, i) => {
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
  const lines = await readFile("src/magic-words.txt", "utf-8")
  const words = lines.split("\n").filter(Boolean)
  return words
})
