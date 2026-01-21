import { Box, Button, Heading, HStack, Link, Text } from "@chakra-ui/react"
import NextLink from "next/link"

export default function Page() {
  return (
    <Box>
      <Heading as="h1" size="2xl" mb="4">
        MumbleKey
      </Heading>
      <Text fontStyle="italic" mb="4">
        Send messages securely, anonymously and asynchronously.
      </Text>
      <Text mb="4">
        This application is a Next.js reimplementation of{" "}
        <Link href="https://github.com/pixielabs/whisper-key" target="_blank">
          WhisperKey
        </Link>
        . Learn about this project and read the source code on{" "}
        <Link href="https://github.com/jvgomg/mumble-key" target="_blank">
          GitHub
        </Link>
        .
      </Text>

      <Box as="section" mt="6">
        <Heading as="h2" size="xl" mb="4">
          I want to…
        </Heading>

        <HStack gap="4">
          <Button asChild>
            <NextLink href="/send">Send a message</NextLink>
          </Button>
          <Button asChild>
            <NextLink href="/receive">Receive messages</NextLink>
          </Button>
        </HStack>
      </Box>
    </Box>
  )
}
