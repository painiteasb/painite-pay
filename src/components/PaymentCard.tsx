import { useState, useEffect, useMemo } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useConnect } from 'wagmi';
import { parseUnits, isAddress } from 'viem';
import { ARC_CONFIG, ERC20_ABI, arcTestnet, USDC_CONFIG } from '../lib/arc';
import { QRCodeSVG } from 'qrcode.react';
import { Loader2, ShieldCheck, AlertCircle, Wallet, QrCode } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { logTransaction, updateTransactionStatus } from '../lib/transactions';

interface PaymentData {
  amount: string;
  recipient: string;
  title?: string;
  description?: string;
}

export default function PaymentCard() {
  const { address: payerAddress, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const navigate = useNavigate();
  const location = useLocation();

  const payment = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const amountParam = params.get('amount');
    const recipientAddress = params.get('address');
    const title = params.get('title');
    const description = params.get('desc');

    if (!amountParam || !recipientAddress || !isAddress(recipientAddress)) {
      return null;
    }

    return {
      amount: amountParam,
      recipient: recipientAddress,
      title: title || undefined,
      description: description || undefined,
    } as PaymentData;
  }, [location.search]);

  const [showQR, setShowQR] = useState(false);
  const { writeContract, data: hash, isPending: isWritePending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess, isError: isConfirmError } = useWaitForTransactionReceipt({ hash });

  const amountInUnits = useMemo(() => {
    if (!payment?.amount) return 0n;
    try {
      // Ensure we pass a string to parseUnits
      return parseUnits(payment.amount.toString(), USDC_CONFIG.decimals);
    } catch (e) {
      console.error("Error parsing amount:", e);
      return 0n;
    }
  }, [payment?.amount]);

  const isInvalidAmount = amountInUnits === 0n;

  useEffect(() => {
    if (hash && payment && payerAddress) {
      if (isSuccess) {
        updateTransactionStatus(hash, 'success');
        
        navigate('/success', { 
          state: { 
            hash, 
            amount: payment?.amount, 
            title: payment?.title,
            timestamp: new Date().toISOString()
          } 
        });
      } else if (isConfirmError) {
        updateTransactionStatus(hash, 'failed');
      }
    }
  }, [isSuccess, isConfirmError, hash, navigate, payment, payerAddress]);

  const handlePay = () => {
    if (!payment || !payerAddress) return;

    const recipientAddress = payment.recipient;
    const amountParam = payment.amount;

    // Debug logging as requested
    console.log("Recipient:", recipientAddress);
    console.log("Amount (raw):", amountParam);
    console.log("Amount (parsed):", amountInUnits.toString());

    if (isInvalidAmount) {
      console.error("Invalid payment amount: 0");
      return;
    }

    writeContract({
      address: USDC_CONFIG.address, // Token contract address
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: [
        recipientAddress as `0x${string}`, // Recipient from URL
        amountInUnits, // Parsed amount
      ],
      account: payerAddress,
      chain: arcTestnet,
    }, {
      onSuccess: (txHash) => {
        logTransaction({
          type: 'sent',
          amount: amountParam,
          to: recipientAddress,
          txHash,
          status: 'pending',
          timestamp: new Date().toISOString()
        });
      }
    });
  };

  if (!payment) {
    return (
      <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 rounded-3xl p-12 text-center border border-gray-100 dark:border-gray-800">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Invalid Payment Link</h2>
        <p className="text-gray-500 dark:text-gray-400">This payment link is missing required information or is formatted incorrectly.</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-6 text-blue-600 font-bold hover:underline"
        >
          Go Home
        </button>
      </div>
    );
  }

  const isProcessing = isWritePending || isConfirming;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-2xl shadow-blue-500/10 dark:shadow-none border border-gray-100 dark:border-gray-800 overflow-hidden"
    >
      <div className="p-8 text-center border-b border-gray-50 dark:border-gray-800">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
          <ShieldCheck className="w-3.5 h-3.5" />
          Secure Payment
        </div>
        
        <h2 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2">Amount Due</h2>
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-6xl font-black text-gray-900 dark:text-white">{payment.amount}</span>
          <span className="text-2xl font-bold text-gray-400 dark:text-gray-500">USDC</span>
        </div>

        <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Recipient Address</p>
          <p className="text-xs font-mono text-gray-600 dark:text-gray-300 break-all">
            {payment.recipient}
          </p>
        </div>
      </div>

      <div className="p-8 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            {payment.title || 'Payment Request'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
            {payment.description || 'No description provided.'}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 space-y-3 border border-gray-100 dark:border-gray-800">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400 font-medium">Network</span>
            <span className="text-gray-900 dark:text-white font-bold">Arc Testnet</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400 font-medium">Asset</span>
            <span className="text-gray-900 dark:text-white font-bold">USDC</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400 font-medium">Fee</span>
            <span className="text-green-600 dark:text-green-400 font-bold">Near Zero</span>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => setShowQR(!showQR)}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <QrCode className="w-4 h-4" />
            {showQR ? 'Hide QR Code' : 'Show QR Code'}
          </button>
        </div>

        <AnimatePresence>
          {showQR && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800"
            >
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <QRCodeSVG value={window.location.href} size={140} />
              </div>
              <span className="mt-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Scan to Pay</span>
            </motion.div>
          )}
        </AnimatePresence>

        {writeError && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl flex gap-3 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="font-medium">{(writeError as any).shortMessage || writeError.message}</p>
          </div>
        )}

        {isInvalidAmount && (
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-xl flex gap-3 text-amber-600 dark:text-amber-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="font-medium">Invalid payment amount</p>
          </div>
        )}

        {isConnected && !isInvalidAmount && (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            You are sending <span className="font-bold text-gray-900 dark:text-white">{payment.amount} USDC</span> to <span className="font-mono text-blue-600 dark:text-blue-400">{payment.recipient.slice(0, 6)}...{payment.recipient.slice(-4)}</span>
          </p>
        )}

        {!isConnected ? (
          <button
            onClick={() => connect({ connector: connectors[0] })}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
          >
            <Wallet className="w-5 h-5" />
            Connect Wallet to Pay
          </button>
        ) : (
          <button
            onClick={handlePay}
            disabled={isProcessing || isInvalidAmount}
            className={cn(
              "w-full py-4 bg-gray-900 dark:bg-blue-600 text-white rounded-2xl font-bold hover:bg-gray-800 dark:hover:bg-blue-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-gray-900/10 dark:shadow-blue-600/20",
              (isProcessing || isInvalidAmount) && "opacity-80 cursor-not-allowed"
            )}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {isConfirming ? 'Confirming...' : 'Processing...'}
              </>
            ) : isInvalidAmount ? (
              'Invalid Amount'
            ) : (
              'Pay Now'
            )}
          </button>
        )}
        
        <p className="text-center text-xs text-gray-400 dark:text-gray-500 font-medium">
          Payments are final and settle instantly on Arc.
        </p>
      </div>
    </motion.div>
  );
}
