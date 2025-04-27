"use client"

import {
  getPrivateKeyLocalStorage,
  removePrivateKeyLocalStorage,
} from "@/state/client-keys"
import Link from "next/link"
import { useEffect, useState } from "react"
import { destroySession } from "../../state/mutations"
import { useRouter } from "next/navigation"

export const DestroyConfirmation = ({
  serverThings,
}: {
  serverThings: string[]
}) => {
  const router = useRouter()

  const [privateKeyPresent, setPrivateKeyPresent] = useState<
    undefined | boolean
  >(undefined)

  const loaded = privateKeyPresent !== undefined

  const thingsToDestroy: string[] = [...serverThings]

  if (privateKeyPresent) {
    thingsToDestroy.push("The Private Key stored in your browser")
  }

  useEffect(() => {
    const checkPrivateKey = async () => {
      const privateKey = await getPrivateKeyLocalStorage()
      setPrivateKeyPresent(!!privateKey)
    }
    checkPrivateKey()
  }, [])

  const [working, setWorking] = useState(false)

  const confirmed = async () => {
    setWorking(true)
    removePrivateKeyLocalStorage()
    await destroySession()
    router.replace("/")
  }

  if (!loaded) {
    return (
      <div>
        <em>Checking things…</em>
      </div>
    )
  }

  return (
    <div>
      <p>The following things will be destroyed:</p>
      <ul>
        {thingsToDestroy.map((thing) => (
          <li key={thing}>{thing}</li>
        ))}
      </ul>

      <div style={{ display: "flex", gap: "0.5em" }}>
        <Link href="/" className="button">
          Cancel
        </Link>

        <button onClick={confirmed} disabled={working} className="danger">
          Destroy session
        </button>
      </div>
    </div>
  )
}
