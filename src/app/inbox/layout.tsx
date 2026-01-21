import { Box, Button, Heading, HStack } from "@chakra-ui/react"
import NextLink from "next/link"
import { redirect } from "next/navigation"
import { getSessionMagicWords } from "../../state/mutations"
import { RefreshButton } from "./refresh-button"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const magicWords = await getSessionMagicWords()

  if (!magicWords) redirect("/")

  return (
    <Box>
      <Heading as="h1" size="2xl" mb="4">
        Message Inbox
      </Heading>
      <HStack gap="4" mb="4">
        <RefreshButton />
        <Button asChild colorPalette="red">
          <NextLink href="/destroy">Destroy Magic Words</NextLink>
        </Button>
      </HStack>
      {children}
    </Box>
  )
}
