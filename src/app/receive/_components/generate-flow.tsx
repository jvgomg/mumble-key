"use client"

import { exchangePublicKeyForMagicWords } from "@/app/mutations"
import {
  generateClientKeyPair,
  setPrivateKeyLocalStorage,
  stringifyKey,
} from "@/state/client-keys"
import { MagicWords } from "@/state/domain"
import { KeyIcon } from "lucide-react"
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
        Summoning Magic Words, which are securely generated and exchanged,
        requires an enchantment involving a few steps
      </p>
      <ol>
        <li>Generate 2 cryptographic keys locally on your device</li>
        <li>
          Save the <em>private</em> key into your web browser storage
        </li>
        <li>
          Send <em>public</em> key to the server and get your Magic Words
          returned
        </li>
      </ol>

      <section data-complete={!!step1}>
        <h2>Step 1</h2>
        <button onClick={generate} disabled={working || !!step1}>
          Generate Keys
        </button>
      </section>

      <section data-complete={!!step1}>
        <h2>Step 2</h2>
        <div>
          {step1?.time && <p>Time taken: {step1.time / 1000} seconds</p>}
          <div>
            <KeyIcon />
            <small>Private key</small>
            <button
              disabled={!step1 || !!step2 || working}
              onClick={savePrivateKey}
            >
              Save private key
            </button>
          </div>
        </div>
      </section>

      <section data-complete={!!step1 || !!step2}>
        <h2>Step 3</h2>
        <div>
          <div>
            <KeyIcon />
            <small>Public key</small>
            <button
              disabled={!step1 || !step2 || !!step3 || working}
              onClick={exchangePublicKey}
            >
              Exchange for Magic Words
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
