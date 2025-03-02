import { MAGIC_WORDS_PHRASE_LENGTH } from "@/state/domain"
import assert from "assert"
import { redirect } from "next/navigation"

export default function Page() {
  async function handle(formData: FormData) {
    "use server"

    // TODO: handle validation errors better
    // TODO: look up magic words or send users back with the input prefilled tpo try again

    const magicWordsRaw = formData.get("words")
    if (!magicWordsRaw) {
      throw new Error("No Magic Words provided")
    }
    assert(
      typeof magicWordsRaw === "string",
      new Error("Magic Words are not a string"),
    )
    const magicWords = magicWordsRaw.split(" ")
    if (magicWords.length !== MAGIC_WORDS_PHRASE_LENGTH) {
      throw new Error("Magic Words phrase not the correct length")
    }

    redirect(`/send/${magicWords.join("/")}`)
  }

  return (
    <div>
      <h1>Send messages</h1>
      <p>
        To send a message you’ll need to ask the recipient to visit the app and
        generate some Magic Words.
      </p>

      <form action={handle}>
        <label htmlFor="words">Recipient’s Magic Words</label>
        <input id="words" name="words" type="text" />
        <button type="submit">Next</button>
      </form>
    </div>
  )
}
