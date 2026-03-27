import { 
  LayoutDashboard, 
  ReceiptText, 
  Wallet, 
  Settings, 
  Plus
} from 'lucide-react';
import { NavLink } from 'react-router';
import { cn } from '../lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: ReceiptText, label: 'Transactions', path: '/placeholder' },
  { icon: Wallet, label: 'Budgets', path: '/budgets' },
  { icon: Settings, label: 'Settings', path: '/placeholder' },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-emerald-zenith-accent border-r border-emerald-900/30 flex flex-col py-8 z-50">
      <div className="px-6 mb-8">
        <h1 className="text-xl font-black text-emerald-zenith-primary tracking-tight">FinTrack</h1>
        <p className="text-xs font-medium tracking-tight text-emerald-100/40 uppercase">Financial Sanctuary</p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg transition-all duration-200 group",
                isActive
                  ? "text-emerald-zenith-primary bg-emerald-zenith-primary/10 font-bold border-r-4 border-emerald-zenith-primary"
                  : "text-emerald-zenith-text-muted hover:text-emerald-zenith-text hover:bg-white/5"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn("w-4.5 h-4.5", isActive ? "text-emerald-zenith-primary" : "text-emerald-zenith-text-muted group-hover:text-emerald-zenith-text")} />
                <span className="text-sm font-medium tracking-tight">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 mt-auto">
        <button className="w-full flex items-center justify-center gap-1.5 bg-emerald-zenith-primary text-emerald-zenith-accent py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110 active:scale-95 shadow-md shadow-emerald-500/20">
          <Plus className="w-4 h-4" />
          <span>Add Transaction</span>
        </button>
      </div>
    </aside>
  );
}
