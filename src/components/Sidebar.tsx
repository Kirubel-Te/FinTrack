import { 
  LayoutDashboard, 
  ReceiptText, 
  Wallet, 
  Settings
} from 'lucide-react';
import { NavLink } from 'react-router';
import { cn } from '../lib/utils';

const firstNames = ['Ava', 'Noah', 'Liam', 'Emma', 'Maya', 'Leo', 'Sofia', 'Ethan'];
const lastNames = ['Johnson', 'Martinez', 'Patel', 'Bennett', 'Nguyen', 'Walker', 'Brooks', 'Morgan'];

const profile = {
  firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
  lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
  avatar: `https://api.dicebear.com/9.x/adventurer/svg?seed=${Math.random().toString(36).slice(2, 10)}`,
};

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/app' },
  { icon: ReceiptText, label: 'Transactions', path: '/app/transactions' },
  { icon: Wallet, label: 'Budgets', path: '/app/budgets' },
  { icon: Settings, label: 'Settings', path: '/app/settings' },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-16 md:w-64 bg-emerald-zenith-accent border-r border-emerald-900/30 flex flex-col py-6 md:py-8 z-50">
      <div className="px-3 md:px-6 mb-6 md:mb-8 text-center md:text-left">
        <h1 className="hidden md:block text-xl font-black text-emerald-zenith-primary tracking-tight">FinTrack</h1>
        <h1 className="md:hidden text-lg font-black text-emerald-zenith-primary tracking-tight">FT</h1>
        <p className="hidden md:block text-xs font-medium tracking-tight text-emerald-100/40 uppercase">Financial Sanctuary</p>
      </div>

      <nav className="flex-1 px-2 md:px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            end={item.path === '/app'}
            className={({ isActive }) =>
              cn(
                "flex items-center justify-center md:justify-start gap-0 md:gap-2.5 px-2 md:px-3.5 py-2.5 rounded-lg transition-all duration-200 group",
                isActive
                  ? "text-emerald-zenith-primary bg-emerald-zenith-primary/10 font-bold border-r-4 border-emerald-zenith-primary"
                  : "text-emerald-zenith-text-muted hover:text-emerald-zenith-text hover:bg-white/5"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn("w-4.5 h-4.5", isActive ? "text-emerald-zenith-primary" : "text-emerald-zenith-text-muted group-hover:text-emerald-zenith-text")} />
                <span className="hidden md:inline text-sm font-medium tracking-tight">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-2 md:px-4 mt-auto">
        <div className="w-full flex items-center justify-center md:justify-start gap-0 md:gap-3 px-2 md:px-3 py-2 rounded-xl bg-white/5 border border-emerald-900/30">
          <img
            src={profile.avatar}
            alt={`${profile.firstName} ${profile.lastName}`}
            className="w-9 h-9 rounded-full border border-emerald-zenith-primary/50 bg-emerald-zenith-surface-high"
          />
          <div className="hidden md:block min-w-0">
            <p className="text-sm font-semibold text-emerald-zenith-text leading-tight truncate">
              {profile.firstName} {profile.lastName}
            </p>
            <p className="text-xs text-emerald-zenith-text-muted">Personal Account</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
