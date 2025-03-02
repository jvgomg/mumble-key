import Link from "next/link"

export default function Page() {
  return (
    <div>
      <h1>Mumble Key</h1>
      <p>Send messages securely, anonymously and asynchronously.</p>
      <p>
        Mumble Key is a reimplementation of the Whisper Key application. Learn
        about this project and read the sourcecode over at{" "}
        <a href="https://github.com/jvgomg/mumble-key">GitHub</a>.
      </p>

      <hr />

      <Link href="/send">Send a message</Link>
      <Link href="/receive">Receive messages</Link>
    </div>
  )
}
