import { BIP32Factory } from 'bip32';
import * as bip39 from 'bip39';
import { ethers } from 'ethers';
import * as ecc from 'tiny-secp256k1';

// Initialize the BIP32 library using a secp256k1 implementation
const bip32 = BIP32Factory(ecc);

// Default Ethereum derivation path as per BIP44 standard
const DEFAULT_PATH = "m/44'/60'/0'/0/0";

// Mapping of mnemonic word counts to their corresponding entropy strength in bits
const STRENGTH_OPTIONS: Record<number, number> = {
  12: 128, // 128 bits => 12 words
  15: 160, // 160 bits => 15 words
  18: 192, // 192 bits => 18 words
  24: 256, // 256 bits => 24 words
};

/**
 * Generates an Ethereum wallet using a mnemonic phrase.
 * @param mnemonicLength - The desired number of words in the mnemonic phrase (e.g., 12, 15, 18, 24).
 * @returns An object containing the mnemonic, Ethereum address, and private key.
 */
export const generateKeys = (mnemonicLength: number) => {
  // Get the entropy strength based on the provided mnemonic length
  const strength = STRENGTH_OPTIONS[mnemonicLength];
  if (!strength) throw new Error('Invalid mnemonic length');

  // Generate the mnemonic phrase
  const mnemonic = bip39.generateMnemonic(strength);

  // Convert the mnemonic into a seed
  const seed = bip39.mnemonicToSeedSync(mnemonic);

  // Derive the root key from the seed
  const root = bip32.fromSeed(seed);

  // Derive the child key at the specified derivation path
  const child = root.derivePath(DEFAULT_PATH);

  if (!child.privateKey) {
    throw new Error('Failed to derive private key');
  }

  // Create an Ethereum wallet instance using the derived private key
  const wallet = new ethers.Wallet(ethers.hexlify(child.privateKey));

  // Return the mnemonic, Ethereum address, and private key
  return {
    mnemonic,
    address: wallet.address,
    privateKey: ethers.hexlify(child.privateKey),
  };
};

/**
 * Encrypts a string using a password and AES-GCM encryption.
 * @param data - The data to encrypt.
 * @param password - The password to derive the encryption key.
 * @returns A promise that resolves to a JSON string containing the encrypted data, IV, and salt.
 */
export const encryptData = async (
  data: string,
  password: string
): Promise<string> => {
  const encoder = new TextEncoder();

  // Encode the password into a binary buffer
  const passwordBuffer = encoder.encode(password);

  // Generate a random salt for key derivation
  const salt = window.crypto.getRandomValues(new Uint8Array(16));

  // Derive an encryption key using PBKDF2 and the provided password
  const key = await window.crypto.subtle
    .importKey('raw', passwordBuffer, { name: 'PBKDF2' }, false, ['deriveKey'])
    .then((baseKey) =>
      window.crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
        baseKey,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
      )
    );

  // Generate a random initialization vector (IV)
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  // Encode the data into a binary buffer
  const dataBuffer = encoder.encode(data);

  // Encrypt the data using AES-GCM
  const encryptedData = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    dataBuffer
  );

  // Convert the encrypted data, IV, and salt to base64 strings
  const encryptedBase64 = btoa(
    String.fromCharCode(...new Uint8Array(encryptedData))
  );
  const ivBase64 = btoa(String.fromCharCode(...iv));
  const saltBase64 = btoa(String.fromCharCode(...salt));

  // Return the encryption result as a JSON string
  return JSON.stringify({
    encryptedData: encryptedBase64,
    iv: ivBase64,
    salt: saltBase64,
  });
};

/**
 * Decrypts an AES-GCM encrypted string using a password.
 * @param encryptedData - The JSON string containing the encrypted data, IV, and salt.
 * @param password - The password to derive the decryption key.
 * @returns A promise that resolves to the decrypted plaintext string.
 */
export const decryptData = async (
  encryptedData: string,
  password: string
): Promise<string> => {
  // Parse the input JSON to extract the encrypted data, IV, and salt
  const {
    encryptedData: encryptedBase64,
    iv: ivBase64,
    salt: saltBase64,
  } = JSON.parse(encryptedData);

  const encoder = new TextEncoder();

  // Encode the password into a binary buffer
  const passwordBuffer = encoder.encode(password);

  // Decode the salt, IV, and encrypted data from base64 strings
  const salt = new Uint8Array(
    atob(saltBase64)
      .split('')
      .map((c) => c.charCodeAt(0))
  );
  const iv = new Uint8Array(
    atob(ivBase64)
      .split('')
      .map((c) => c.charCodeAt(0))
  );
  const encryptedArray = new Uint8Array(
    atob(encryptedBase64)
      .split('')
      .map((c) => c.charCodeAt(0))
  );

  // Derive the decryption key using PBKDF2 and the provided password
  const key = await window.crypto.subtle
    .importKey('raw', passwordBuffer, { name: 'PBKDF2' }, false, ['deriveKey'])
    .then((baseKey) =>
      window.crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
        baseKey,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
      )
    );

  // Decrypt the encrypted data using AES-GCM
  const decryptedData = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    encryptedArray
  );

  // Decode the decrypted binary buffer into a plaintext string
  const decoder = new TextDecoder();
  return decoder.decode(decryptedData);
};
