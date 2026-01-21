import {
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  Link,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react"
import {
  KeyRound,
  Lock,
  Mail,
  MessageSquare,
  Send,
  Shield,
  Timer,
} from "lucide-react"
import NextLink from "next/link"

export default function Page() {
  return (
    <Box>
      {/* Hero Section */}
      <VStack gap="6" textAlign="center" py="8">
        <VStack gap="2">
          <HStack gap="2" justify="center">
            <Icon boxSize="6" color="text.secondary">
              <KeyRound />
            </Icon>
            <Heading as="h1" size="xl" fontWeight="semibold">
              MumbleKey
            </Heading>
          </HStack>
          <Text color="text.secondary" fontSize="md" maxW="md">
            Secure, anonymous messaging with end-to-end encryption. No accounts.
            No tracking. Just privacy.
          </Text>
        </VStack>

        {/* Action Buttons */}
        <HStack
          gap={{ base: "6", sm: "8" }}
          flexDirection={{ base: "column", sm: "row" }}
          w="full"
          maxW="lg"
          align="stretch"
        >
          <VStack flex="1" gap="3">
            <Button
              asChild
              size="xl"
              colorPalette="blue"
              w="full"
              h="16"
              fontSize="lg"
            >
              <NextLink href="/receive">
                <Icon boxSize="5" mr="2">
                  <Mail />
                </Icon>
                Receive Messages
              </NextLink>
            </Button>
            <Text color="text.secondary" fontSize="xs" textAlign="center">
              Generate magic words to share with someone who wants to message
              you
            </Text>
          </VStack>

          <Box
            display={{ base: "none", sm: "block" }}
            w="1px"
            bg="border"
            alignSelf="stretch"
          />
          <Box
            display={{ base: "block", sm: "none" }}
            h="1px"
            w="full"
            bg="border"
          />

          <VStack flex="1" gap="3">
            <Button
              asChild
              size="xl"
              variant="outline"
              w="full"
              h="16"
              fontSize="lg"
            >
              <NextLink href="/send">
                <Icon boxSize="5" mr="2">
                  <Send />
                </Icon>
                Send a Message
              </NextLink>
            </Button>
            <Text color="text.secondary" fontSize="xs" textAlign="center">
              Use the magic words you were given to send an encrypted message
            </Text>
          </VStack>
        </HStack>
      </VStack>

      {/* About Section */}
      <Box as="section" py="10" borderTop="1px solid" borderColor="border">
        <VStack gap="8" align="stretch">
          <VStack gap="2" textAlign="center">
            <Heading as="h2" size="lg" fontWeight="semibold">
              How It Works
            </Heading>
            <Text color="text.secondary" maxW="lg" mx="auto">
              Exchange encrypted messages using &ldquo;magic words&rdquo;
              &mdash; a simple 3-word phrase that connects you anonymously.
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 3 }} gap="6">
            <FeatureCard
              icon={<KeyRound />}
              title="Magic Words"
              description="Generate a unique 3-word phrase that links to your public encryption key. Share it with anyone who wants to message you."
            />
            <FeatureCard
              icon={<Lock />}
              title="End-to-End Encryption"
              description="Messages are encrypted client-side using RSA + AES. Your private key never leaves your device."
            />
            <FeatureCard
              icon={<Timer />}
              title="Auto-Expiring"
              description="All data automatically expires after 7 days. No permanent storage, no long-term tracking."
            />
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap="6" mt="4">
            <FeatureCard
              icon={<Shield />}
              title="No Accounts Required"
              description="No sign-ups, no passwords, no personal information. Just generate your magic words and start messaging."
            />
            <FeatureCard
              icon={<MessageSquare />}
              title="Asynchronous Communication"
              description="Send messages even when the recipient is offline. They'll decrypt them when they return."
            />
          </SimpleGrid>
        </VStack>
      </Box>

      {/* Footer Links */}
      <Box
        as="section"
        py="6"
        borderTop="1px solid"
        borderColor="border"
        textAlign="center"
      >
        <Text color="text.secondary" fontSize="sm" suppressHydrationWarning>
          Inspired by{" "}
          <Link href="https://github.com/pixielabs/whisper-key" target="_blank">
            WhisperKey
          </Link>
          . View the source on{" "}
          <Link href="https://github.com/jvgomg/mumble-key" target="_blank">
            GitHub
          </Link>
          .
        </Text>
      </Box>
    </Box>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <Box
      p="5"
      borderRadius="lg"
      bg="bg.secondary"
      border="1px solid"
      borderColor="border"
    >
      <VStack align="start" gap="3">
        <Icon boxSize="6" color="link">
          {icon}
        </Icon>
        <Heading as="h3" size="md" fontWeight="semibold">
          {title}
        </Heading>
        <Text color="text.secondary" fontSize="sm" lineHeight="tall">
          {description}
        </Text>
      </VStack>
    </Box>
  )
}
