import { getSessionMessages } from "../mutations"
import { MessageItem } from "./message-item"

export default async function Page() {
  const messages = await getSessionMessages()

  if (!messages.length) {
    return (
      <div>
        <p>You have no messages</p>
      </div>
    )
  }

  return (
    <div>
      <ol>
        {messages.map((message, i) => (
          <li key={message.encryptedMessage?.slice(0, 4) || i}>
            <MessageItem message={message} />
          </li>
        ))}
      </ol>
    </div>
  )
}
