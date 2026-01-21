"use client"

import { MagicWords } from "@/state/domain"
import { Box, Button, Code, HStack } from "@chakra-ui/react"

export const MagicWordsDisplay = ({
  magicWords,
  showCopyButton = true,
}: {
  magicWords: MagicWords
  showCopyButton?: boolean
}) => {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(magicWords.join(" "))
    } catch (error) {
      alert("Failed to copy to clipboard")
      console.error("Failed to copy to clipboard", { error })
    }
  }

  return (
    <HStack gap="4" align="center">
      <HStack as="ol" gap="4" listStyleType="none" p="0" m="0">
        {magicWords.map((word) => (
          <Box as="li" key={word}>
            <Code>{word}</Code>
          </Box>
        ))}
      </HStack>
      {showCopyButton && (
        <Box>
          <Button
            variant="outline"
            onClick={copyToClipboard}
            size="sm"
          >
            Copy to clipboard
          </Button>
        </Box>
      )}
    </HStack>
  )
}

export default MagicWordsDisplay
