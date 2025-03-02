"use client"

import { packageMessage } from "@/state/client-message"
import { MagicWords } from "@/state/domain"
import { startTransition } from "react"

export const MessageForm = ({
  magicWords,
  receiverPublicKey,
  action,
}: {
  magicWords: MagicWords
  receiverPublicKey: JsonWebKey
  action: (formData: FormData) => Promise<void>
}) => {
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)

    const { encryptedKey, encryptedMessage, iv } = await packageMessage({
      message: formData.get("message")?.toString() || "",
      publicKey: receiverPublicKey,
    })

    // send message to the server
    formData.delete("message")
    formData.set("encryptedMessage", encryptedMessage)
    formData.set("encryptedKey", encryptedKey)
    formData.set("iv", iv)
    startTransition(() => action(formData))
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="magic">Magic Words</label>
          <input
            id="magic"
            name="magic"
            value={magicWords.join(" ")}
            readOnly
          />
        </div>
        <div>
          <label htmlFor="message">Message</label>
          <input id="message" name="message" />
        </div>
        <button type="submit">Send message</button>
      </form>
    </>
  )
}
