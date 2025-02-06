# Overview of R&D results
## Experiments to integrate various wallet solutions in [Telegram Mini App](https://core.telegram.org/bots/webapps)
*{UPDATE} The table below will be modified after recent major changes in “Terms of Services” made by Telegram Team:*
- *https://telegram.org/tos/bot-developers#7-blockchain-integration*
- *https://core.telegram.org/bots/blockchain-guidelines*


| Directory with code| ReadMe location | Deployed TG bot/app | Description | Security Level | Self-custodial | Pluses | Minuses | Comments, details, links | 
|----------------|----------------|----------------|-------------|-------------|-------------|-------------|-------------|-------------|
| [telegram-deterministic-keys-wallet-test](/telegram-deterministic-keys-wallet-test) | [README.md](/telegram-deterministic-keys-wallet-test/README.md) | [Prototype](https://t.me/LionetCriticalDevBot/TelegramDeterministicKeys) | Deterministic keys wallet | Medium | Depends on implementation | Easy to implement, key encryption inclueded in project | Needs to implement storage for keys, local storage or cloud storage | Check [README.md](/telegram-deterministic-keys-wallet-test/README.md) | 
| [telegram-mpc-test](https://github.com/zarej/telegram-mpc-test/tree/13b525a5b75543da506df3f492473f8e71b8a9a3) | [README.md](https://github.com/zarej/telegram-mpc-test/blob/13b525a5b75543da506df3f492473f8e71b8a9a3/README.md) | [Prototype](https://t.me/TgAaMPCtestBot) | MPC (Multi-Party Computation) | High | Yes | High security (no single device has full key). Loss of one device doesn't compromise the key | Complex implementation. Requires multiple devices & online access for operations | [More details](/docs/mpc-details.md) |
| [telegram-privy-embed-wallet-test](/telegram-privy-embed-wallet-test) | [README.md](/telegram-privy-embed-wallet-test/README.md) | [Prototype](https://t.me/zarejtgaatest_bot) | [Privy](https://docs.privy.io/guide/security/#embedded-wallets) embedded wallet | Medium | Yes | Very easy integration with React, uses wagmi and viem. Also supports ethers. Possibility to user store part of the key on his cloud storage | [Paid service](https://www.privy.io/pricing) | Embedded wallet's private key is only ever stored in-memory within the isolated iframe. The full private key is only ever assembled in-memory, and is never persisted anywhere. Using Shamir's secret sharing key is splitted on 3 parts. At least two of three shares must be present to constitute the full private key. 2 keys could be managed by the user and 3rd one is at Privy server. [More details](https://docs.privy.io/guide/security/#embedded-wallets) |
| [telegram-moralis-wallet-test](/telegram-moralis-wallet-test) | [README.md](/telegram-moralis-wallet-test/app/README.md) | [Prototype](http://t.me/MoralisDemoBot/MoralisDemoApp) | [Moralis](https://moralis.io/api/wallet/) wallet | High | Provides Web3 Data APIs // {?} | Secure | Client-side of Moralis SDK is not allowed |  | 
| [telegram-web3auth-wallet-test](/telegram-web3auth-wallet-test) | [README.md](/telegram-web3auth-wallet-test/README.md) | [Prototype](https://t.me/Web3AuthDemoBot/Web3AuthDemoApplication) | [Web3Auth](https://web3auth.io/) wallet | Medium | No | Easy implementation with excellent plug and play features. Custodial management available through social logins like Google, Apple, Discord while non-custodial wallets such as MetaMask can be added through external adapters. Offers a wagmi connector as well. | Difficult to connect with mobile app wallets like Metamask in Telegram Mobile. Need to find a workaround to make it connect with app wallets ||
| [telegram-zerodev-test](/telegram-zerodev-test) | [README.md](/telegram-zerodev-test/README.md) | [Prototype](https://t.me/zarejtgaazdpkbot) | [ZeroDev](https://zerodev.app/) | Medium | Depends on implementtion. It can use some 3rd party service as embedded wallet like Privy. You can implement your logic for storing keys or it can be custodial on their paid key storage. [More info](https://docs.zerodev.app/sdk/advanced/key-storage) |Easy implementation, good documentation. Various validators that can be used. Adjustable smart wallet with plugins.|Passkey is not working with telegram mini apps. [Paid service](https://zerodev.app/)|ZeroDev works with major AA infra providers to provide a "meta intrastructure." Traffic can be routed to a different bundler when one goes down. Supported: Alchemy, Gelato, Pimlico, StackUp. ZeroDev is built on Kernel, a modular smart account that can be customized with plugins. The most used smart account contract. Validators: ECDSA validator, which works like a normal EOA by validating signatures from a ECDSA private key
| {passkey} [telegram-joyid-miniapp-test](https://github.com/JJOptimist/joyid-tg-test/blob/523e1444fdf262952f73e49f8184623ed71fbeab/README.md) | [README.md](https://github.com/JJOptimist/joyid-tg-test/blob/523e1444fdf262952f73e49f8184623ed71fbeab/README.md) | [Prototype](https://t.me/joyidtest_bot) | [JoyID](https://joy.id/) passkey wallet integrated in Telegram Mini App | Medium | Yes | | Requires Chrome on Desktop with connected Google account first time to create passkey. Not working on mobile. | [More details on passkey](/docs/passkeys.md) |
| [telegram-invisible-wallet](/telegram-invisible-wallet) | [README.md](/telegram-invisible-wallet/README.md) | | "Invisible" wallets. TG Authentication. ZK in TG | | | | | [Takeaways, solutions, docs, links](/telegram-invisible-wallet/) |
| Local Storage | | | Encrypted private key is stored directly in local storage of end-user's device via Telegram Mini App | Medium | Yes | Fast access. Works offline | Works across devices only if importing the same wallet manually to every device | |
| [metamask-tg-wallet](/metamask-tg-wallet) | [README.md](/metamask-tg-wallet/README.md) | {in progress} | MetaMask | | | | | {in progress} |
| [rabby-wallet](/rabby-wallet) | [README.md](/rabby-wallet/README.md) | {in progress} | Rabby | | | | | {in progress} |
| Coinbase // {?}PR44 | {in progress} | {in progress} | Coinbase| | | | | {in progress} |
| Tomo | {in progress} | {in progress} | Tomo | | | | | {in progress} |
| ... | ... | ... | ... |
| [telegram-circle-usdc-test](/telegram-circle-usdc-test) | [README.md](/telegram-circle-usdc-test/README.md) | [Prototype](https://t.me/CircleDevTestBot/CircleTestApp) | Circle's Programmable Wallets | High | No | Secure, compliant MPC system which is scalable and easy integration once base functionality has been setup.| Custodial, cost structure - transaction fee + network fee

// Please, check ["How to contribute"](/README.md) to publish additional solutions to this table or to inform about bugs/updates

Clone with all submodules:
```bash
git clone git@github.com:ctrlsa/smart-contract-wallet-Ethereum-Account-Abstraction-Telegram.git --recurse-submodules
```

## Instructions for projects built with [Telegram Mini Apps React.js Template](https://github.com/Telegram-Mini-Apps/reactjs-template)

Includes the following projects:
- [telegram-deterministic-keys-wallet-test](/telegram-deterministic-keys-wallet-test)
- [telegram-moralis-wallet-test](/telegram-moralis-wallet-test)
- [telegram-web3auth-wallet-test](/telegram-web3auth-wallet-test)
- [telegram-privy-embed-wallet-test](/telegram-privy-embed-wallet-test)
- [telegram-zerodev-test](/telegram-zerodev-test)
- [telegram-mpc-test](/telegram-mpc-test)

1. Create new project on Github and copy content of the one of the above projects directory
2. Create telegram mini app by following [this guide](https://docs.telegram-mini-apps.com/platform/creating-new-app)
3. The easist way for deploying telegram mini app is to use Github Pages. For deployment on Github Pages, you need to follow [instructions](https://github.com/Telegram-Mini-Apps/reactjs-template?tab=readme-ov-file#manual-deployment)

## R&D [results](/telegram-invisible-wallet/) about 
- OAuth (OIDC) vs Telegram Authentication (HMAC256) 
- "Invisible" wallets in Telegram 
- Applying ZKP in Telegram 
- Applying FHE in Telegram 
- Possibilities to authorize txns on-chain while not revealing Telegram account/ID

## Other results
- [joyid-nextjs-app-demo](/joyid-nextjs-app-demo) (passkey ) // NextJS [JoyID](https://joy.id/) App (not Telegram Mini App) // [More details on passkey](/docs/passkeys.md) 
- [telegram-webapp-api-test](/telegram-webapp-api-test) // [Prototype](https://t.me/thisismyrandombotmPfKoqm2Bot/walletTestApp) 

