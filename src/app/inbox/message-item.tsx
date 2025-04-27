"use client"

import { getPrivateKeyLocalStorage } from "@/state/client-keys"
import { decryptMagicMessage } from "@/state/client-message"
import { MagicMessage } from "@/state/domain"
import { useState } from "react"

export const MessageItem = ({ message }: { message: MagicMessage }) => {
  const [decrypted, setDecrypted] = useState<
    undefined | { message: string } | { error: string }
  >()

  const handle = async () => {
    const privateKey = await getPrivateKeyLocalStorage()

    if (!privateKey) throw new Error("Private Key could not be retrieved")

    try {
      const response = await decryptMagicMessage({ message, privateKey })

      setDecrypted({ message: response })
    } catch (error) {
      setDecrypted({
        error: error instanceof Error ? error.message : "Something went wrong",
      })
    }
  }

  return (
    <div>
      <pre>{message.encryptedMessage}</pre>

      {decrypted && "message" in decrypted && (
        <blockquote>{decrypted.message}</blockquote>
      )}

      {decrypted && "error" in decrypted && <p>{decrypted.error}</p>}

      <button onClick={handle} disabled={decrypted && "message" in decrypted}>
        Decrypt message
      </button>
    </div>
  )
}
