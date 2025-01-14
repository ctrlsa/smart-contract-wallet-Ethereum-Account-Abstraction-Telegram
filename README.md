## Project overview
R&D of solutions at the intersection of: 
- [Ethereum](https://ethereum.org/en/) 
- [Telegram](https://telegram.org/) platform
- EVM self-custodial / smart-contract wallets 
- [Account Abstraction](https://eips.ethereum.org/EIPS/eip-4337#abstract) 

## "How to contribute" process 
- In [original "Team" repo](https://github.com/ctrlsa/smart-contract-wallet-Ethereum-Account-Abstraction-Telegram): select an [existing Issue](https://github.com/ctrlsa/smart-contract-wallet-Ethereum-Account-Abstraction-Telegram/issues) or create a new relevant Issue 
- Assign Issue to yourself. For new Issues - add label & clear text title 
- Write in description of the Issue: 
    - Your estimated date of delivery (deadline)
    - How your expected output will look like (Ex.: Code. Diagram. Spreadsheet. Text bullets)
- Fork [original "Team" repo](https://github.com/ctrlsa/smart-contract-wallet-Ethereum-Account-Abstraction-Telegram) to your personal GitHub. Clone forked repo to local machine 
- Add [original "Team" repo](https://github.com/ctrlsa/smart-contract-wallet-Ethereum-Account-Abstraction-Telegram) as upstream remote: <br> `git remote add upstream https://github.com/ctrlsa/smart-contract-wallet-Ethereum-Account-Abstraction-Telegram`
- Sync regularly local repo with upstream remote repo: <br>`git fetch upstream` <br>`git merge upstream/main`
- Create a new branch locally named as your Issue: <br>`git checkout -b feature/<issue_number>/<issue_name>`
- Work on your Issue locally. Push local branch with updates to your personal GitHub fork: <br>`git push origin feature/<issue_number>/<issue_name>`
- {on GitHub} Pull request the branch from your personal fork to Main branch in [original "Team" repo](https://github.com/ctrlsa/smart-contract-wallet-Ethereum-Account-Abstraction-Telegram). Reference your GitHub Issue in the pull request description 
- Reviewer will check your pull request. If accepted, it will be merged to Main branch in [original "Team" repo](https://github.com/ctrlsa/smart-contract-wallet-Ethereum-Account-Abstraction-Telegram)

## Tasks to-do about selected Issue 
- Do R&D about your Issue at intersection with [Ethereum](https://ethereum.org/en/) & [Telegram](https://telegram.org/)
- {if makes sense} Build the simplest possible [Telegram Mini App](https://core.telegram.org/bots/webapps) prototype 
    - Should be deployed & working online as a separate app 
    - [This template](https://github.com/Telegram-Mini-Apps/reactjs-template) may be used to generate [Telegram Mini Apps](https://core.telegram.org/bots/webapps) 
    - May be published on: [GitHub Pages](https://pages.github.com/), [Vercel](https://vercel.com/), your own server, etc. 
- {if makes sense} Create unit-tests 
- {documentation} Text down briefly: takeaways, comments, links, tutorial / guideline, etc.

## Project objectives 
1. Explore possibilities & limitations of [Telegram API](https://core.telegram.org/) & [Telegram Mini Apps](https://core.telegram.org/bots/webapps) for integrating EVM wallets 
2. Research how private key can be stored for wallets integrated in Telegram 
3. Investigate secure transaction signing using keys managed within Telegram 
4. Integrate [Account Abstraction (ERC-4337)](https://eips.ethereum.org/EIPS/eip-4337#abstract) into [Telegram Mini Apps](https://core.telegram.org/bots/webapps)
5. R&D how various self-custodial wallet solutions existing in the market (Ex.: MPC, PassKey, Deterministic keys, etc.) can be integrated in Telegram
6. Research how ZK solutions can be used with [Telegram Mini Apps](https://core.telegram.org/bots/webapps)
7. Build prototypes

## [Overview of R&D results](https://github.com/ctrlsa/smart-contract-wallet-Ethereum-Account-Abstraction-Telegram/blob/main/docs/overview.md) 
