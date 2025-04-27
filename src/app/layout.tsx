import MagicWordsDisplay from "@/components/magic-words-display"
import type { Metadata } from "next"
import Link from "next/link"
import { getSessionMagicWords } from "../state/mutations"
import "@/styles/cosmo.css"
import "@/styles/cosmo.extend.css"

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
          <section>
            <nav>
              <Link href="/">Mumble Key</Link>
            </nav>
          </section>

          {magicWords && (
            <>
              <MagicWordsDisplay magicWords={magicWords} />
              <Link href="/inbox">Message Inbox</Link>
            </>
          )}

          <hr />
        </header>

        <main>{children}</main>

        <footer>
          <hr />
          <p>
            <small>
              This application is under active development. It should not be
              used to send sensitive information.
            </small>
            <br />
            <small>Use at your own risk!</small>
          </p>
        </footer>
      </body>
    </html>
  )
}
