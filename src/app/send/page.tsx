import { Field } from "@/components/ui/field"
import { MAGIC_WORDS_PHRASE_LENGTH } from "@/state/domain"
import { Box, Button, Heading, Input, Text } from "@chakra-ui/react"
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
    <Box>
      <Heading as="h1" size="2xl" mb="4">
        Send messages
      </Heading>
      <Text mb="4">
        To send a message you&apos;ll need to ask the recipient to visit the app and
        generate some Magic Words.
      </Text>

      <form action={handle}>
        <Field label="Recipient&apos;s Magic Words" mb="4">
          <Input id="words" name="words" type="text" required />
        </Field>
        <Button type="submit">Next</Button>
      </form>
    </Box>
  )
}
