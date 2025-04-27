"use client"

import MagicWordsDisplay from "@/components/magic-words-display"
import { packageMessage } from "@/state/client-message"
import { MagicWords } from "@/state/domain"
import { useActionState } from "react"
import { createMessage } from "./actions"
import { useFormStatus } from "react-dom"

const initialState = {
  message: "",
}

export const MessageForm = ({
  magicWords,
  receiverPublicKey,
}: {
  magicWords: MagicWords
  receiverPublicKey: JsonWebKey
}) => {
  const handleSubmit: typeof createMessage = async (
    prevState,
    localFormData,
  ) => {
    const { encryptedKey, encryptedMessage, iv } = await packageMessage({
      message: localFormData.get("message")?.toString() || "",
      publicKey: receiverPublicKey,
    })

    // send message to the server
    const formData = new FormData()
    formData.set("encryptedMessage", encryptedMessage)
    formData.set("encryptedKey", encryptedKey)
    formData.set("iv", iv)
    formData.set("magicWords", magicWords.join(" "))
    return createMessage(prevState, formData)
  }

  const [state, formAction] = useActionState(handleSubmit, initialState)

  return (
    <>
      <form action={formAction}>
        <div>
          <label>Magic Words</label>
          <MagicWordsDisplay magicWords={magicWords} showCopyButton={false} />
        </div>
        <div>
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" />
        </div>
        <SubmitButton />
        <p aria-live="polite" className="sr-only" role="status">
          <strong>{state?.message}</strong>
        </p>
      </form>
    </>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button type="submit" aria-disabled={pending}>
      Send message
    </button>
  )
}
