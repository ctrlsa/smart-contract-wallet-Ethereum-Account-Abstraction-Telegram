import { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

/**
 * Custom hook to securely store and retrieve data in a Telegram Mini App
 * using client-side encryption.
 */
const useTelegramStore = () => {
  // State to track if the store is initialized
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // State to hold the derived encryption key
  const [encryptionKey, setEncryptionKey] = useState<string | null>(null);

  /**
   * Initialize the encryption key using Telegram Web App data.
   * This ensures data is tied to the current session.
   */
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg && tg.initData) {
      const derivedKey = CryptoJS.SHA256(tg.initData).toString();
      setEncryptionKey(derivedKey);
      setIsInitialized(true);
      console.log({tg})
    } else {
      console.error('Telegram Web App not initialized');
    }
  }, []);

  /**
   * Encrypt data using AES encryption with the derived encryption key.
   *
   * @param data - The data to be encrypted (can be any JSON-serializable object).
   * @returns The encrypted string.
   * @throws Error if the encryption key is not initialized.
   */
  const encrypt = (data: any): string => {
    if (!encryptionKey) throw new Error('Encryption key is not initialized');
    return CryptoJS.AES.encrypt(JSON.stringify(data), encryptionKey).toString();
  };

  /**
   * Decrypt data using AES decryption with the derived encryption key.
   *
   * @param cipherText - The encrypted string to decrypt.
   * @returns The original data object.
   * @throws Error if the encryption key is not initialized or decryption fails.
   */
  const decrypt = (cipherText: string): any => {
    if (!encryptionKey) throw new Error('Encryption key is not initialized');
    const bytes = CryptoJS.AES.decrypt(cipherText, encryptionKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  };

  /**
   * Store data securely in localStorage after encrypting it.
   *
   * @param key - The key under which the data should be stored.
   * @param value - The value to store (can be any JSON-serializable object).
   * @throws Error if the store is not initialized or storing fails.
   */
  const setItem = (key: string, value: any): void => {
    try {
      if (!isInitialized) throw new Error('Telegram Store is not initialized');
      const encryptedData = encrypt(value);
      localStorage.setItem(key, encryptedData);
    } catch (err) {
      console.error('Error storing data:', err);
    }
  };

  /**
   * Retrieve data securely from localStorage and decrypt it.
   *
   * @param key - The key of the data to retrieve.
   * @returns The decrypted data, or null if the key does not exist.
   * @throws Error if the store is not initialized or retrieval fails.
   */
  const getItem = (key: string): any | null => {
    try {
      if (!isInitialized) throw new Error('Telegram Store is not initialized');
      const cipherText = localStorage.getItem(key);
      if (!cipherText) return null;
      return decrypt(cipherText);
    } catch (err) {
      console.error('Error retrieving data:', err);
      return null;
    }
  };

  /**
   * Remove data securely from localStorage.
   *
   * @param key - The key of the data to remove.
   * @throws Error if the store is not initialized or removal fails.
   */
  const removeItem = (key: string): void => {
    try {
      if (!isInitialized) throw new Error('Telegram Store is not initialized');
      localStorage.removeItem(key); // Use sessionStorage if desired
    } catch (err) {
      console.error('Error removing data:', err);
    }
  };

  return { setItem, getItem, removeItem, isInitialized };
};

export default useTelegramStore;
