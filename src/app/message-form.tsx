"use client"
import { stringifyKey } from "@/state/client-keys"
import { MagicWords } from "@/state/magic-words"
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

    const { encryptedKey, encryptedMessage } = await packageMessage({
      message: formData.get("message")?.toString() || "",
      publicKey: receiverPublicKey,
    })

    formData.delete("message")
    formData.set("encryptedMessage", encryptedMessage)
    formData.set("encryptedKey", encryptedKey)

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
            value={magicWords?.join(" ")}
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

const packageMessage = async ({
  message,
  publicKey,
}: {
  message: string
  publicKey: JsonWebKey
}): Promise<{ encryptedMessage: string; encryptedKey: string }> => {
  const importedPublicKey = await window.crypto.subtle.importKey(
    "jwk",
    publicKey,
    {
      name: "RSA-OAEP",
      hash: { name: "SHA-256" },
    },
    false,
    ["encrypt"],
  )

  const secondaryKey = await window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"],
  )

  const encodedSecondaryKey = new TextEncoder().encode(
    await stringifyKey(secondaryKey),
  )

  const encryptedSecondaryKey = await window.crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    importedPublicKey,
    encodedSecondaryKey,
  )

  const encodedMessage = new TextEncoder().encode(message)

  const encryptedMessage = await window.crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    importedPublicKey,
    encodedMessage,
  )

  return {
    encryptedKey: Buffer.from(encryptedSecondaryKey).toString("base64"),
    encryptedMessage: Buffer.from(encryptedMessage).toString("base64"),
  }
}
