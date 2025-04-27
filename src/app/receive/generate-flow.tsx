"use client"

import { exchangePublicKeyForMagicWords } from "@/app/mutations"
import {
  generateClientKeyPair,
  setPrivateKeyLocalStorage,
  stringifyKey,
} from "@/state/client-keys"
import { MagicWords } from "@/state/domain"
import { useState } from "react"

export const GenerateMagicWordsFlow = () => {
  const [working, setWorking] = useState(false)

  const [step1, setStep1] = useState<
    undefined | { time?: number; keyPair: CryptoKeyPair }
  >()

  const [step2, setStep2] = useState<undefined | { complete: true }>()

  const [step3, setStep3] = useState<undefined | { magicWords: MagicWords }>()

  const generate = async () => {
    setWorking(true)
    const { time, keyPair } = await generateClientKeyPair()
    setStep1({ time, keyPair })
    setWorking(false)
  }

  const savePrivateKey = async () => {
    if (!step1?.keyPair) throw new Error("No keypair in state")
    setWorking(true)
    await setPrivateKeyLocalStorage(step1.keyPair)
    setStep2({ complete: true })
    setWorking(false)
  }

  const exchangePublicKey = async () => {
    if (!step1?.keyPair) throw new Error("No keypair in state")
    setWorking(true)
    const magicWords = await exchangePublicKeyForMagicWords(
      await stringifyKey(step1.keyPair.publicKey),
    )
    setStep3({ magicWords })
    setWorking(false)
  }

  return (
    <div>
      <h2>Generate Magic Words</h2>
      <p>
        Summoning Magic Words in a secure way requires an enchantment involving
        a few steps.
      </p>

      <section data-complete={!!step1}>
        <h3>Step 1</h3>
        <p>
          Generate 2 cryptographic keys locally, within your device’s web
          browser
        </p>
        <button onClick={generate} disabled={working || !!step1}>
          Generate Keys
        </button>
        {step1?.time && <pre>Time taken: {step1.time / 1000} seconds</pre>}
      </section>

      <section data-complete={!!step1}>
        <h3>Step 2</h3>
        <p>
          Save the <em>private</em> key into your web browser storage
        </p>
        <div>
          <div>
            <button
              disabled={!step1 || !!step2 || working}
              onClick={savePrivateKey}
            >
              Save private key locally
            </button>
          </div>
        </div>
      </section>

      <section data-complete={!!step1 || !!step2}>
        <h3>Step 3</h3>
        <p>
          Send the <em>public</em> key to the server and exchange for some Magic
          Words
        </p>
        <div>
          <button
            disabled={!step1 || !step2 || !!step3 || working}
            onClick={exchangePublicKey}
          >
            Send public key
          </button>
        </div>
      </section>
    </div>
  )
}
