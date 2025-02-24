"use client"

import { getPrivateKeyLocalStorage, stringifyKey } from "@/state/client-keys"
import { MagicMessageEncoded, MagicWords } from "@/state/domain"
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

    // TODO: move this decryption demo out
    const privateKey = await getPrivateKeyLocalStorage()
    if (!privateKey) throw new Error("No Private key found")
    const decryptedMessage = await decryptMagicMessage({
      encryptedKey,
      encryptedMessage,
      privateKey,
      iv,
    })
    console.log({ decryptedMessage })

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

const decryptMagicMessage = async ({
  encryptedMessage,
  encryptedKey,
  privateKey,
  iv,
}: MagicMessageEncoded & { privateKey: CryptoKey }): Promise<string> => {
  // unpack the secondary key
  const decryptedSecondaryKey = await window.crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    privateKey,
    Buffer.from(encryptedKey, "base64"),
  )
  const unencodedSecondaryKey = new TextDecoder().decode(decryptedSecondaryKey)
  const secondaryKey = await window.crypto.subtle.importKey(
    "jwk",
    JSON.parse(unencodedSecondaryKey),
    {
      name: "AES-GCM",
    },
    false,
    ["decrypt"],
  )

  // unpack the iv
  const decodedIv = Buffer.from(iv, "base64")

  // unpack the message
  const decryptedMessage = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: decodedIv },
    secondaryKey,
    Buffer.from(encryptedMessage, "base64"),
  )
  const unencodedMessage = new TextDecoder().decode(decryptedMessage)

  return unencodedMessage
}

const packageMessage = async ({
  message,
  publicKey,
}: {
  message: string
  publicKey: JsonWebKey
}): Promise<MagicMessageEncoded> => {
  // import the public key
  // TODO: do this earlier in the flow - user’s shouldn't type in their message and then this to fail
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

  // generate the secondary key
  const secondaryKey = await window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"],
  )
  const stringSecondaryKey = await stringifyKey(secondaryKey)
  const encodedSecondaryKey = new TextEncoder().encode(stringSecondaryKey)

  // encrypt the secondary key with the public key
  const encryptedSecondaryKey = await window.crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    importedPublicKey,
    encodedSecondaryKey,
  )

  // generate random data (Initialization Vector) as part of encrypting with the secondary key
  // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt#aes-gcm_2
  const iv = window.crypto.getRandomValues(new Uint8Array(12))

  // encrypt the message with the secondary key
  const encodedMessage = new TextEncoder().encode(message)
  const encryptedMessage = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    secondaryKey,
    encodedMessage,
  )

  // convert all the buffers to strings for transit and storage
  return {
    encryptedKey: Buffer.from(encryptedSecondaryKey).toString("base64"),
    encryptedMessage: Buffer.from(encryptedMessage).toString("base64"),
    iv: Buffer.from(iv).toString("base64"),
  }
}
