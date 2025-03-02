"use server"

import { MagicMessageEncoded, MagicWords } from "@/state/domain"
import { getMagicWords } from "@/state/magic-words"
import {
  makeMagicWordsToKeyKey,
  makeMagicWordsToMessageKey,
  makeSeedCountKey,
  makeSessionToMagicWordsKey,
} from "@/state/redis-keys"
import { sessionClear, sessionGet, sessionStart } from "@/state/session"
import { Redis } from "@upstash/redis"
import assert from "assert"

const redis = Redis.fromEnv()

export const exchangePublicKeyForMagicWords = async (publicKey: string) => {
  const sessionId = await sessionStart()

  const seed = await redis.incr(makeSeedCountKey())
  const magicWords = await getMagicWords(seed)

  const pipeline = redis.pipeline()

  // create link between session and magic words
  pipeline.set(makeSessionToMagicWordsKey(sessionId), magicWords.join("_"))

  // create magic words with link to public key
  console.log({ magicWords })
  pipeline.set(makeMagicWordsToKeyKey(magicWords), publicKey)

  await pipeline.exec()

  return magicWords
}

export const exchangeMagicWordsForPublicKey = async (
  magicWords: MagicWords,
): Promise<JsonWebKey> => {
  console.log({ magicWords })
  const publicKey = await redis.get(makeMagicWordsToKeyKey(magicWords))
  console.log({ publicKey })
  assert(typeof publicKey === "object" && publicKey !== null)
  return publicKey
}

export const sendMessageToMagicWords = async ({
  magicWords,
  message,
}: {
  magicWords: MagicWords
  message: MagicMessageEncoded
}) => {
  await redis.lpush(makeMagicWordsToMessageKey(magicWords), message)
}

export const getSessionMagicWords = async (): Promise<
  MagicWords | undefined
> => {
  const sessionId = await sessionGet()
  if (!sessionId) return
  const magicWordsRaw = await redis.get(makeSessionToMagicWordsKey(sessionId))
  if (!magicWordsRaw) return
  assert(typeof magicWordsRaw === "string")
  return magicWordsRaw.split("_") as MagicWords
}

export const getSessionMessages = async (): Promise<MagicMessageEncoded[]> => {
  const sessionId = await sessionGet()
  if (!sessionId) throw new Error("No session")
  const magicWordsRaw = await redis.get(makeSessionToMagicWordsKey(sessionId))
  console.log({ magicWordsRaw })
  assert(typeof magicWordsRaw === "string")
  const magicWords = magicWordsRaw.split("_") as MagicWords
  console.log({ magicWords })
  const messagesRaw = await redis.lrange<MagicMessageEncoded>(
    makeMagicWordsToMessageKey(magicWords),
    0,
    -1,
  )
  console.log({ messagesRaw })
  return messagesRaw
}

export const destroySession = async (): Promise<void> => {
  const actions: Promise<unknown>[] = []

  const sessionId = await sessionGet()

  if (!sessionId) throw new Error("No session found")

  // delete session cookie
  actions.push(sessionClear())

  const magicWords = await getSessionMagicWords()
  if (magicWords) {
    // delete link between session and magic words
    actions.push(redis.del(makeSessionToMagicWordsKey(sessionId)))

    // delete link between magic words and key
    actions.push(redis.del(makeMagicWordsToKeyKey(magicWords)))

    // delete all the messages
    actions.push(redis.del(makeMagicWordsToMessageKey(magicWords)))
  }

  await Promise.all(actions)
}
