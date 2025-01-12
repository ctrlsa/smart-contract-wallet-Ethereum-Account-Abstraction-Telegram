# Deterministic Keys

## Overview

The `DeterministicKeys` component is part of a React application that allows users to generate deterministic Ethereum keys, encrypt/decrypt sensitive data (such as mnemonics), and sign user operations using Ethereum's ERC-4337 account abstraction. The core features include:

1. **Key Generation**: Generates a deterministic mnemonic and corresponding Ethereum private key using BIP32 and BIP39.
2. **Data Encryption/Decryption**: Allows encryption and decryption of the mnemonic using a password-derived AES-GCM key.
3. **User Operation Signing**: Signs a mock Ethereum user operation (as defined by ERC-4337) using the generated private key.

## Template and Prototype Information

This project is built based on the [Telegram Mini Apps React.js Template](https://github.com/Telegram-Mini-Apps/reactjs-template). The template provides a ready-to-use structure for creating Telegram Mini Apps using React.js.  

For more information about the template, including instructions on how to run and deploy your app, please refer to the [official repository](https://github.com/Telegram-Mini-Apps/reactjs-template).  

You can check the prototype of this application by interacting with the Telegram bot at [LionetCriticalDevBot](https://t.me/LionetCriticalDevBot/TelegramDeterministicKeys).

## Architecture & Logic

### 1. Key Generation
- **Mnemonic Generation**: The `generateKeys` function generates a mnemonic based on the selected word length (12, 15, 18, or 24 words). The mnemonic is generated using the `bip39` library, which employs a cryptographically secure method to generate random words.
- **Key Derivation**: Using the generated mnemonic, a seed is derived with the `bip39.mnemonicToSeedSync` method. The seed is then used to derive the Ethereum private key using the `bip32` library (BIP32 HD wallet). The derived key is used to create an Ethereum wallet object using `ethers.js`.
- **Return Values**: The generated mnemonic, address, and private key are returned.

### 2. Data Encryption
- **Password-based Key Derivation**: The `encryptData` function takes a password and uses it to derive an AES-GCM key via PBKDF2 with SHA-256. The password is hashed and salted before being used to derive the encryption key.
- **Encryption**: Using the AES-GCM encryption scheme, the mnemonic is encrypted with the derived key and a randomly generated Initialization Vector (IV). The IV is necessary for ensuring that each encryption operation produces unique ciphertext, even with the same input data.
- **Data Storage**: The encrypted mnemonic and IV are encoded in base64 and returned as a JSON object.

### 3. Data Decryption
- **Password-based Key Derivation**: The `decryptData` function takes an encrypted mnemonic and password, derives the same AES-GCM key using the same password and salt as the encryption step.
- **Decryption**: The encrypted mnemonic and IV are decoded from base64 and used in the decryption operation with AES-GCM. If the decryption is successful, the original mnemonic is returned.
- **Error Handling**: If decryption fails (e.g., wrong password or corrupted data), an error is thrown, and feedback is provided to the user.

### 4. User Operation Signing (ERC-4337)
- **Private Key Generation**: The `signUserOp` function generates a wallet from the derived private key (from the generated mnemonic).
- **Transaction Details**: A mock user operation is created, which includes details such as the sender’s address, nonce, gas limit, and gas fees. This is a representation of an Ethereum transaction using the ERC-4337 specification, where user operations are signed off-chain and then submitted.
- **Signing**: The wallet’s private key is used to sign the user operation message (serialized as JSON).
- **Result**: The signed user operation is returned and displayed in the UI.

## UI/UX Design

The UI is designed to guide the user through the following steps:

### 1. Mnemonic Generation
- The user selects the length of the mnemonic (12, 15, 18, or 24 words).
- Upon clicking "Generate Deterministic Keys," the mnemonic, Ethereum address, and private key are generated and displayed.

### 2. Encryption and Decryption
#### 2.1 Encryption
- The user enters a password for encryption.
- Upon clicking "Encrypt Mnemonic," the mnemonic is encrypted and displayed in a read-only text area.
- The encrypted mnemonic is encoded in base64 and saved for further use.

#### 2.2. Decryption
- The user can input the password and click "Decrypt Mnemonic" to decrypt the encrypted mnemonic.
- If successful, the decrypted mnemonic is displayed in a read-only text area.
- If decryption fails, an error message is shown.

### 3. Sign User Operation
- The user clicks the "Sign User Operation (ERC-4337)" button, which signs a mock transaction using the private key derived from the mnemonic.
- The signed transaction is displayed in a text area for the user to view or copy.

### 4. Error Handling
- If any action fails (key generation, encryption, decryption, or signing), a red error message is displayed, and the user is notified of the issue.

## Detailed Workflow

### 1. Generate Keys
- The user selects a mnemonic length and clicks "Generate Deterministic Keys."
- The `generateKeys` function is called, which:
  - Generates a mnemonic based on the selected word length.
  - Derives the private key using BIP32 and the mnemonic.
  - Creates an Ethereum address using the derived private key.
- The UI displays the generated mnemonic, address, and private key.

### 2. Encrypt and Decrypt Mnemonic
#### 2.1 Encrypt
- The user enters a password for encryption and clicks "Encrypt".
- The `encryptData` function is called, which:
  - Derives an AES-GCM key from the password using PBKDF2.
  - Encrypts the mnemonic using the AES-GCM encryption scheme with a random IV.
  - Encodes the encrypted mnemonic and IV in base64 and returns them as a JSON object.
- The UI displays the encrypted mnemonic.

#### 2.2. Decrypt 
- The user enters the password and clicks "Decrypt."
- The `decryptData` function is called, which:
  - Derives the AES-GCM key from the entered password.
  - Decrypts the encrypted mnemonic using the derived key and IV.
  - If successful, the decrypted mnemonic is displayed; otherwise, an error message is shown.

### 3. Sign User Operation
- The user clicks "Sign User Operation (ERC-4337)."
- The `signUserOp` function is called, which:
  - Derives the private key from the mnemonic.
  - Creates an Ethereum wallet using the private key.
  - Signs a mock user operation using the wallet's private key.
- The signed user operation is displayed in the UI.

## Error Handling and Feedback

- **Encryption/Decryption Errors**: If the encryption or decryption fails (e.g., invalid password), an error message is shown to the user.
- **Key Generation Errors**: If the key generation fails, the UI will display an error message and prevent further actions.
- **Signing Errors**: If signing the user operation fails (e.g., missing or incorrect mnemonic), an error message will appear.

## Dependencies

- `ethers`: A library used for working with Ethereum and its wallet system, including signing messages and transactions.
- `bip32`: A library that implements BIP32 (Hierarchical Deterministic Wallets) for deriving keys.
- `bip39`: A library that implements BIP39 for mnemonic generation and seed derivation.
- `tiny-secp256k1`: A small library for elliptic curve cryptography used for signing messages and transactions with secp256k1.

## Disadvantage of Telegram

### **1. Storage Limitations on Telegram Mini Apps**

Telegram Mini Apps are designed to be lightweight and integrated directly into the Telegram client. However, they have some limitations when it comes to storing data persistently:

- **LocalStorage**: Data saved using `localStorage` in a Telegram Mini App is stored on the client's browser or app environment. However, this data is **not persistent** when the app is closed, and it gets wiped if the app is restarted or the user switches devices. This behavior is similar to how browser `localStorage` works, making it unsuitable for storing critical or long-term data like private keys or user preferences.

- **Lack of secure storage**: Telegram Mini Apps do not offer built-in encryption or secure storage mechanisms like other platforms (e.g., iOS Keychain or Android Keystore). Sensitive information such as private keys should be stored securely, but currently, there are no built-in solutions for securely storing such information in Telegram Mini Apps.

### **2. Alternative Solutions for Consistent Storage**

Given the limitations of Telegram’s storage mechanisms, here are some potential alternatives to achieve consistency and persistent storage in Telegram Mini Apps:

#### **a. Use Server-Side Storage (Encrypted Backup)**
One of the most reliable methods for persistent storage is to store sensitive data like private keys or user preferences on your own secure server. Here's how you can achieve this:
1. **Encryption**: Always encrypt sensitive data before sending it to the server. Use algorithms like AES to encrypt the data.
2. **Server Storage**: Once encrypted, store the data on your backend. Ensure that your server is protected by secure protocols (e.g., HTTPS, token-based authentication).
3. **Retrieve Data**: When the user reopens the Mini App, fetch the encrypted data from your server and decrypt it on the client-side.

#### **b. Using Telegram Web Apps Cloud Storage**

For Telegram Web Apps, the `cloudStorage` object can be used to store small key-value pairs persistently. This method is simple, does not require an external database, and ties the data directly to the user's Telegram account. However, **it has limited capacity**, making it suitable for lightweight use cases.

For further details, check out the [Telegram Web Apps Cloud Storage Documentation](https://core.telegram.org/bots/webapps#cloudstorage).
