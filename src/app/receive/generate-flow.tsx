"use client"

import MagicWordsDisplay from "@/components/magic-words-display"
import { Alert } from "@/components/ui/alert"
import {
  StepsCompletedContent,
  StepsItem,
  StepsList,
  StepsRoot,
} from "@/components/ui/steps"
import {
  generateClientKeyPair,
  setPrivateKeyLocalStorage,
  stringifyKey,
} from "@/state/client-keys"
import { MagicWords } from "@/state/domain"
import { exchangePublicKeyForMagicWords } from "@/state/mutations"
import {
  Box,
  Button,
  Code,
  Collapsible,
  HStack,
  IconButton,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react"
import NextLink from "next/link"
import { useCallback, useState } from "react"
import { LuChevronDown, LuChevronUp } from "react-icons/lu"

interface Props {
  existingMagicWords: MagicWords | undefined
}

type LogEntry = {
  message: string
  timestamp: Date
}

const MIN_STEP_DELAY = 800 // Minimum ms per step for reassuring pacing

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const GenerateMagicWordsFlow = ({ existingMagicWords }: Props) => {
  const [started, setStarted] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [logsExpanded, setLogsExpanded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [magicWords, setMagicWords] = useState<MagicWords | null>(
    existingMagicWords ?? null,
  )
  const [working, setWorking] = useState(false)

  const addLog = useCallback((message: string) => {
    setLogs((prev) => [...prev, { message, timestamp: new Date() }])
  }, [])

  const runSetupFlow = async () => {
    setStarted(true)
    setWorking(true)
    setError(null)
    setLogs([])
    setCurrentStep(0)

    try {
      // Step 1: Generate keys
      addLog("Generating RSA-2048 key pair...")
      const startTime = Date.now()
      const { keyPair } = await generateClientKeyPair()
      const elapsed = Date.now() - startTime
      // Ensure minimum delay for reassuring pacing
      if (elapsed < MIN_STEP_DELAY) {
        await delay(MIN_STEP_DELAY - elapsed)
      }
      addLog("Key pair generated successfully")
      setCurrentStep(1)

      // Step 2: Save private key locally
      addLog("Saving private key to browser storage...")
      const step2Start = Date.now()
      await setPrivateKeyLocalStorage(keyPair)
      const step2Elapsed = Date.now() - step2Start
      if (step2Elapsed < MIN_STEP_DELAY) {
        await delay(MIN_STEP_DELAY - step2Elapsed)
      }
      addLog("Private key saved to local storage")
      setCurrentStep(2)

      // Step 3: Exchange public key for magic words
      addLog("Sending public key to server...")
      const publicKeyString = await stringifyKey(keyPair.publicKey)
      addLog("Exchanging public key for Magic Words...")
      const words = await exchangePublicKeyForMagicWords(publicKeyString)
      addLog(`Magic Words received: ${words}`)
      setMagicWords(words)
      setCurrentStep(3)
      addLog("Setup complete!")
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred"
      setError(message)
      addLog(`Error: ${message}`)
    } finally {
      setWorking(false)
    }
  }

  const latestLog = logs.length > 0 ? logs[logs.length - 1] : null

  // If user already has magic words and hasn't started a new flow
  if (magicWords && !started) {
    return (
      <Box>
        <Box p="6" borderWidth="1px" borderRadius="lg" bg="bg.muted" mb="4">
          <Text fontWeight="medium" mb="4">
            Your Magic Words are ready:
          </Text>
          <MagicWordsDisplay magicWords={magicWords} />
          <Text mt="4" color="fg.muted" fontSize="sm">
            Share these words with anyone who wants to send you a private
            message.
          </Text>
        </Box>
        <HStack gap="4">
          <Link asChild>
            <NextLink href="/inbox">Go to Inbox</NextLink>
          </Link>
        </HStack>
      </Box>
    )
  }

  return (
    <Box>
      {/* Magic Words Reveal - animates in above steps */}
      {magicWords && (
        <Collapsible.Root open={currentStep === 3}>
          <Collapsible.Content>
            <Box p="6" borderWidth="1px" borderRadius="lg" bg="bg.muted" mb="6">
              <Text fontWeight="medium" mb="4">
                Your Magic Words are ready:
              </Text>
              <MagicWordsDisplay magicWords={magicWords} />
              <Text mt="4" color="fg.muted" fontSize="sm">
                Share these words with anyone who wants to send you a private
                message.
              </Text>
              <Box mt="4">
                <Link asChild>
                  <NextLink href="/inbox">Go to Inbox →</NextLink>
                </Link>
              </Box>
            </Box>
          </Collapsible.Content>
        </Collapsible.Root>
      )}

      {/* Error Alert */}
      {error && (
        <Alert status="error" mb="4" title="Setup failed">
          {error}
        </Alert>
      )}

      {/* Steps Progress - always visible */}
      <Box opacity={started ? 1 : 0.6} transition="opacity 0.3s">
        <StepsRoot
          step={started ? currentStep : -1}
          count={3}
          orientation="horizontal"
          size="sm"
          mb="4"
        >
          <StepsList>
            <StepsItem index={0} title="Generate" description="Create keys" />
            <StepsItem index={1} title="Store" description="Save locally" />
            <StepsItem
              index={2}
              title="Exchange"
              description="Get magic words"
            />
          </StepsList>
          <StepsCompletedContent>
            <Text color="fg.success" fontWeight="medium">
              Setup complete!
            </Text>
          </StepsCompletedContent>
        </StepsRoot>
      </Box>

      {/* Start Button - shown before flow begins */}
      {!started && (
        <Button
          size="lg"
          variant="solid"
          onClick={runSetupFlow}
          px="8"
          py="6"
          fontSize="lg"
          fontWeight="bold"
          transition="all 0.2s"
          suppressHydrationWarning
        >
          Generate Magic Words
        </Button>
      )}

      {/* Log viewer - shown after flow starts */}
      {started && latestLog && (
        <Box mt="4" p="3" borderWidth="1px" borderRadius="md" bg="bg.subtle">
          <HStack justify="space-between" align="center">
            <HStack gap="2" flex="1" minW="0">
              <Text fontSize="sm" color="fg.muted" flexShrink={0}>
                Latest:
              </Text>
              <Code fontSize="sm" truncate>
                {latestLog.message}
              </Code>
            </HStack>
            <IconButton
              aria-label={logsExpanded ? "Collapse logs" : "Expand logs"}
              variant="ghost"
              size="xs"
              onClick={() => setLogsExpanded(!logsExpanded)}
            >
              {logsExpanded ? <LuChevronUp /> : <LuChevronDown />}
            </IconButton>
          </HStack>

          {/* Expanded Logs */}
          <Collapsible.Root open={logsExpanded}>
            <Collapsible.Content>
              <VStack align="stretch" mt="3" gap="1">
                {logs.map((log, i) => (
                  <HStack key={i} gap="2" fontSize="xs">
                    <Text color="fg.muted" flexShrink={0}>
                      {log.timestamp.toLocaleTimeString()}
                    </Text>
                    <Code fontSize="xs">{log.message}</Code>
                  </HStack>
                ))}
              </VStack>
            </Collapsible.Content>
          </Collapsible.Root>
        </Box>
      )}
    </Box>
  )
}
