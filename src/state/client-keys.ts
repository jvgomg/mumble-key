"use client"

const PRIVATE_KEY_LOCAL_STORAGE_KEY = "private-key"

export const setupClientKeys = async (): Promise<{
  time: number
  publicKey: CryptoKey
}> => {
  const startTime = new Date().getTime()

  const keyPair = await generateClientKeyPair()
  const time = new Date().getTime() - startTime
  await setPrivateKeyLocalStorage(keyPair)

  return {
    time,
    publicKey: keyPair.publicKey,
  }
}

export const setPrivateKeyLocalStorage = async (keyPair: CryptoKeyPair) => {
  const exportedKey = await crypto.subtle.exportKey("jwk", keyPair.privateKey)
  const stringKey = JSON.stringify(exportedKey)
  localStorage.setItem(PRIVATE_KEY_LOCAL_STORAGE_KEY, stringKey)
}

export const getPrivateKeyLocalStorage = async (): Promise<
  CryptoKey | undefined
> => {
  const stringKey = localStorage.getItem(PRIVATE_KEY_LOCAL_STORAGE_KEY)
  if (!stringKey) return
  const parsedKey = JSON.parse(stringKey) as JsonWebKey
  const importedKey = importPrivateKey(parsedKey)
  return importedKey
}

/**
 * private methods
 */

const generateClientKeyPair = async (): Promise<CryptoKeyPair> => {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048, //can be 1024, 2048, or 4096
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: { name: "SHA-256" }, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
    },
    true,
    ["encrypt", "decrypt"],
  )
  return keyPair
}

const importPrivateKey = async (key: JsonWebKey): Promise<CryptoKey> => {
  const privateKey = await crypto.subtle.importKey(
    "jwk",
    key,
    {
      name: "RSA-OAEP",
      hash: { name: "SHA-256" }, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
    },
    false,
    ["decrypt"],
  )
  return privateKey
}

export const stringifyKey = async (key: CryptoKey): Promise<string> => {
  const exportedKey = await crypto.subtle.exportKey("jwk", key)
  const stringKey = JSON.stringify(exportedKey)
  return stringKey
}

// const rsaOptions = {
//   name: "RSA-OAEP",
//   modulusLength: 4096,
//   publicExponent: new Uint8Array([1, 0, 1]),
//   hash: "SHA-256",
// }
