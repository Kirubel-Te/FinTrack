import { useState } from 'react';
import {
  X,
  PlusCircle,
  Calendar as CalendarIcon,
  Tag,
  FileText,
  Lock,
  RefreshCw,
  Lightbulb,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AddIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddIncomeModal({ isOpen, onClose }: AddIncomeModalProps) {
  const [amount, setAmount] = useState('');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-emerald-zenith-bg/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl grid grid-cols-1 xl:grid-cols-12 gap-6 pointer-events-none"
          >
            {/* Main Form Card */}
            <div className="xl:col-span-8 bg-emerald-zenith-surface rounded-3xl overflow-hidden shadow-2xl border border-emerald-zenith-text-muted/15 relative pointer-events-auto">
              {/* Decorative Header Accent */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-emerald-zenith-secondary to-emerald-zenith-primary" />

              <div className="p-6 md:p-8">
                <header className="mb-8 text-center relative">
                  <button
                    onClick={onClose}
                    className="absolute -top-2 -right-2 p-1.5 text-emerald-zenith-text-muted hover:text-emerald-zenith-text transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <h2 className="text-3xl md:text-4xl font-black tracking-tight text-emerald-zenith-text mb-2">Add Income</h2>
                  <p className="text-emerald-zenith-text-muted font-medium text-sm md:text-base">Record a new inflow into your financial sanctuary</p>
                </header>

                <form className="space-y-7" onSubmit={(e) => e.preventDefault()}>
                  {/* Big Amount Input */}
                  <div className="text-center space-y-3">
                    <label className="block text-[10px] uppercase tracking-[0.3em] text-emerald-zenith-text-muted font-black">Income Amount</label>
                    <div className="relative inline-flex items-center justify-center w-full">
                      <span className="text-4xl font-light text-emerald-zenith-primary mr-3">$</span>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="bg-transparent border-none text-6xl md:text-7xl font-black text-emerald-zenith-text placeholder:text-emerald-zenith-text-muted/30 focus:ring-0 p-0 w-full max-w-85 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  </div>

                  {/* Form Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Source Select */}
                    <div className="space-y-2">
                      <label className="block text-xs font-black uppercase tracking-widest text-emerald-zenith-text-muted px-1">Income Source</label>
                      <div className="relative group">
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-emerald-zenith-primary/60 group-focus-within:text-emerald-zenith-primary transition-colors" />
                        <select defaultValue="" className="w-full bg-emerald-zenith-surface-high/50 border border-emerald-zenith-text-muted/20 rounded-xl py-3 pl-12 pr-10 text-sm text-emerald-zenith-text appearance-none focus:ring-2 focus:ring-emerald-zenith-primary/20 focus:border-emerald-zenith-primary transition-all cursor-pointer font-bold">
                          <option disabled value="">Select source</option>
                          <option value="salary">Salary</option>
                          <option value="freelance">Freelance</option>
                          <option value="business">Business</option>
                          <option value="investment">Investments</option>
                          <option value="other">Other Income</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 pointer-events-none text-emerald-zenith-text-muted" />
                      </div>
                    </div>

                    {/* Date Picker */}
                    <div className="space-y-2">
                      <label className="block text-xs font-black uppercase tracking-widest text-emerald-zenith-text-muted px-1">Date</label>
                      <div className="relative group">
                        <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-emerald-zenith-primary/60 group-focus-within:text-emerald-zenith-primary transition-colors" />
                        <input
                          type="date"
                          className="w-full bg-emerald-zenith-surface-high/50 border border-emerald-zenith-text-muted/20 rounded-xl py-3 pl-12 pr-4 text-sm text-emerald-zenith-text focus:ring-2 focus:ring-emerald-zenith-primary/20 focus:border-emerald-zenith-primary transition-all font-bold scheme-dark"
                        />
                      </div>
                    </div>

                    {/* Description (Full Width) */}
                    <div className="md:col-span-2 space-y-2">
                      <label className="block text-xs font-black uppercase tracking-widest text-emerald-zenith-text-muted px-1">Description (Optional)</label>
                      <div className="relative group">
                        <FileText className="absolute left-4 top-4 w-4.5 h-4.5 text-emerald-zenith-primary/60 group-focus-within:text-emerald-zenith-primary transition-colors" />
                        <textarea
                          rows={3}
                          placeholder="What was this income from?"
                          className="w-full bg-emerald-zenith-surface-high/50 border border-emerald-zenith-text-muted/20 rounded-xl py-3 pl-12 pr-4 text-sm text-emerald-zenith-text focus:ring-2 focus:ring-emerald-zenith-primary/20 focus:border-emerald-zenith-primary transition-all resize-none font-bold placeholder:text-emerald-zenith-text-muted/40"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 flex flex-col md:flex-row gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 order-2 md:order-1 py-3 px-6 rounded-xl border border-emerald-zenith-text-muted/25 text-emerald-zenith-text-muted font-black uppercase tracking-widest text-[11px] hover:bg-emerald-zenith-surface-high transition-all active:scale-[0.98]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-2 order-1 md:order-2 py-3 px-6 rounded-xl bg-emerald-zenith-primary text-emerald-zenith-accent font-black uppercase tracking-widest text-[11px] shadow-xl shadow-emerald-zenith-primary/20 hover:brightness-110 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <PlusCircle className="w-4.5 h-4.5" />
                      Add Income
                    </button>
                  </div>
                </form>
              </div>

              {/* Footer Visual Flourish */}
              <div className="bg-emerald-zenith-surface-high/30 px-6 py-4 flex items-center justify-center gap-6 border-t border-emerald-zenith-text-muted/15">
                <div className="flex items-center gap-2.5 text-[10px] text-emerald-zenith-text-muted/50 font-black tracking-[0.2em] uppercase">
                  <Lock className="w-3.5 h-3.5 fill-current" />
                  Secure Encryption
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-zenith-text-muted/30" />
                <div className="flex items-center gap-2.5 text-[10px] text-emerald-zenith-text-muted/50 font-black tracking-[0.2em] uppercase">
                  <RefreshCw className="w-3.5 h-3.5" />
                  Real-time Sync
                </div>
              </div>
            </div>

            {/* Contextual Helper */}
            <div className="hidden xl:flex xl:col-span-4 flex-col gap-5 pointer-events-auto">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-emerald-zenith-primary/10 border border-emerald-zenith-primary/20 p-5 rounded-2xl space-y-3"
              >
                <Lightbulb className="w-6 h-6 text-emerald-zenith-primary" />
                <h4 className="text-base font-black text-emerald-zenith-text">Zen Tip</h4>
                <p className="text-xs leading-relaxed text-emerald-zenith-text-muted font-medium">
                  Log every income source promptly to keep your cash-flow forecasts accurate and reliable.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-emerald-zenith-surface p-5 rounded-2xl border border-emerald-zenith-text-muted/15 space-y-5 shadow-xl"
              >
                <h4 className="text-sm font-black text-emerald-zenith-text uppercase tracking-widest">Income Progress</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                      <span className="text-emerald-zenith-text-muted">Salary Goal</span>
                      <span className="text-emerald-zenith-text">78%</span>
                    </div>
                    <div className="h-2 w-full bg-emerald-zenith-surface-high rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '78%' }}
                        className="h-full bg-emerald-zenith-primary rounded-full"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                      <span className="text-emerald-zenith-text-muted">Side Income</span>
                      <span className="text-emerald-zenith-text">34%</span>
                    </div>
                    <div className="h-2 w-full bg-emerald-zenith-surface-high rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '34%' }}
                        className="h-full bg-emerald-zenith-secondary rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
