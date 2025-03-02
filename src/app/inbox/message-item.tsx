"use client"

import { getPrivateKeyLocalStorage } from "@/state/client-keys"
import { decryptMagicMessage } from "@/state/client-message"
import { MagicMessageEncoded } from "@/state/domain"
import { useState } from "react"

export const MessageItem = ({ message }: { message: MagicMessageEncoded }) => {
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
      <p>{message.encryptedMessage}</p>

      {!decrypted && <button onClick={handle}>Decrypt message</button>}

      {decrypted && "message" in decrypted && <p>{decrypted.message}</p>}
      {decrypted && "error" in decrypted && <p>{decrypted.error}</p>}
    </div>
  )
}
