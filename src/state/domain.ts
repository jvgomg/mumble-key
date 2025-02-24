/**
 * MagicWords phrase
 * The words users mumble to each other
 */

export const MAGIC_WORDS_PHRASE_LENGTH = 3

export type MagicWords = Tuple<string, typeof MAGIC_WORDS_PHRASE_LENGTH>

/**
 * MagicMessage
 * The data needed to transport, store and decrypt a message between users
 */
// TODO: have a read of this - https://gist.github.com/rpivo/2904951ee31ce9146d32321f12c941bd
export interface MagicMessageEncoded {
  /**
   * The single use secondary AES key which has been encrypted with a public RSA key
   * AES-GCM - https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt#aes-gcm_2
   */
  encryptedKey: string
  /**
   * The user’s message which has been encrypted with the secondary key
   */
  encryptedMessage: string
  /**
   * The 'Initialization Vector' used with the secondary key
   */
  iv: string
}

/**
 * utils
 */

type Tuple<T, N extends number> = N extends N
  ? number extends N
    ? T[]
    : _TupleOf<T, N, []>
  : never
type _TupleOf<T, N extends number, R extends unknown[]> = R["length"] extends N
  ? R
  : _TupleOf<T, N, [T, ...R]>
