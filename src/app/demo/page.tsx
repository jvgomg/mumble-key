import ClientKeygenDemo from "@/components/client-keygen-demo"
import FlowDemo from "@/components/flow-demo"
import MagicWordsDemo from "@/components/magic-words-demo"
import MagicWordsServer from "@/components/magic-words-server"
import SessionDemo from "@/components/session-demo"

export default function Page() {
  return (
    <div>
      <h1>Mumble Key Demo bits</h1>
      <FlowDemo />
      <MagicWordsServer />
      <ClientKeygenDemo />
      <SessionDemo />
      <MagicWordsDemo />
    </div>
  )
}
