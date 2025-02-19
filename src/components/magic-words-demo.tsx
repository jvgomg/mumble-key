"use server"

import { getMagicWords } from "@/state/magic-words"
import React from "react"

export const MagicWordsDemo = async () => {
  return (
    <section>
      <h2>Magic Words Demo</h2>
      <dl>
        {[0, 1, 2, 3, 99999].map(async (seed) => (
          <React.Fragment key={seed}>
            <dt>Seed #{seed}</dt>
            {(await getMagicWords(seed)).map((word) => (
              <dd key={word}>{word}</dd>
            ))}
          </React.Fragment>
        ))}
      </dl>
    </section>
  )
}

export default MagicWordsDemo
