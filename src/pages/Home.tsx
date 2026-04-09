import PaymentForm from '../components/PaymentForm';
import TransactionHistory from '../components/TransactionHistory';
import { motion } from 'motion/react';
import { useAccount } from 'wagmi';

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-black tracking-tight text-gray-900 dark:text-white mb-4">
          Painite Pay
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 font-medium max-w-lg mx-auto leading-relaxed">
          Instant payments. Final in seconds. Create and share USDC payment links on Arc Testnet.
        </p>
      </motion.div>

      <PaymentForm />

      {isConnected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full"
        >
          <TransactionHistory />
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl"
      >
        <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
            <span className="text-green-600 dark:text-green-400 font-bold">01</span>
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white mb-2">Create Link</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Set your amount and optional details. We generate a secure link instantly.
          </p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
            <span className="text-blue-600 dark:text-blue-400 font-bold">02</span>
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white mb-2">Share Anywhere</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Send the link via chat, email, or QR code. No complex setup required.
          </p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-4">
            <span className="text-purple-600 dark:text-purple-400 font-bold">03</span>
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white mb-2">Get Paid</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Funds settle instantly in your wallet using Arc's high-speed infrastructure.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
