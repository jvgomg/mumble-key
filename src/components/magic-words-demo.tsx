"use server"

import { getMagicWords } from "@/state/magic-words"
import React from "react"

export const MagicWordsDemo = async () => {
  return (
    <section>
      <h2>Magic Words Demo</h2>
      <dl>
        {[0, 1, 2, 3, 99999].map(async (_, i) => (
          <React.Fragment key={i}>
            <dt>Seed #{i}</dt>
            {(await getMagicWords(i)).map((word) => (
              <dd key={word}>{word}</dd>
            ))}
          </React.Fragment>
        ))}
      </dl>
    </section>
  )
}

export default MagicWordsDemo
