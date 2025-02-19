"use client"
import { useState } from "react"

// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto
// https://github.com/mdn/dom-examples/blob/main/web-crypto/encrypt-decrypt/rsa-oaep.js

export const ClientKeygen = () => {
  const [publicKey, setPublicKey] = useState<string | undefined>(undefined)
  const [time, setTime] = useState<number | undefined>(undefined)

  const generate = async () => {
    const startTime = new Date().getTime()
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["encrypt", "decrypt"],
    )
    const time = new Date().getTime() - startTime
    setPublicKey(
      (await window.crypto.subtle.exportKey("jwk", keyPair.publicKey))?.n,
    )
    setTime(time)
    console.log({ keyPair })
  }

  return (
    <section>
      <h2>Client Keygen Demo</h2>
      <button onClick={generate}>Generate a key pair</button>
      {publicKey && (
        <dl>
          <dt>Public Key</dt>
          <dd>
            <code>{publicKey}</code>
          </dd>
          <dt>Generation Time</dt>
          <dd>
            <code>{time}ms</code>
          </dd>
        </dl>
      )}
    </section>
  )
}

export default ClientKeygen
