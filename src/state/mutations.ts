"use server"

import { MagicMessage, MagicWords, TTL } from "@/state/domain"
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

  const p = redis.pipeline()

  // create link between session and magic words
  p.set(makeSessionToMagicWordsKey(sessionId), magicWords.join("_"))
  p.expire(makeSessionToMagicWordsKey(sessionId), TTL)

  // create magic words with link to public key
  p.set(makeMagicWordsToKeyKey(magicWords), publicKey)
  p.expire(makeMagicWordsToKeyKey(magicWords), TTL)

  await p.exec()

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
  message: MagicMessage
}) => {
  const p = redis.pipeline()
  p.lpush(makeMagicWordsToMessageKey(magicWords), message)
  p.expire(makeMagicWordsToMessageKey(magicWords), TTL)
  await p.exec()
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

export const getSessionMessages = async (): Promise<MagicMessage[]> => {
  const sessionId = await sessionGet()
  if (!sessionId) throw new Error("No session")

  const magicWordsRaw = await redis.get<string>(
    makeSessionToMagicWordsKey(sessionId),
  )
  if (!magicWordsRaw) throw new Error("No magic words found")

  const magicWords = magicWordsRaw.split("_") as MagicWords
  const messagesRaw = await redis.lrange<MagicMessage>(
    makeMagicWordsToMessageKey(magicWords),
    0,
    -1,
  )
  return messagesRaw
}

export const destroySession = async (): Promise<void> => {
  const sessionId = await sessionGet()
  if (!sessionId) throw new Error("No session found")

  const magicWords = await getSessionMagicWords()

  if (magicWords) {
    const p = redis.pipeline()

    // delete link between session and magic words
    p.del(makeSessionToMagicWordsKey(sessionId))

    // delete link between magic words and key
    p.del(makeMagicWordsToKeyKey(magicWords))

    // delete all the messages
    p.del(makeMagicWordsToMessageKey(magicWords))

    await p.exec()
  }

  // delete session cookie
  await sessionClear()
}
