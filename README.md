## Project overview
R&D of solutions at the intersection of: 
- [Ethereum](https://ethereum.org/en/) 
- [Telegram](https://telegram.org/) platform
- EVM self-custodial / smart-contract wallets 
- [Account Abstraction](https://eips.ethereum.org/EIPS/eip-4337#abstract) 

## How to contribute 
- In [original "Team" repo](https://github.com/ctrlsa/smart-contract-wallet-Ethereum-Account-Abstraction-Telegram): select an [existing Issue](https://github.com/ctrlsa/smart-contract-wallet-Ethereum-Account-Abstraction-Telegram/issues) or create a new Issue 
- Assign Issue to yourself. For new Issues - add label & clear title 
- Write in description of the Issue: 
    - Your estimated date of delivery (deadline)
    - How your delivered outcome will look like (Ex.: Code. Diagram. Spreadsheet. Text bullets)
- Fork [original "Team" repo](https://github.com/ctrlsa/smart-contract-wallet-Ethereum-Account-Abstraction-Telegram) to your personal GitHub 
- Clone your personal GitHub fork repo to local machine 
- Add [original "Team" repo](https://github.com/ctrlsa/smart-contract-wallet-Ethereum-Account-Abstraction-Telegram) as upstream remote: <br> `git remote add upstream https://github.com/ctrlsa/smart-contract-wallet-Ethereum-Account-Abstraction-Telegram`
- Sync regularly with upstream remote repo: <br>`git fetch upstream` <br>`git merge upstream/main`
- Create a new branch locally named as your Issue: <br>`git checkout -b feature/<issue_number>-<branch_name>`

- Work on your Issue locally. Make regular commits
- Push local changes to your personal GitHub fork: <br>`git push origin feature/<issue_number>-<branch_name>`
 
- {on GitHub} Pull request from your personal fork to [original "Team" repo](https://github.com/ctrlsa/smart-contract-wallet-Ethereum-Account-Abstraction-Telegram). Reference your GitHub Issue in the pull request description 
- If makes sense for your Issue: 
    - Build the simplest possible [Telegram Mini App](https://core.telegram.org/bots/webapps) prototype 
        - Should be deployed & working online as a separate app 
        - [This template](https://github.com/ctrlsa/smart-contract-wallet-Ethereum-Account-Abstraction-Telegram) may be used to generate [Telegram Mini Apps](https://core.telegram.org/bots/webapps) & easily publish on GitHub Pages 
    - Create unit-tests 
    - {documentation} Text down briefly: takeaways, comments, tutorial / guideline, etc.

## Project objectives
1. Explore possibilities & limitations of [Telegram API](https://core.telegram.org/) & [Telegram Mini Apps](https://core.telegram.org/bots/webapps) for integrating EVM wallets 
2. Research how private key can be stored for wallets integrated in Telegram 
3. Investigate secure transaction signing using keys managed within Telegram 
4. Integrate [Account Abstraction (ERC-4337)](https://eips.ethereum.org/EIPS/eip-4337#abstract) into [Telegram Mini Apps](https://core.telegram.org/bots/webapps)
5. R&D how various self-custodial wallet solutions existing in the market (Ex.: MPC, PassKey, Deterministic keys, etc.) can be integrated in Telegram
6. Research how ZK solutions can be used with [Telegram Mini Apps](https://core.telegram.org/bots/webapps)
7. Build prototypes

