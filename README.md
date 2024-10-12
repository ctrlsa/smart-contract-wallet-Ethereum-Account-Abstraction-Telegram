## Project overview
R&D of solutions for EVM developers to simplify building at the intersection of: 
- [Ethereum](https://ethereum.org/en/) 
- [Account Abstraction](https://eips.ethereum.org/EIPS/eip-4337#abstract) 
- EVM self-custodial / smart-contract wallets 
- [Telegram](https://telegram.org/) platform

## Research objectives
1. Explore possibilities & limitations of [Telegram API](https://core.telegram.org/) & [Telegram Mini Apps](https://core.telegram.org/bots/webapps) for integrating EVM wallets 
2. Research how private key can be stored for wallets integrated in Telegram 
3. Investigate secure transaction signing using keys managed within Telegram 
4. Integrate [Account Abstraction (ERC-4337)](https://eips.ethereum.org/EIPS/eip-4337#abstract) into [Telegram Mini Apps](https://core.telegram.org/bots/webapps)
5. R&D how various self-custodial wallet solutions existing in the market (Ex.: MPC, PassKey, Deterministic keys, etc.) can be integrated in Telegram
6. Research how ZK solutions can be used with [Telegram Mini Apps](https://core.telegram.org/bots/webapps)
7. Build prototypes

## How to contribute 
- Select an [existing Issue](https://github.com/ctrlsa/smart-contract-wallet-Ethereum-Account-Abstraction-Telegram/issues) in this repo or create a new relevant Issue 
- Clone this repo to your local machine 
- Create a new branch locally named as your Issue. Ex.: "feature-web3auth"
- Work on your Issue locally 
- If makes sense for your Issue: 
    - Make commits with working code. To demonstrate: what was explored / validated, results achieved, etc.
    - Build the simplest possible [Telegram Mini App](https://core.telegram.org/bots/webapps) prototype 
        - Should be deployed & working online as a separate app 
        - [This template](https://github.com/ctrlsa/smart-contract-wallet-Ethereum-Account-Abstraction-Telegram) may be used to generate [Telegram Mini Apps](https://core.telegram.org/bots/webapps) & easily publish on GitHub Pages 
    - Create unit-tests 
    - {documentation} Text down briefly: takeaways, comments, tutorial / guideline, etc.
- Push your local branch with commits to this GitHub repo
- Then - make a pull request to Main branch on GitHub
