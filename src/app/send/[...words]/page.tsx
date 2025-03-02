import { MessageForm } from "@/app/message-form"
import {
  exchangeMagicWordsForPublicKey,
  sendMessageToMagicWords,
} from "@/app/mutations"
import MagicWordsDisplay from "@/components/magic-words-display"
import { MagicWords } from "@/state/domain"
import assert from "assert"

interface Props {
  params: Promise<{ words: MagicWords }>
}

export default async function Page({ params }: Props) {
  const { words: magicWords } = await params
  const publicKey = await exchangeMagicWordsForPublicKey(magicWords)

  // TODO: handle magic words not found

  const handle = async (formData: FormData) => {
    "use server"
    console.log({ formData })

    const encryptedKey = formData.get("encryptedKey")
    const encryptedMessage = formData.get("encryptedMessage")
    const iv = formData.get("iv")

    console.log({ encryptedKey, encryptedMessage, iv })

    assert(typeof encryptedKey === "string", "key is not a string")
    assert(typeof encryptedMessage === "string", "data is not a string")
    assert(typeof iv === "string", "iv is not a string")

    await sendMessageToMagicWords({
      magicWords,
      message: { encryptedKey, encryptedMessage, iv },
    })
  }

  return (
    <div>
      <h1>Send message to…</h1>
      <MagicWordsDisplay magicWords={magicWords} />
      <MessageForm
        receiverPublicKey={publicKey}
        magicWords={magicWords}
        action={handle}
      />
    </div>
  )
}
