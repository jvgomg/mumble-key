"use client"

import MagicWordsDisplay from "@/components/magic-words-display"
import { Field } from "@/components/ui/field"
import { packageMessage } from "@/state/client-message"
import { MagicWords } from "@/state/domain"
import { Box, Button, Text, Textarea } from "@chakra-ui/react"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { createMessage } from "./actions"

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
    <form action={formAction}>
      <Field label="Magic Words" mb="4">
        <MagicWordsDisplay magicWords={magicWords} showCopyButton={false} />
      </Field>
      <Field label="Message" mb="4">
        <Textarea id="message" name="message" />
      </Field>
      <SubmitButton />
      <Text as="p" aria-live="polite" srOnly role="status">
        <strong>{state?.message}</strong>
      </Text>
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" aria-disabled={pending} loading={pending}>
      Send message
    </Button>
  )
}
