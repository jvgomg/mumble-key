import Link from "next/link"

export default function Page() {
  return (
    <div>
      <h1>🗝️ MumbleKey</h1>
      <p>
        <em>Send messages securely, anonymously and asynchronously.</em>
      </p>
      <p>
        This application is a Next.js reimplementation of{" "}
        <a href="https://github.com/pixielabs/whisper-key" target="_blank">
          WhisperKey
        </a>
        . Learn about this project and read the source code on{" "}
        <a href="https://github.com/jvgomg/mumble-key" target="_blank">
          GitHub
        </a>
        .
      </p>

      <section>
        <h2>I want to…</h2>

        <div style={{ display: "flex", gap: "1em" }}>
          <Link href="/send" className="button ">
            Send a message
          </Link>
          <Link href="/receive" className="button">
            Receive messages
          </Link>
        </div>
      </section>
    </div>
  )
}
