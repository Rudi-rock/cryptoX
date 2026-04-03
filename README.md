# CryptoSolve

A modern cryptocurrency management platform built with React, Vite, and Tailwind CSS.

## Features

- 💼 **Portfolio Management** - Track your cryptocurrency holdings
- 🔐 **Security** - Two-factor authentication and address whitelisting
- 💳 **Multiple Wallets** - Support for various cryptocurrencies
- 📊 **Transaction History** - Detailed transaction tracking
- 👤 **User Management** - Profile and settings management
- 🎯 **Price Alerts** - Set alerts for cryptocurrency price changes
- 💰 **Bank Integration** - Connect bank accounts for deposits/withdrawals

## Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Package Manager**: npm

## Project Structure

```
src/
├── api/              # API endpoints and calls
├── components/       # Reusable React components
├── entities/         # Data entity classes
├── hooks/            # Custom React hooks
├── lib/              # Utilities and context
├── pages/            # Page components
├── utils/            # Helper functions
├── App.jsx           # Main app component
├── Layout.jsx        # Layout wrapper
├── main.jsx          # Entry point
└── index.css         # Global styles
```

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will open at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Environment Variables

Create a `.env.local` file in the root directory:

```
VITE_API_BASE_URL=http://localhost:3000/api
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## Components

### UI Components
- **Button** - Customizable button with multiple variants
- **Card** - Container component
- **Input** - Form input with validation
- **Modal** - Dialog component
- **Alert** - Notification component
- **Badge** - Status indicator
- **Table** - Data table component
- **Header** - Page header
- **LoadingSpinner** - Loading indicator

### Pages
- **Dashboard** - Portfolio overview
- **Wallets** - Wallet management
- **Transactions** - Transaction history
- **Profile** - User profile
- **Settings** - Security and preferences
- **Login** - Authentication
- **Signup** - Account creation

## API Integration

The app uses a custom API client for all backend communication. Configure the API base URL in your environment variables.

## Security Features

- Two-factor authentication
- Address whitelisting
- KYC verification
- Secure token storage
- Password validation
- Account settings

## License

MIT License - see LICENSE file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For support, email support@cryptosolve.com or open an issue on GitHub.
