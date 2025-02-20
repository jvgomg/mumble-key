import ClientKeygenDemo from "@/components/client-keygen-demo"
import FlowDemo from "@/components/flow-demo"
import MagicWordsDemo from "@/components/magic-words-demo"
import MagicWordsDisplay from "@/components/magic-words-display"
import SessionDemo from "@/components/session-demo"

export default function Home() {
  return (
    <div>
      <h1>Mumble Key</h1>

      <FlowDemo />
      <MagicWordsDisplay />
      <ClientKeygenDemo />
      <SessionDemo />
      <MagicWordsDemo />
    </div>
  )
}
