### About prototype 
- Telegram Mini App prototype: https://t.me/TgAaMPCtestBot   
- This is demo of MPC using Pier Wallet: https://www.pierwallet.com/ 
- There are problems with demo Miini App on Telegram Desktop on Linux: it can not pass generating keys (Telegram crashes when enabling Dev Tools to debug)
- With Android this step was passed, but sending Ether did not work

### Useful links
- https://github.com/mpc-sdk/framework  in combination with
https://github.com/mpc-sdk/multi-factor-accounts 

- https://github.com/coinfabrik/mpc-manager in combination with 
https://github.com/CoinFabrik/wasm-multi-party-ecdsa 

- https://docs.pierwallet.com/ 

### General comments
- Private key is split into shares distributed across user's devices (Ex.: smartphone, tablet, desktop)
- Centralized server facilitates communication between devices but does {?}not hold any key shares. 
- Cryptographic protocols are used to perform operations with the key without revealing the shares. 

### MPC Implementation in Telegram Mini Apps
- Each of the user's devices runs the Telegram mini app, holding a share of the private key.
- A centralized server acts as a communication facilitator.
- When a transaction needs to be signed:
  1. The initiating device starts an MPC protocol session.
  2. It communicates with other devices through the centralized server.
  3. The devices engage in a series of cryptographic exchanges to jointly compute the signature without reconstructing the full key.
- The centralized server routes messages between devices but cannot access the key shares or the final signature.
- This approach requires implementing MPC protocols in JavaScript for the mini app on each device.
- It also needs a secure communication channel between devices, which the centralized server facilitates.