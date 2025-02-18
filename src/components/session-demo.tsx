"use server"

import { sessionClear, sessionExtend, sessionStart } from "@/state/session"
import { cookies } from "next/headers"

export const SessionDemo = async () => {
  const cookieStore = await cookies()

  const session = cookieStore.get("session")

  return (
    <div>
      <p>Session: {session?.value || "none"}</p>
      <button onClick={sessionStart}>Start session</button>
      <button onClick={sessionExtend}>Extend session</button>
      <button onClick={sessionClear}>Clear session</button>
    </div>
  )
}

export default SessionDemo
