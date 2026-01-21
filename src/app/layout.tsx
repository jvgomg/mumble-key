import MagicWordsDisplay from "@/components/magic-words-display"
import { Provider } from "@/components/ui/provider"
import type { Metadata } from "next"
import Link from "next/link"
import { getSessionMagicWords } from "../state/mutations"
import { Box, Container, Separator, Text } from "@chakra-ui/react"

export const metadata: Metadata = {
  title: "Mumble Key",
  // description: "",
}

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const magicWords = await getSessionMagicWords()

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Provider>
          <Container maxW="container.md" px="4" display="flex" flexDirection="column" minH="100vh">
            <Box as="header" py="4">
              <Box as="nav" mb="2">
                <Link href="/">Mumble Key</Link>
              </Box>

              {magicWords && (
                <Box mb="2">
                  <MagicWordsDisplay magicWords={magicWords} />
                  <Box mt="2">
                    <Link href="/inbox">Message Inbox</Link>
                  </Box>
                </Box>
              )}

              <Separator />
            </Box>

            <Box as="main" flex="1">
              {children}
            </Box>

            <Box as="footer" py="4">
              <Separator mb="4" />
              <Text fontSize="sm" color="text.secondary">
                This application is under active development. It should not be
                used to send sensitive information.
              </Text>
              <Text fontSize="sm" color="text.secondary">
                Use at your own risk!
              </Text>
            </Box>
          </Container>
        </Provider>
      </body>
    </html>
  )
}
