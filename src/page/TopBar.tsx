import { Search, Bell, HelpCircle } from 'lucide-react';

interface TopBarProps {
  onAddExpense?: () => void;
}

export function TopBar({ onAddExpense }: TopBarProps) {
  return (
    <header className="sticky top-0 z-40 flex justify-between items-center h-20 px-8 bg-emerald-zenith-bg/80 backdrop-blur-xl border-b border-emerald-900/20">
      <div className="flex items-center flex-1 max-w-md mr-12">
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-zenith-text-muted group-focus-within:text-emerald-zenith-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search analytics..."
            className="w-full bg-emerald-zenith-surface-high/50 border-none rounded-xl pl-11 pr-4 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-emerald-zenith-primary/20 placeholder:text-emerald-zenith-text-muted/40 transition-all tracking-tight"
          />
        </div>
      </div>

      <div className="flex items-center gap-12">
        <div className="flex items-center gap-4">
          <button className="bg-emerald-zenith-surface-high/50 text-emerald-zenith-primary px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-zenith-surface-high transition-colors active:scale-95">
            Add Income
          </button>
          <button 
            onClick={onAddExpense}
            className="bg-emerald-zenith-primary text-emerald-zenith-accent px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-emerald-500/10"
          >
            Add Expense
          </button>
        </div>

        <div className="h-8 w-px bg-emerald-900/30" />

        <div className="flex items-center gap-4">
          <button className="p-2 text-emerald-zenith-text-muted hover:text-emerald-zenith-primary transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-zenith-primary rounded-full border-2 border-emerald-zenith-bg" />
          </button>
          <button className="p-2 text-emerald-zenith-text-muted hover:text-emerald-zenith-primary transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-full border-2 border-emerald-zenith-primary/20 p-0.5 overflow-hidden cursor-pointer hover:border-emerald-zenith-primary transition-colors">
            <img 
              src="https://picsum.photos/seed/user/100/100" 
              alt="User" 
              className="w-full h-full rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
