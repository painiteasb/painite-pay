import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Copy, Check, ExternalLink, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { arcTestnet } from '../lib/arc';

export default function SuccessCard() {
  const location = useLocation();
  const [copied, setCopied] = useState(false);
  const { hash, amount, title, timestamp } = location.state || {};

  const copyHash = () => {
    if (!hash) return;
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!hash) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 font-medium mb-4">No transaction found.</p>
        <Link to="/" className="text-blue-600 font-bold hover:underline">Go Home</Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-2xl shadow-green-500/10 dark:shadow-none border border-gray-100 dark:border-gray-800 overflow-hidden"
    >
      <div className="p-8 text-center bg-green-50/50 dark:bg-green-900/10 border-b border-green-100 dark:border-green-900/30">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
          className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20"
        >
          <CheckCircle2 className="w-10 h-10 text-white" />
        </motion.div>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Payment Successful</h2>
        <p className="text-green-700 dark:text-green-400 font-bold uppercase tracking-widest text-xs">Transaction Confirmed</p>
      </div>

      <div className="p-8 space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Amount Paid</p>
            <p className="text-3xl font-black text-gray-900 dark:text-white">{amount} USDC</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Date</p>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
              {new Date(timestamp).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Transaction Hash</p>
            <div className="flex gap-2">
              <div className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 text-sm font-mono text-gray-600 dark:text-gray-400 truncate">
                {hash}
              </div>
              <button
                onClick={copyHash}
                className={cn(
                  "p-3 rounded-xl transition-all active:scale-90",
                  copied ? "bg-green-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                )}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <a
            href={`${arcTestnet.blockExplorers.default.url}/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 text-sm font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
          >
            View on Explorer
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="pt-4">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full py-4 bg-gray-900 dark:bg-blue-600 text-white rounded-2xl font-bold hover:bg-gray-800 dark:hover:bg-blue-700 transition-all active:scale-[0.98] shadow-lg shadow-gray-900/10 dark:shadow-blue-600/20"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
