# Circle Web3 Services Wallet Integration

A Next.js application demonstrating integration with Circle's Web3 Services (W3S) for creating and managing Ethereum wallets on the Sepolia testnet. This application showcases user management, PIN-based security, wallet creation, and token transfers using Circle's Web3 Services SDK.

## Circle Solutions Used

- [Circle Web3 Services (W3S)](https://www.circle.com/en/web3-services) - Core infrastructure for wallet and transaction management
- [Circle Programmable Wallets](https://www.circle.com/en/programmable-wallets) - Smart contract wallet infrastructure
- [USDC on Sepolia](https://www.circle.com/en/usdc) - Circle's stablecoin for testing transfers

## Features

- **User Management**

  - Create new users with secure encryption
  - Persistent user sessions
  - PIN-based security setup

- **Wallet Management**

  - Create Ethereum wallets on Sepolia testnet
  - View wallet details and addresses
  - Real-time balance checking for ETH and USDC
  - Transfer tokens (ETH and USDC)

- **Security**
  - PIN-based challenge-response system
  - Secure token management
  - Encryption key handling

## Prerequisites

- Node.js 16.x or higher
- [Circle Web3 Services Account](https://console.circle.com/)
- Circle API Key
- Circle App ID

## Technology Stack

### Core Technologies
- [NextJs Template for TG MiniApps](https://github.com/Telegram-Mini-Apps/nextjs-template)
- [Circle Web3 Services SDK](https://developers.circle.com/w3s/docs/circle-web3-services-sdk) - Web SDK for wallet operations
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Axios](https://axios-http.com/) - HTTP client

### Telegram Integration

- [Telegram Mini Apps](https://core.telegram.org/bots/webapps) - Platform for building web apps inside Telegram
- [Telegram Bot API](https://core.telegram.org/bots/api) - API for Telegram bot functionality
- [@twa-dev/sdk](https://www.npmjs.com/package/@twa-dev/sdk) - SDK for Telegram Web Apps development
- [Telegram JavaScript SDK](https://core.telegram.org/bots/webapps#initializing-mini-apps) - Official SDK for Mini Apps

## Usage

1. **User Creation**

   - Click "Create User Account" to create a new user
   - The user ID will be stored locally for future sessions

2. **PIN Setup**

   - After user creation, you'll be prompted to set up a PIN
   - Follow the Circle Web SDK prompts to complete PIN setup

3. **Wallet Creation**

   - Once PIN is set up, create a new wallet
   - The wallet will be created on the Sepolia testnet

4. **Managing Wallets**
   - View wallet details including address and balances
   - Refresh balances manually
   - Transfer tokens to other addresses
   - Support for both native ETH and USDC tokens

## API Endpoints

- `/api/users/create` - Create new user
- `/api/users/token` - Get user token
- `/api/users/status` - Check PIN status
- `/api/users/pin/challenge` - Create PIN challenge
- `/api/wallet/create` - Create new wallet
- `/api/wallet/list` - List user's wallets
- `/api/wallet/balances` - Get wallet balances
- `/api/wallet/transfer` - Transfer tokens

## Security Considerations

- User tokens and encryption keys are handled securely
- PIN challenges use Circle's secure challenge-response system
- All sensitive data is transmitted over HTTPS
- No sensitive data is stored in local storage except user ID

## Development

- The application uses Next.js App Router
- API routes are implemented using Next.js API routes
- Styling is done using Tailwind CSS
- State management uses React hooks

## Error Handling

- Comprehensive error handling for API calls
- User-friendly error messages
- Automatic retry for challenge execution
- Proper loading states for all operations

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT License
