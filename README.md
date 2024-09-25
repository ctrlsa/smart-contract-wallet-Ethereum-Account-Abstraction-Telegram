# Telegram Account Abstraction Wallet

## Project Overview

The Telegram Account Abstraction Wallet is an Ethereum Foundation grant-funded project that aims to create a wallet as a Telegram mini app, leveraging ERC-4337 account abstraction. 
The main purpose of this project is to understand how to control account abstraction by telegram account.

Features which can be considered as meaning what control means:
1. Access to wallet from any device.
2. Send tokens to Telegram handle.
3. Set up another Telegram handle as a recovery method.
4. Storing backup by using Telegram cloud storage.

## Research Objectives

1. Explore Telegram API capabilities and limitations for wallet mini app development
2. Investigate secure transaction signing using keys managed within Telegram
3. Integrate ERC-4337 account abstraction into the Telegram mini app
4. Research key management approaches (e.g., user-provided keys, Telegram Passport, threshold signatures)
5. Design an intuitive and user-friendly wallet UI/UX

## Repository Structure

- `docs/`: Research notes, tutorials, and guidelines
- `contracts/`: ERC-4337 account abstraction contracts and tests
- `webapp/`: Telegram wallet mini app front-end
- `telegram-bot/`: Telegram bot for handling user interactions

## How to contribute 

1. Draft GSheet Table with R&D tasks: 
https://docs.google.com/spreadsheets/d/16J8TZ3M70UWyv7f6_CMeSuFqLS-F1TtUG1oz1ZiXjD0/edit?gid=0#gid=0  
2. Some tasks may be combined, new ones may be added. Will update gradually. 
3. {in the GSheet Table} For tasks you are interested in - please, put your name in “Contributor in charge” cell; approximate dates - in “Start date” & “Delivery date” cells.
4. GitHub workflow: 
- Create a new Issue in our repo
- Create a new branch
- Develop mini-prototype at the intersection of your R&D task, https://core.telegram.org/api and https://core.telegram.org/bots/webapps
- Push commits to our GitHub. // Smaller commits with higher frequency are preferable
- Then - make a pull request
5. {FYI} General GDoc about our grant project with Roadmap, specs, notes & drafts: 
https://docs.google.com/document/d/1AoTBhr-YAW8MyuQ998OUm2pG-O0lEe61JGtrFPlPp-4/edit#heading=h.u9xffrnnqbh8

For more information, check out the detailed documentation in the `docs/` directory.
