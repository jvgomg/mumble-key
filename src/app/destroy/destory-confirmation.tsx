"use client"

import {
  getPrivateKeyLocalStorage,
  removePrivateKeyLocalStorage,
} from "@/state/client-keys"
import { Box, Button, HStack, List, Text } from "@chakra-ui/react"
import NextLink from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { destroySession } from "../../state/mutations"

export const DestroyConfirmation = ({
  serverThings,
}: {
  serverThings: string[]
}) => {
  const router = useRouter()

  const [privateKeyPresent, setPrivateKeyPresent] = useState<
    undefined | boolean
  >(undefined)

  const loaded = privateKeyPresent !== undefined

  const thingsToDestroy: string[] = [...serverThings]

  if (privateKeyPresent) {
    thingsToDestroy.push("The Private Key stored in your browser")
  }

  useEffect(() => {
    const checkPrivateKey = async () => {
      const privateKey = await getPrivateKeyLocalStorage()
      setPrivateKeyPresent(!!privateKey)
    }
    checkPrivateKey()
  }, [])

  const [working, setWorking] = useState(false)

  const confirmed = async () => {
    setWorking(true)
    removePrivateKeyLocalStorage()
    await destroySession()
    router.replace("/")
  }

  if (!loaded) {
    return (
      <Box>
        <Text fontStyle="italic">Checking things…</Text>
      </Box>
    )
  }

  return (
    <Box>
      <Text mb="2">The following things will be destroyed:</Text>
      <List.Root as="ul" mb="4">
        {thingsToDestroy.map((thing) => (
          <List.Item key={thing}>{thing}</List.Item>
        ))}
      </List.Root>

      <HStack gap="2">
        <Button asChild>
          <NextLink href="/">Cancel</NextLink>
        </Button>

        <Button
          onClick={confirmed}
          disabled={working}
          loading={working}
          colorPalette="red"
        >
          Destroy session
        </Button>
      </HStack>
    </Box>
  )
}
