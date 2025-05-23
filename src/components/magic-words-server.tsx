import { getSessionMagicWords } from "@/state/mutations"

export const MagicWordsServer = async () => {
  const magicWords = await getSessionMagicWords()

  return (
    <div>
      <h3>Current Magic Words</h3>
      <dl>
        <dt>Magic Words rendered on server</dt>
        {magicWords?.map((word) => <dd key={word}>{word}</dd>) || <dd>None</dd>}
      </dl>
    </div>
  )
}

export default MagicWordsServer
