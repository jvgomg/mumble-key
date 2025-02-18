"use server"

import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies"
import { cookies } from "next/headers"

/**
 * session public methods
 */

export const sessionStart = async () => {
  const cookieStore = await cookies()

  // TODO: maybe I should sign and verify session tokens
  const sessionId = crypto.randomUUID()

  cookieStore.set("session", sessionId, getSessionCookieOptions())
}

export const sessionExtend = async () => {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("session")?.value
  if (!sessionId) return
  cookieStore.set("session", sessionId, getSessionCookieOptions())
}

export const sessionClear = async () => {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}

/**
 * private
 */

const getSessionExpires = (): Date => {
  // expire in 1 day
  const expires = new Date()
  expires.setDate(expires.getDate() + 1)
  return expires
}

const getSecure = (): boolean => {
  return false
  return process.env.NODE_ENV === "production"
}

const getSessionCookieOptions = (): Partial<ResponseCookie> => {
  return {
    httpOnly: true,
    expires: getSessionExpires(),
    secure: getSecure(),
  }
}
