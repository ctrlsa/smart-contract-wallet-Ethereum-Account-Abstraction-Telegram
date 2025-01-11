# Overview
## Experiments to integrate various wallet solutions in [Telegram Mini App](https://core.telegram.org/bots/webapps)
| Directory with code| ReadMe location | Deployed TG bot/app | {?}Description | Security Level | Self-custodial | Pluses | Minuses | {?}Comments, details, links | 
|----------------|----------------|----------------|-------------|-------------|-------------|-------------|-------------|-------------|
| [telegram-deterministic-keys-wallet-test](/telegram-deterministic-keys-wallet-test) | [README.md](/telegram-deterministic-keys-wallet-test/README.md) | [Prototype](https://t.me/LionetCriticalDevBot/TelegramDeterministicKeys) | Deterministic keys wallet | {?} | {?} | {?} | {?} | [Takeaways](/telegram-deterministic-keys-wallet-test/README.md) // {!}duplicating ReadMe link | 
| [telegram-joyid-miniapp-test](https://github.com/JJOptimist/joyid-tg-test/blob/523e1444fdf262952f73e49f8184623ed71fbeab/README.md) | [README.md](/telegram-joyid-miniapp-test/README.md) | [Prototype](https://t.me/joyidtest_bot) | [JoyID](https://joy.id/) passkey wallet integrated in Telegram Mini App | {?} | {?} | {?} | {?} | [Takeaways](https://github.com/JJOptimist/joyid-tg-test) // {!}duplicating ReadMe link |
| [telegram-moralis-wallet-test](/telegram-moralis-wallet-test) | [README.md](/telegram-moralis-wallet-test/README.md) | [Prototype](http://t.me/MoralisDemoBot/MoralisDemoApp) | [Moralis](https://moralis.io/api/wallet/) wallet | High | {?}Provides Web3 Data APIs | Secure | Client-side of Moralis SDK is not allowed | {?} | 
| [telegram-mpc-test](https://github.com/zarej/telegram-mpc-test/tree/13b525a5b75543da506df3f492473f8e71b8a9a3) | [README.md](https://github.com/zarej/telegram-mpc-test/blob/13b525a5b75543da506df3f492473f8e71b8a9a3/README.md) | [Prototype](https://t.me/TgAaMPCtestBot) | MPC (Multi-Party Computation) | High | Yes | High security (no single device has full key). Loss of one device doesn't compromise the key | Complex implementation. Requires multiple devices & online access for operations | [More details](/docs/mpc-details.md) |
| [telegram-privy-embed-wallet-test](/telegram-privy-embed-wallet-test) | [README.md](/telegram-privy-embed-wallet-test/README.md) | [Prototype](https://t.me/zarejtgaatest_bot) | Privy embedded wallet |
| [telegram-web3auth-wallet-test](/telegram-web3auth-wallet-test) | [README.md](/telegram-web3auth-wallet-test/README.md) | [Prototype](https://t.me/Web3AuthDemoBot/Web3AuthDemoApplication) | Web3Auth wallet |
| [telegram-webapp-api-test](/telegram-webapp-api-test) | [README.md](/telegram-webapp-api-test/README.md) | [Prototype](https://t.me/thisismyrandombotmPfKoqm2Bot/walletTestApp) | Various ways to store data in Telegram WebApp |
| [telegram-zerodev-test](/telegram-zerodev-test) | [README.md](/telegram-zerodev-test/README.md) | [Prototype](https://t.me/zarejtgaazdpkbot) | ZeroDev |
| [metamask-tg-wallet](/metamask-tg-wallet) | [README.md](/metamask-tg-wallet/README.md) | [? Prototype](?link?) | MetaMask |
| [rabby-wallet](/rabby-wallet) | [README.md](/rabby-wallet/README.md) | [? Prototype](?link?) | Rabby |
| [telegram-invisible-wallet](/telegram-invisible-wallet) | [README.md](/telegram-invisible-wallet/README.md) | - | Invisible Wallets. TG Authentication. ZK in TG |
| Local Storage | {?} | {?} | Encrypted private key is stored directly in local storage of end-user's device via Telegram Mini App | Medium | Yes | Fast access. Works offline | Works across devices only if importing the same wallet manually to every device | {?} |
| [{?}joyid-tg-miniapp-demo](/joyid-tg-miniapp-demo) | [README.md](/joyid-tg-miniapp-demo/README.md) | - | {?} JoyID App (NextJS, not telegram miniapp) |
| [{?}passkeys](?link?) | [passkeys.md](/docs/passkeys.md) | - | {?} |
| [{?}Coinbase](?link?) // {?}PR44 | [? README.md](?link?) | {?} Prototype | {?} |
| [{?}Tomo](?link?) | [? README.md](?link?) | {?} Prototype | {?} |
| ... | ... | ... | ... |

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
2. Create telegram mini app by following [this guide](https://docs.telegram-mini-apps.com/platform/creating-new-app).
3. The easist way for deploying telegram mini app is to use Github Pages. For deployment on Github Pages, you need to follow [instructions](https://github.com/Telegram-Mini-Apps/reactjs-template?tab=readme-ov-file#manual-deployment).

## R&D [outcomes](/telegram-invisible-wallet/) about: 
- OAuth (OIDC) vs Telegram Authentication (HMAC256) 
- "Invisible" wallets in Telegram 
- Using [Zero-Knowledge Proofs](https://en.wikipedia.org/wiki/Zero-knowledge_proof) in Telegram 

## {?}Other projects
- [telegram-joyid-miniapp-test](/telegram-joyid-miniapp-test)
- [telegram-webapp-api-test](/telegram-webapp-api-test)

Check README.md inside each project for more details

## {?} Additional information
