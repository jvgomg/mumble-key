"use client"
import { useState } from "react"

// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto
// https://github.com/mdn/dom-examples/blob/main/web-crypto/encrypt-decrypt/rsa-oaep.js

export const ClientKeygen = () => {
  const [publicKey, setPublicKey] = useState<string | undefined>(undefined)

  const generate = async () => {
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
    console.log({ keyPair })
    setPublicKey(
      (await window.crypto.subtle.exportKey("jwk", keyPair.publicKey))?.n,
    )
  }

  return (
    <div>
      <h2>Client Keygen</h2>
      <button onClick={generate}>Generate a key pair</button>
      <p>publicKey: {publicKey}</p>
    </div>
  )
}

export default ClientKeygen
