# What is Passkey

- Passkey is a passwordless login, which is a password replacement that’s more secure and easier to use.
- It utilizes cryptographic techniques to offer a safer and more user-friendly login experience.
- Instead of having to create a password for your account, you enable an “authenticator” to generate a passkey. The authenticator can be your smartphone, another device, or a password manager that supports passkeys.
- The authenticator still requires some form of user verification. This could be through entering a password or PIN or using biometrics (such as Face ID or Touch ID), which adds both security and convenience.

# How it works

- Key Pair Creation: When you create a passkey, your device generates a pair of cryptographic keys:
  - A public key, which is shared with the website or service you're logging into.
  - A private key, which is stored securely on your device and never shared.
- Authentication: When you log in, the service challenges your device to prove it has the private key associated with your public key. Your device uses the private key to create a cryptographic signature, which the service verifies using the public key.
- Device-Based Security: The private key is stored on your device and is protected by your device’s security measures, like biometrics (fingerprint, facial recognition) or a PIN.

# Passkey vs Password authentication

- Passkeys, unlike passwords, don’t need to be remembered each time you want to access your account (which can lead to password fatigue).
- Passwords are a shared secret: The value is sent over the network to the server to be evaluated, meaning the server needs to store information about the password that could be valuable to an attacker.
- Passkeys, on the other hand, are based on public key cryptography, which ensures that the secret element of the credential isn’t shared with the website and that no secrets are transferred between the user’s device and the server.
- Passkeys are better than passwords because passkeys can't be phished or stolen.

# Technical Characteristics

- Passkeys are created using the WebAuthn API that’s widely implemented in all modern browsers and operating systems
- Passkeys can be either device-bound or synced between devices. Device-bound passkeys are typically ones that are created on a hardware key, such as a YubiKey or a Titan Security Key, while synced passkeys are typically managed by a password manager (e,g, mobile phone software

# Passkey auth demo on a Telegram Miniapp

This is a telegram mini app wallet demo that uses Passkey authentication  
Mini app demo: https://t.me/JoyIDBot  
Repo: https://github.com/nervina-labs/joyid-mini-app-demo?tab=readme-ov-file

# Development

The FIDO Alliance has been working on passwordless authentication standards for some time. The most important development, however, came somewhat recently when the technology consortium announced it had proposed a method to store cryptographic keys so they can sync between devices. (In fact, FIDO calls passkeys multi-device FIDO credentials.) This paves the way for the wider adoption of passkeys that we’re already beginning to see.

Will passkeys replace passwords?
In short, yes—eventually. Passkeys are simply a better option, and we’ve already seen more widespread adoption and advancements in the last six months.
