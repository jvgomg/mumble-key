"use client"

import {
  getPrivateKeyLocalStorage,
  removePrivateKeyLocalStorage,
} from "@/state/client-keys"
import Link from "next/link"
import { useEffect, useState } from "react"
import { destroySession } from "../mutations"
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
      <p>Are you sure you want start again?</p>

      <p>The following things will be destroyed:</p>
      <ul>
        {thingsToDestroy.map((thing) => (
          <li key={thing}>{thing}</li>
        ))}
      </ul>

      <Link href="/">Cancel</Link>

      <button onClick={confirmed} disabled={working}>
        Confirm
      </button>
    </div>
  )
}
