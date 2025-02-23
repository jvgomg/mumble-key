"use client"

import {
  exchangePublicKeyForMagicWords,
  getSessionMagicWords,
} from "@/app/mutations"
import { setupClientKeys, stringifyKey } from "@/state/client-keys"
import { MagicWords } from "@/state/magic-words"
import { useEffect, useState } from "react"

export const FlowDemo = () => {
  const [loaded, setLoaded] = useState(false)
  const [magicWords, setMagicWords] = useState<undefined | MagicWords>()

  const goForIt = async () => {
    const { publicKey } = await setupClientKeys()
    console.log({ publicKey })
    const magicWords = await exchangePublicKeyForMagicWords(
      await stringifyKey(publicKey),
    )
    console.log({ magicWords })
    setMagicWords(magicWords)
  }

  // TODO: make the magic words display a suspended server component
  useEffect(() => {
    const run = async () => {
      const magicWords = await getSessionMagicWords()
      setLoaded(true)
      if (!magicWords) return
      setMagicWords(magicWords)
    }
    run()
  }, [])

  return (
    <section>
      <h2>Exchange Key for MagicWords</h2>
      <button onClick={goForIt}>Go!</button>
      <dl>
        <dt>Magic Words that came back from request</dt>
        {!loaded && (
          <dd>
            <em>loading…</em>
          </dd>
        )}
        {magicWords?.map((word) => <dd key={word}>{word}</dd>) || <dd>None</dd>}
      </dl>
    </section>
  )
}

export default FlowDemo
