import ClientKeygen from "@/components/client-keygen"
import MagicWordsDemo from "@/components/magic-words-demo"
import SessionDemo from "@/components/session-demo"

export default function Home() {
  return (
    <div>
      <h1>Mumble Key</h1>

      <ClientKeygen />
      <SessionDemo />
      <MagicWordsDemo />
    </div>
  )
}
