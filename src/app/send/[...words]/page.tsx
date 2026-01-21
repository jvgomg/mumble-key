import { MagicWords } from "@/state/domain"
import { exchangeMagicWordsForPublicKey } from "@/state/mutations"
import { Box, Heading } from "@chakra-ui/react"
import { MessageForm } from "./message-form"

interface Props {
  params: Promise<{ words: MagicWords }>
}

export default async function Page({ params }: Props) {
  const { words: magicWords } = await params
  const publicKey = await exchangeMagicWordsForPublicKey(magicWords)

  // TODO: handle magic words not found

  return (
    <Box>
      <Heading as="h1" size="2xl" mb="4">
        Send a message…
      </Heading>
      <MessageForm receiverPublicKey={publicKey} magicWords={magicWords} />
    </Box>
  )
}
