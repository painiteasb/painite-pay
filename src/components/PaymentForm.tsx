import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, Link as LinkIcon, Sparkles, QrCode, Share2, PlusCircle, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useAccount } from 'wagmi';

export default function PaymentForm() {
  const { address } = useAccount();
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !address) return;

    const params = new URLSearchParams({
      amount,
      address,
      ...(title && { title }),
      ...(description && { desc: description }),
    });

    const link = `${window.location.origin}/pay?${params.toString()}`;
    setGeneratedLink(link);
    setIsGenerated(true);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || 'Payment Request',
          text: `Pay me ${amount} USDC on Arc Testnet`,
          url: generatedLink,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      copyToClipboard();
    }
  };

  const resetForm = () => {
    setAmount('');
    setTitle('');
    setDescription('');
    setGeneratedLink('');
    setIsGenerated(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {!isGenerated ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl shadow-blue-500/5 dark:shadow-none border border-gray-100 dark:border-gray-800 overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Payment Link</h2>
              </div>

              <form onSubmit={handleGenerate} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Amount (USDC)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-lg dark:text-white"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                      USDC
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Title <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Coffee for the team"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Description <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What is this payment for?"
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!address}
                  className="w-full py-4 bg-gray-900 dark:bg-blue-600 text-white rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-blue-700 transition-all active:scale-[0.98] shadow-lg shadow-gray-900/10 dark:shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {address ? 'Generate Link' : 'Connect Wallet to Generate'}
                </button>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl shadow-blue-500/5 dark:shadow-none border border-gray-100 dark:border-gray-800 overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Link Created</h2>
                </div>
                <button
                  onClick={resetForm}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <PlusCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col items-center bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                  <div className="bg-white p-3 rounded-xl shadow-sm mb-4">
                    <QRCodeSVG value={generatedLink} size={180} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Scan to Pay</span>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Payment Link</label>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-600 dark:text-gray-300 font-mono truncate">
                      {generatedLink}
                    </div>
                    <button
                      onClick={copyToClipboard}
                      className={cn(
                        "p-3 rounded-xl transition-all active:scale-90",
                        copied ? "bg-green-500 text-white" : "bg-blue-600 text-white hover:bg-blue-700"
                      )}
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleShare}
                    className="flex items-center justify-center gap-2 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-[0.98]"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                  <button
                    onClick={resetForm}
                    className="flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-[0.98]"
                  >
                    <PlusCircle className="w-4 h-4" />
                    New Link
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
