"use server"

import { readFile } from "node:fs/promises"

/**
 * magic words types
 */

export type MagicWords = [string, string]

/**
 * magic words public methods
 */

export const getMagicWords = async (seed: number): Promise<MagicWords> => {
  const words = await getWordList()

  // TODO: implement Linear Congruential Generator magic
  // https://gist.github.com/developersharif/948694db21e1685365152d5c9d8ae53b

  return [words[seed], words[seed + 1]]
}

/**
 * private
 */

const getWordList = async (): Promise<string[]> => {
  const lines = await readFile("src/magic-words.txt", "utf-8")
  const words = lines.split("\n").filter(Boolean)
  return words
}
