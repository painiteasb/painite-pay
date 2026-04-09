import { useEffect, useState } from 'react';
import { Transaction } from '../lib/transactions';
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { arcTestnet } from '../lib/arc';

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const loadTransactions = () => {
      const txs = JSON.parse(localStorage.getItem('transactions') || '[]');
      setTransactions(txs);
    };

    loadTransactions();
    // Poll for changes in localStorage (simple way to keep it in sync across tabs/actions)
    const interval = setInterval(loadTransactions, 2000);
    return () => clearInterval(interval);
  }, []);

  if (transactions.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-12 p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
        <p className="text-gray-500 dark:text-gray-400 font-medium">No transactions yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Transaction History</h2>
        <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Recent Activity</span>
      </div>

      <div className="space-y-3">
        {transactions.map((tx) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-between group hover:border-blue-200 dark:hover:border-blue-900/50 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "p-2 rounded-lg",
                tx.type === 'sent' ? "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400" : "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
              )}>
                {tx.type === 'sent' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 dark:text-white">
                    {tx.type === 'sent' ? 'Sent' : 'Received'} {tx.amount} USDC
                  </span>
                  <StatusBadge status={tx.status} />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {tx.type === 'sent' ? `To: ${tx.to?.slice(0, 6)}...${tx.to?.slice(-4)}` : `From: ${tx.from?.slice(0, 6)}...${tx.from?.slice(-4)}`}
                  <span className="mx-2">•</span>
                  {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            <a
              href={`${arcTestnet.blockExplorers.default.url}/tx/${tx.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Transaction['status'] }) {
  switch (status) {
    case 'pending':
      return (
        <span className="flex items-center gap-1 text-[10px] font-bold text-orange-500 uppercase tracking-wider">
          <Clock className="w-3 h-3" />
          Pending
        </span>
      );
    case 'success':
      return (
        <span className="flex items-center gap-1 text-[10px] font-bold text-green-500 uppercase tracking-wider">
          <CheckCircle2 className="w-3 h-3" />
          Success
        </span>
      );
    case 'failed':
      return (
        <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 uppercase tracking-wider">
          <XCircle className="w-3 h-3" />
          Failed
        </span>
      );
    default:
      return null;
  }
}
