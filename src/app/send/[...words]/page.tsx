import { MagicWords } from "@/state/domain"
import { exchangeMagicWordsForPublicKey } from "@/state/mutations"
import { MessageForm } from "./message-form"

interface Props {
  params: Promise<{ words: MagicWords }>
}

export default async function Page({ params }: Props) {
  const { words: magicWords } = await params
  const publicKey = await exchangeMagicWordsForPublicKey(magicWords)

  // TODO: handle magic words not found

  return (
    <div>
      <h1>Send a message…</h1>
      <MessageForm receiverPublicKey={publicKey} magicWords={magicWords} />
    </div>
  )
}
