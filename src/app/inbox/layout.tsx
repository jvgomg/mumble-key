import Link from "next/link"
import { redirect } from "next/navigation"
import { getSessionMagicWords } from "../../state/mutations"
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
      <h1>Message Inbox</h1>
      <div style={{ display: "flex", gap: "1em" }}>
        <RefreshButton />
        <Link href="/destroy" className="button danger">
          Destroy Magic Words
        </Link>
      </div>
      {children}
    </div>
  )
}
