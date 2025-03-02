import MagicWordsDisplay from "@/components/magic-words-display"
import { getSessionMagicWords } from "../mutations"
import { GenerateMagicWordsFlow } from "./_components/generate-flow"
import Link from "next/link"

export default async function Page() {
  const magicWords = await getSessionMagicWords()

  // TODO: check validity of local storage state (is the private key still there?)

  const magicWordsChildren = magicWords && (
    <div>
      <hr />

      <h2>Magic Words</h2>
      <MagicWordsDisplay magicWords={magicWords} />

      <p>
        <strong>
          Mumble these Magic Words to the person who wants to send you a message
        </strong>
      </p>

      <ul>
        <li>
          <Link href="/inbox">Go to Message Inbox</Link>
        </li>
      </ul>
    </div>
  )

  return (
    <div>
      <GenerateMagicWordsFlow />

      {magicWordsChildren}
    </div>
  )
}
