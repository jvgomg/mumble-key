export default async function Page({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <h1>Receive messages</h1>
      <p>
        Generate some Magic Words and then give them to the person who wants to
        send you a message.
      </p>

      {children}
    </div>
  )
}
