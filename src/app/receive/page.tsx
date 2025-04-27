import MagicWordsDisplay from "@/components/magic-words-display"
import { getSessionMagicWords } from "../mutations"
import { GenerateMagicWordsFlow } from "./_components/generate-flow"
import Link from "next/link"

export default async function Page() {
  const magicWords = await getSessionMagicWords()

  // TODO: check validity of local storage state (is the private key still there?)

  return (
    <div>
      <h1>Receive messages</h1>
      <p>
        Generate some Magic Words and then give them to the person who wants to
        send you a message.
      </p>

      <GenerateMagicWordsFlow />

      <hr />
      <h2>Magic Words</h2>

      {magicWords ? (
        <>
          <MagicWordsDisplay magicWords={magicWords} />
          <p>
            Mumble these Magic Words to the person who wants to send you a
            message.
          </p>
          <Link href="/inbox">Go to Message Inbox</Link>
        </>
      ) : (
        <>
          <p>Complete the steps above to summon your Magic Words</p>
        </>
      )}
    </div>
  )
}
