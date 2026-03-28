
import { Search, Bell, HelpCircle } from 'lucide-react';

type TopBarProps = {
  onAddIncomeClick?: () => void;
  onAddExpenseClick?: () => void;
};

export function TopBar({ onAddIncomeClick, onAddExpenseClick }: TopBarProps) {
  return (
    <header className="sticky top-0 z-40 flex justify-between items-center h-16 px-4 md:px-6 lg:px-8 bg-emerald-zenith-bg/80 backdrop-blur-xl border-b border-emerald-900/20">
      <div className="flex items-center flex-1 max-w-sm md:max-w-md lg:max-w-lg">
        <div className="relative w-full group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-zenith-text-muted group-focus-within:text-emerald-zenith-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search analytics..."
            className="w-full bg-emerald-zenith-surface-high/50 border-none rounded-lg pl-10 pr-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-zenith-primary/20 placeholder:text-emerald-zenith-text-muted/40 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6 lg:gap-8">
        <div className="flex items-center gap-2.5 md:gap-3">
          <button
            onClick={onAddIncomeClick}
            className="bg-emerald-zenith-surface-high/50 text-emerald-zenith-primary px-4 md:px-4.5 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-zenith-surface-high transition-colors active:scale-95 whitespace-nowrap"
          >
            Add Income
          </button>
          <button
            onClick={onAddExpenseClick}
            className="bg-emerald-zenith-primary text-emerald-zenith-accent px-4 md:px-4.5 py-2 rounded-lg text-sm font-semibold hover:brightness-110 transition-all active:scale-95 shadow-md shadow-emerald-zenith-primary/10 whitespace-nowrap"
          >
            Add Expense
          </button>
        </div>

        <div className="h-7 w-px bg-emerald-900/30" />

        <div className="flex items-center gap-2 md:gap-3">
          <button className="p-1.5 text-emerald-zenith-text-muted hover:text-emerald-zenith-primary transition-colors relative">
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-zenith-primary rounded-full border-2 border-emerald-zenith-bg" />
          </button>
          <button className="p-1.5 text-emerald-zenith-text-muted hover:text-emerald-zenith-primary transition-colors">
            <HelpCircle className="w-4.5 h-4.5" />
          </button>
          <div className="w-9 h-9 rounded-full border-2 border-emerald-zenith-primary/20 p-0.5 overflow-hidden cursor-pointer hover:border-emerald-zenith-primary transition-colors">
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
