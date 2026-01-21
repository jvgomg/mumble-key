import MagicWordsDisplay from "@/components/magic-words-display"
import { Box, Heading, Link, Separator, Text } from "@chakra-ui/react"
import NextLink from "next/link"
import { getSessionMagicWords } from "../../state/mutations"
import { GenerateMagicWordsFlow } from "./generate-flow"

export default async function Page() {
  const magicWords = await getSessionMagicWords()

  // TODO: check validity of local storage state (is the private key still there?)

  return (
    <Box>
      <Heading as="h1" size="2xl" mb="4">
        Receive messages
      </Heading>
      <Text mb="4">
        Generate some Magic Words and then give them to the person who wants to
        send you a message.
      </Text>

      <GenerateMagicWordsFlow />

      <Separator my="6" />
      <Heading as="h2" size="xl" mb="4">
        Magic Words
      </Heading>

      {magicWords ? (
        <>
          <MagicWordsDisplay magicWords={magicWords} />
          <Text my="4">
            Mumble these Magic Words to the person who wants to send you a
            message.
          </Text>
          <Link asChild>
            <NextLink href="/inbox">Go to Message Inbox</NextLink>
          </Link>
        </>
      ) : (
        <Text>Complete the steps above to summon your Magic Words</Text>
      )}
    </Box>
  )
}
