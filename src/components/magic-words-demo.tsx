"use server"

import { getMagicWords } from "@/state/magic-words"

export const MagicWordsDemo = async () => {
  const seed = 333
  const magicWords = await getMagicWords(seed)

  return (
    <div>
      <p>Magic Words from seed: {seed}</p>
      <ul>
        {magicWords.map((word) => (
          <li key={word}>{word}</li>
        ))}
      </ul>
    </div>
  )
}

export default MagicWordsDemo
