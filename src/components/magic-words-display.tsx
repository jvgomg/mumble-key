"use client"

import { MagicWords } from "@/state/domain"

export const MagicWordsDisplay = ({
  magicWords,
  showCopyButton = true,
}: {
  magicWords: MagicWords
  showCopyButton?: boolean
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
    <div style={{ display: "flex", gap: "1em", alignItems: "center" }}>
      <ol
        style={{
          display: "flex",
          gap: "1em",
          listStyle: "none",
          padding: 0,
          margin: 0,
        }}
      >
        {magicWords.map((word) => (
          <li key={word}>
            <pre>{word}</pre>
          </li>
        ))}
      </ol>
      {showCopyButton && (
        <div>
          <button
            className="outline"
            onClick={copyToClipboard}
            style={{ fontSize: ".77em" }}
          >
            Copy to clipboard
          </button>
        </div>
      )}
    </div>
  )
}

export default MagicWordsDisplay
