# Painite Pay
### Seamless crypto payment links powered by Arc

## Overview
Painite Pay is a decentralized payment link generator designed to make Web3 transactions as simple as sharing a URL. Built on the Arc Testnet, it allows anyone to generate a secure, shareable payment request in seconds. Whether you're a freelancer, a small business, or just splitting a bill with a friend, Painite Pay removes the complexity of crypto transfers, allowing the payer to simply connect their wallet and settle the amount in USDC.

## The Problem
Current crypto payments are often high-friction. Users have to manually copy long, complex wallet addresses, double-check network compatibility, and manually input amounts. One small typo can lead to permanent loss of funds. This "copy-paste" workflow is intimidating for new users and tedious for veterans, preventing crypto from becoming a mainstream payment method.

## The Solution
Painite Pay solves this by abstracting the complexity into a single, shareable link. By encoding the recipient's address and the exact amount into a URL, we eliminate manual entry errors. Leveraging the speed and low fees of the **Arc Testnet**, we provide a payment experience that feels like Venmo or PayPal but with the security and decentralization of the blockchain.

## Features
- **Wallet Integration**: Seamless connection via Wagmi and popular wallet providers.
- **Instant Link Generation**: Create custom payment requests with titles and descriptions.
- **Shareable Links**: Send requests via any messaging platform or social media.
- **QR Code Support**: Built-in QR generation for easy mobile-to-mobile payments.
- **Accurate USDC Transfers**: Precision handling of ERC-20 transfers with correct decimal logic (6 decimals).
- **Modern UI**: A polished, responsive interface with full Dark Mode support.

## How It Works
1. **Connect**: Link your wallet to the platform.
2. **Generate**: Enter the amount and an optional description to create your payment link.
3. **Share**: Send the unique URL or show the QR code to your payer.
4. **Pay**: The receiver opens the link, connects their wallet, and clicks "Pay Now" to settle the transaction in USDC.

## Tech Stack
- **Vite + React**: For a lightning-fast, modern frontend experience.
- **Arc Testnet**: The underlying high-performance blockchain network.
- **Wagmi & Viem**: For robust Ethereum-compatible wallet interactions.
- **Lucide React**: For clean, consistent iconography.
- **Tailwind CSS**: For a responsive and beautiful design system.

## Live Demo
Check out the live application here: [painite-pay.vercel.app](https://painite-pay.vercel.app)

## Getting Started
To run Painite Pay locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/painite-pay.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser to `http://localhost:3000`.

## Future Improvements
- **Mainnet Deployment**: Moving beyond testnet to support real-world USDC transactions.
- **Analytics Dashboard**: Track incoming payments, history, and exportable reports.
- **Merchant Tools**: Webhooks and API support for integrating Painite Pay into existing e-commerce sites.
- **Multi-Asset Support**: Expanding beyond USDC to other stablecoins and native assets.

---
*Built for the future of decentralized commerce.*
