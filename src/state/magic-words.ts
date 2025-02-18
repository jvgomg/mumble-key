"use server"

import { readFile } from "node:fs/promises"

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

  // TODO: implement some magic Linear Congruential Generator gubbins
  // https://gist.github.com/developersharif/948694db21e1685365152d5c9d8ae53b

  return new Array(MAGIC_WORDS_PHRASE_LENGTH)
    .fill(undefined)
    .map((_, i) => words[seed + i]) as MagicWords
}

/**
 * private
 */

const getWordList = async (): Promise<string[]> => {
  const lines = await readFile("src/magic-words.txt", "utf-8")
  const words = lines.split("\n").filter(Boolean)
  return words
}
