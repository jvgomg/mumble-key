"use server"

import { sessionClear, sessionExtend, sessionStart } from "@/state/session"
import { cookies } from "next/headers"

export const SessionDemo = async () => {
  const cookieStore = await cookies()

  const session = cookieStore.get("session")

  return (
    <section>
      <h2>Session Demo</h2>
      <p>Session ID: {session?.value || "none"}</p>
      <button onClick={sessionStart}>Start session</button>
      <button onClick={sessionExtend}>Extend session</button>
      <button onClick={sessionClear}>Clear session</button>
    </section>
  )
}

export default SessionDemo
