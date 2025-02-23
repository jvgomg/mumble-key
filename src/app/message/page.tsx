import { MessageForm } from "../message-form"
import {
  exchangeMagicWordsForPublicKey,
  getSessionMagicWords,
} from "../mutations"

export default async function Page() {
  // TODO: get magic words that have been provided in an earlier step, rather than using your own
  const magicWords = await getSessionMagicWords()
  const receiverPublicKey = await exchangeMagicWordsForPublicKey(magicWords!)

  const submitMessage = async (formData: FormData) => {
    "use server"
    console.log({ formData })

    // TODO: demonstrate decrypting message
  }

  return (
    <MessageForm
      magicWords={magicWords!}
      receiverPublicKey={receiverPublicKey}
      action={submitMessage}
    />
  )
}
