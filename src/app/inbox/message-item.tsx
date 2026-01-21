"use client"

import { Blockquote } from "@/components/ui/blockquote"
import { getPrivateKeyLocalStorage } from "@/state/client-keys"
import { decryptMagicMessage } from "@/state/client-message"
import { MagicMessage } from "@/state/domain"
import { Box, Button, Code, Text } from "@chakra-ui/react"
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
    <Box mb="4">
      <Code display="block" whiteSpace="pre-wrap" wordBreak="break-all" mb="2">
        {message.encryptedMessage}
      </Code>

      {decrypted && "message" in decrypted && (
        <Blockquote my="2">{decrypted.message}</Blockquote>
      )}

      {decrypted && "error" in decrypted && (
        <Text color="red.500">{decrypted.error}</Text>
      )}

      <Button onClick={handle} disabled={decrypted && "message" in decrypted}>
        Decrypt message
      </Button>
    </Box>
  )
}
