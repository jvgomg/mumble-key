"use server"

import { sendMessageToMagicWords } from "@/app/mutations"
import { MagicWords } from "@/state/domain"
import assert from "assert"

export const createMessage = async (
  prevState: {
    message: string
  },
  formData: FormData,
) => {
  const encryptedKey = formData.get("encryptedKey")
  const encryptedMessage = formData.get("encryptedMessage")
  const iv = formData.get("iv")
  const magicWordsData = formData.get("magicWords")

  assert(typeof encryptedKey === "string", "key is not a string")
  assert(typeof encryptedMessage === "string", "data is not a string")
  assert(typeof iv === "string", "iv is not a string")
  assert(typeof magicWordsData === "string", "magicWords is not a string")

  const magicWords = magicWordsData.split(" ") as MagicWords

  await sendMessageToMagicWords({
    magicWords,
    message: { encryptedKey, encryptedMessage, iv },
  })

  return { message: "Message sent!" }
}
