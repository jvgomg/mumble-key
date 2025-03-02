"use client"
import { setupClientKeysOnDevice } from "@/state/client-keys"
import { useState } from "react"

// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto
// https://github.com/mdn/dom-examples/blob/main/web-crypto/encrypt-decrypt/rsa-oaep.js

export const ClientKeygenDemo = () => {
  const [publicKey, setPublicKey] = useState<string | undefined>(undefined)
  const [generationTime, setGenerationTime] = useState<number | undefined>(
    undefined,
  )

  const handleSetup = async () => {
    const { publicKey, time } = await setupClientKeysOnDevice()
    setPublicKey(publicKey.type)
    setGenerationTime(time)
  }

  return (
    <section>
      <h2>Client Keygen Demo</h2>
      <button onClick={handleSetup}>Setup Client Keys</button>

      <dl>
        <dt>Private Key</dt>
        <dd>
          <code>{publicKey || "-"}</code>
        </dd>
        <dt>Generation Time</dt>
        <dd>
          <code>{generationTime}ms</code>
        </dd>
      </dl>
    </section>
  )
}

export default ClientKeygenDemo
