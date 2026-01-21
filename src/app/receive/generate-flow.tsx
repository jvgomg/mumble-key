"use client"

import {
  generateClientKeyPair,
  setPrivateKeyLocalStorage,
  stringifyKey,
} from "@/state/client-keys"
import { MagicWords } from "@/state/domain"
import { exchangePublicKeyForMagicWords } from "@/state/mutations"
import { Box, Button, Code, Heading, Text } from "@chakra-ui/react"
import { useState } from "react"

export const GenerateMagicWordsFlow = () => {
  const [working, setWorking] = useState(false)

  const [step1, setStep1] = useState<
    undefined | { time?: number; keyPair: CryptoKeyPair }
  >()

  const [step2, setStep2] = useState<undefined | { complete: true }>()

  const [step3, setStep3] = useState<undefined | { magicWords: MagicWords }>()

  const generate = async () => {
    setWorking(true)
    const { time, keyPair } = await generateClientKeyPair()
    setStep1({ time, keyPair })
    setWorking(false)
  }

  const savePrivateKey = async () => {
    if (!step1?.keyPair) throw new Error("No keypair in state")
    setWorking(true)
    await setPrivateKeyLocalStorage(step1.keyPair)
    setStep2({ complete: true })
    setWorking(false)
  }

  const exchangePublicKey = async () => {
    if (!step1?.keyPair) throw new Error("No keypair in state")
    setWorking(true)
    const magicWords = await exchangePublicKeyForMagicWords(
      await stringifyKey(step1.keyPair.publicKey),
    )
    setStep3({ magicWords })
    setWorking(false)
  }

  return (
    <Box>
      <Heading as="h2" size="xl" mb="4">
        Generate Magic Words
      </Heading>
      <Text mb="4">
        Summoning Magic Words in a secure way requires an enchantment involving
        a few steps.
      </Text>

      <Box as="section" mb="4" data-complete={!!step1}>
        <Heading as="h3" size="lg" mb="2">
          Step 1
        </Heading>
        <Text mb="2">
          Generate 2 cryptographic keys locally, within your device&apos;s web
          browser
        </Text>
        <Button onClick={generate} disabled={working || !!step1}>
          Generate Keys
        </Button>
        {step1?.time && (
          <Code display="block" mt="2">
            Time taken: {step1.time / 1000} seconds
          </Code>
        )}
      </Box>

      <Box as="section" mb="4" data-complete={!!step1}>
        <Heading as="h3" size="lg" mb="2">
          Step 2
        </Heading>
        <Text mb="2">
          Save the <Text as="em" fontStyle="italic">private</Text> key into your web browser&apos;s storage
        </Text>
        <Button
          disabled={!step1 || !!step2 || working}
          onClick={savePrivateKey}
        >
          Save private key locally
        </Button>
      </Box>

      <Box as="section" mb="4" data-complete={!!step1 || !!step2}>
        <Heading as="h3" size="lg" mb="2">
          Step 3
        </Heading>
        <Text mb="2">
          Send the <Text as="em" fontStyle="italic">public</Text> key to the server and exchange for some Magic
          Words
        </Text>
        <Button
          disabled={!step1 || !step2 || !!step3 || working}
          onClick={exchangePublicKey}
        >
          Send public key
        </Button>
      </Box>
    </Box>
  )
}
