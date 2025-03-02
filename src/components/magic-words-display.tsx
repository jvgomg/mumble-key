"use client"

import { MagicWords } from "@/state/domain"
import { CopyIcon } from "lucide-react"

export const MagicWordsDisplay = ({
  magicWords,
}: {
  magicWords: MagicWords
}) => {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(magicWords.join(" "))
    } catch (error) {
      alert("Failed to copy to clipboard")
      console.error("Failed to copy to clipboard", { error })
    }
  }

  return (
    <div>
      <ol>
        {magicWords.map((word) => (
          <li key={word}>{word}</li>
        ))}
      </ol>
      <button onClick={copyToClipboard}>
        <CopyIcon /> Copy to clipboard
      </button>
    </div>
  )
}

export default MagicWordsDisplay
