import MagicWordsDisplay from "@/components/magic-words-display"
import type { Metadata } from "next"
import Link from "next/link"
import { getSessionMagicWords } from "./mutations"

export const metadata: Metadata = {
  title: "Mumble Key",
  // description: "",
}

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const magicWords = await getSessionMagicWords()

  return (
    <html lang="en">
      <body>
        <header>
          <Link href="/">Mumble Key</Link>

          {magicWords && (
            <>
              <MagicWordsDisplay magicWords={magicWords} />
              <Link href="/inbox">Message Inbox</Link>
            </>
          )}
        </header>

        {children}
      </body>
    </html>
  )
}
