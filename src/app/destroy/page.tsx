import { sessionGet } from "@/state/session"
import { Box, Heading, Text } from "@chakra-ui/react"
import { redirect } from "next/navigation"
import { getSessionMagicWords, getSessionMessages } from "../../state/mutations"
import { DestroyConfirmation } from "./destory-confirmation"

export default async function Page() {
  const thingsToDestroy = await getThingsToDestroy()

  return (
    <Box>
      <Heading as="h1" size="2xl" mb="4">
        Start again
      </Heading>
      <Text mb="4">Are you sure you want destroy your session?</Text>
      <DestroyConfirmation serverThings={thingsToDestroy} />
    </Box>
  )
}

const getThingsToDestroy = async (): Promise<string[]> => {
  const things: string[] = []

  const session = await sessionGet()
  if (!session) redirect("/")
  things.push("Your session with the server")

  const magicWords = await getSessionMagicWords()
  const messages = await getSessionMessages()

  if (magicWords) {
    things.push("Your Magic Words and Public Key stored on the server")
  }

  if (messages.length) {
    things.push(`${messages.length} message${messages.length === 1 ? "" : "s"}`)
  }

  return things
}
