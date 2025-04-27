import { sessionGet } from "@/state/session"
import { getSessionMagicWords, getSessionMessages } from "../mutations"
import { DestroyConfirmation } from "./destory-confirmation"
import { redirect } from "next/navigation"

export default async function Page() {
  const thingsToDestroy = await getThingsToDestroy()

  return (
    <div>
      <h1>Start again</h1>
      <p>Are you sure you want destroy your session?</p>
      <DestroyConfirmation serverThings={thingsToDestroy} />
    </div>
  )
}

const getThingsToDestroy = async (): Promise<string[]> => {
  const things: string[] = []

  const session = await sessionGet()
  if (!session) redirect("/")
  things.push("Your session with the server")

  const magicWords = await getSessionMagicWords()
  const messages = await getSessionMessages()

  if (magicWords) {
    things.push("Your Magic Words and Public Key stored on the server")
  }

  if (messages.length) {
    things.push(`${messages.length} message${messages.length === 1 ? "" : "s"}`)
  }

  return things
}
