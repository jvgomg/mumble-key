"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState, useTransition } from "react"

export const RefreshButton = () => {
  const refresh = useRouterRefresh()

  const [working, setWorking] = useState(false)

  const handle = async () => {
    setWorking(true)
    await refresh()
    setWorking(false)
  }

  return (
    <button onClick={handle} disabled={working}>
      Refresh
    </button>
  )
}

// https://github.com/vercel/next.js/discussions/58520#discussioncomment-9605299
function useRouterRefresh() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [resolve, setResolve] = useState<((value: unknown) => void) | null>(
    null,
  )
  const [isTriggered, setIsTriggered] = useState(false)

  const refresh = () => {
    return new Promise((resolve) => {
      setResolve(() => resolve)
      startTransition(() => {
        router.refresh()
      })
    })
  }

  useEffect(() => {
    if (isTriggered && !isPending) {
      if (resolve) {
        resolve(null)
        setIsTriggered(false)
        setResolve(null)
      }
    }
    if (isPending) {
      setIsTriggered(true)
    }
  }, [isTriggered, isPending, resolve])

  return refresh
}
