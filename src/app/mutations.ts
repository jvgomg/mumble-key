"use server"

import { getMagicWords, MagicWords } from "@/state/magic-words"
import { sessionGet, sessionStart } from "@/state/session"
import { Redis } from "@upstash/redis"
import assert from "assert"

const redis = Redis.fromEnv()

export const exchangePublicKeyForMagicWords = async (publicKey: string) => {
  const sessionId = await sessionStart()

  const seed = await redis.incr("mumble:last_seed")
  const magicWords = await getMagicWords(seed)

  const pipeline = redis.pipeline()

  // create link between session and magic words
  pipeline.set(`mumble:session:${sessionId}:words`, magicWords.join("_"))

  // create magic words with link to public key
  console.log({ magicWords })
  pipeline.set(`mumble:words:${magicWords.join("_")}:key`, publicKey)

  await pipeline.exec()

  return magicWords
}

export const exchangeMagicWordsForPublicKey = async (
  magicWords: MagicWords,
): Promise<JsonWebKey> => {
  console.log({ magicWords })
  const publicKey = await redis.get(`mumble:words:${magicWords.join("_")}:key`)
  console.log({ publicKey })
  assert(typeof publicKey === "object" && publicKey !== null)
  return publicKey
}

export const sendMessageToMagicWords = async (
  magicWords: MagicWords,
  key: string,
  data: string,
) => {
  await redis.lpush(`mumble:words:${magicWords.join("_")}:messages`, {
    key,
    data,
  })
}

export const getSessionMagicWords = async (): Promise<
  MagicWords | undefined
> => {
  const sessionId = await sessionGet()
  if (!sessionId) return
  const magicWordsRaw = await redis.get(`mumble:session:${sessionId}:words`)
  if (!magicWordsRaw) return
  assert(typeof magicWordsRaw === "string")
  return magicWordsRaw.split("_") as MagicWords
}

export const getSessionMessages = async (): Promise<
  { key: string; data: string }[]
> => {
  const sessionId = await sessionGet()
  if (!sessionId) throw new Error("No session")
  const magicWordsRaw = await redis.get(`mumble:session:${sessionId}:words`)
  console.log({ magicWordsRaw })
  assert(typeof magicWordsRaw === "string")
  const magicWords = magicWordsRaw.split("_") as MagicWords
  console.log({ magicWords })
  const messagesRaw = await redis.lrange(
    `mumble:words:${magicWords.join("_")}:messages`,
    0,
    -1,
  )
  console.log({ messagesRaw })
  return messagesRaw.map((m) => JSON.parse(m))
}
