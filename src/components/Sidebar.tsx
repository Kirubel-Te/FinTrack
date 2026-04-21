import { 
  LayoutDashboard, 
  ReceiptText, 
  Wallet, 
  Bell,
  Settings,
  LogOut
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router';
import { cn } from '../lib/utils';
import { useEffect, useState } from 'react';
import { getMe, getStoredAuthSession, logout, type AuthUser } from '../api/auth';

const avatarForName = (firstName: string, lastName: string) => (
  `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(`${firstName}-${lastName}`)}`
);

const fallbackProfile: AuthUser = {
  id: 'local',
  firstName: 'FinTrack',
  lastName: 'User',
  email: 'account@local',
  createdAt: new Date().toISOString(),
};

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/app' },
  { icon: ReceiptText, label: 'Transactions', path: '/app/transactions' },
  { icon: Wallet, label: 'Budgets', path: '/app/budgets' },
  { icon: Bell, label: 'Notifications', path: '/app/notifications' },
  { icon: Settings, label: 'Settings', path: '/app/settings' },
];

export function Sidebar() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<AuthUser>(() => getStoredAuthSession()?.user ?? fallbackProfile);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    let active = true;

    getMe()
      .then((user) => {
        if (active) {
          setProfile(user);
        }
      })
      .catch(() => {
        // Keep the locally cached profile if this best-effort request fails.
      });

    return () => {
      active = false;
    };
  }, [navigate]);

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    await logout();
    navigate('/login', { replace: true, state: { notice: 'You have been logged out.' } });
  };

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
            src={avatarForName(profile.firstName, profile.lastName)}
            alt={`${profile.firstName} ${profile.lastName}`}
            className="w-9 h-9 rounded-full border border-emerald-zenith-primary/50 bg-emerald-zenith-surface-high"
          />
          <div className="hidden md:block min-w-0">
            <p className="text-sm font-semibold text-emerald-zenith-text leading-tight truncate">
              {profile.firstName} {profile.lastName}
            </p>
            <p className="text-xs text-emerald-zenith-text-muted truncate">{profile.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="mt-3 w-full flex items-center justify-center md:justify-start gap-2 px-2 md:px-3 py-2 rounded-xl border border-emerald-900/30 bg-white/5 text-emerald-zenith-text-muted hover:text-emerald-zenith-primary hover:border-emerald-zenith-primary/30 transition-colors disabled:opacity-60"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline text-xs font-semibold">
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </span>
        </button>
      </div>
    </aside>
  );
}
