# Key Management Approaches for Telegram Account Abstraction Wallet

To ensure the security and usability of the Telegram Account Abstraction Wallet, it is crucial to choose the right key management approach. This document compares several potential methods for generating and storing private keys within the Telegram mini app environment.

## Comparison Table

| Approach                      | Custodial | Cross-Device Access | Security                                              | Backup Method                |
|-------------------------------|-----------|---------------------|-------------------------------------------------------|-----------------------------|
| 1. User-provided key          | No        | No                  | Depends on user's key generation and storage          | User's responsibility       |
| 2. Telegram Passport          | Yes       | Yes                 | Relies on Telegram's security measures                | Telegram Passport           |
| 3. Threshold Signatures (TSS) | No        | Limited             | High, as key is split and never fully reconstructed   | Recovery user stores share  |
| 4. Browser-based generation   | No        | Yes, with import    | Depends on browser security and password strength     | User exports encrypted key  |

## Approach Details

1. **User-provided private key**
  - User generates a private key outside of Telegram and inputs it into the wallet mini app
  - Key is encrypted and stored securely on the user's device
  - Backup is the user's responsibility

2. **Telegram Passport**
  - Utilize Telegram Passport to securely store the private key
  - Key is encrypted with a password and stored in Telegram's secure cloud storage
  - User can access the wallet from any Telegram-connected device
  - Backup is handled by Telegram Passport

3. **Threshold Signature Scheme (TSS)**
  - Private key is split into shares, with one share stored on the user's device and another share held by a recovery Telegram user
  - Both shares are needed to reconstruct the key and sign transactions
  - Backup involves the recovery user securely storing their key share

4. **Browser-based key generation with encrypted localstorage**
  - Mini app generates a private key in the user's browser and encrypts it with a user-provided password
  - Encrypted key is stored in the browser's localstorage
  - User can export the encrypted key for backup purposes and import it into another device's browser storage

## Recommendations

Based on the comparison, the Threshold Signature Scheme (TSS) approach offers the best balance of security, non-custodial control, and limited cross-device access. However, the final decision should be made based on the specific requirements and priorities of the Telegram Account Abstraction Wallet project.

Further research and proof-of-concept implementations should be conducted to validate the feasibility and user experience of the chosen key management approach.