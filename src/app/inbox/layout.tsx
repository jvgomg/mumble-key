import Link from "next/link"
import { redirect } from "next/navigation"
import { getSessionMagicWords } from "../mutations"
import { RefreshButton } from "./refresh-button"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const magicWords = await getSessionMagicWords()

  if (!magicWords) redirect("/")

  return (
    <div>
      <hr />

      <h1>Message Inbox</h1>
      <RefreshButton />
      <Link href="/destroy">Destroy</Link>
      <main>{children}</main>
    </div>
  )
}
