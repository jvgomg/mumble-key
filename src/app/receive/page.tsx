import { Alert } from "@/components/ui/alert"
import { Box, Heading, Text } from "@chakra-ui/react"
import { LuShieldCheck } from "react-icons/lu"
import { getSessionMagicWords } from "../../state/mutations"
import { GenerateMagicWordsFlow } from "./generate-flow"

export default async function Page() {
  const existingMagicWords = await getSessionMagicWords()

  return (
    <Box>
      <Heading as="h1" size="2xl" mb="4">
        Receive Messages
      </Heading>
      <Text mb="4">
        To receive encrypted messages, you&apos;ll need to generate a set of
        Magic Words. These three special words act as your unique receiving
        address — share them with anyone who wants to send you a private
        message.
      </Text>
      <Text mb="6">
        The process creates a cryptographic key pair on your device. Messages
        sent to your Magic Words can only be decrypted by you.
      </Text>

      <GenerateMagicWordsFlow existingMagicWords={existingMagicWords} />
    </Box>
  )
}
