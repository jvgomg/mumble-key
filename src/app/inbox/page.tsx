import { Box, List, Text } from "@chakra-ui/react"
import { getSessionMessages } from "../../state/mutations"
import { MessageItem } from "./message-item"

export default async function Page() {
  const messages = await getSessionMessages()

  if (!messages.length) {
    return (
      <Box>
        <Text>You have no messages</Text>
      </Box>
    )
  }

  return (
    <Box>
      <List.Root as="ol" gap="4">
        {messages.map((message, i) => (
          <List.Item key={message.encryptedMessage?.slice(0, 4) || i}>
            <MessageItem message={message} />
          </List.Item>
        ))}
      </List.Root>
    </Box>
  )
}
