
import { Search, Bell, HelpCircle, X, UserRound, CalendarDays, BadgeInfo } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { getMe, getStoredAuthSession, type AuthUser } from '../api/auth';
import { avatarForName, formatMemberSince, getProfileDisplayName } from '../lib/profile';

type TopBarProps = {
  onAddIncomeClick?: () => void;
  onAddExpenseClick?: () => void;
  onHelpClick?: () => void;
  onNotificationsClick?: () => void;
};

export function TopBar({ onAddIncomeClick, onAddExpenseClick, onHelpClick, onNotificationsClick }: TopBarProps) {
  const fallbackProfile: AuthUser = {
    id: 'local',
    firstName: 'FinTrack',
    lastName: 'User',
    email: 'account@local',
    createdAt: new Date().toISOString(),
  };

  const [profile, setProfile] = useState<AuthUser>(() => getStoredAuthSession()?.user ?? fallbackProfile);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    let active = true;

    getMe()
      .then((user) => {
        if (active) {
          setProfile(user);
        }
      })
      .catch(() => {
        // Keep the cached profile when the fetch is unavailable.
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 flex flex-col md:flex-row justify-between md:items-center h-auto md:h-16 px-3 md:px-6 lg:px-8 py-2 md:py-0 bg-emerald-zenith-bg/80 backdrop-blur-xl border-b border-emerald-900/20 gap-2 md:gap-4">
      <div className="flex items-center w-full md:flex-1 md:max-w-sm lg:max-w-lg">
        <div className="relative w-full group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-zenith-text-muted group-focus-within:text-emerald-zenith-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search analytics..."
            className="w-full bg-emerald-zenith-surface-high/50 border-none rounded-lg pl-10 pr-3.5 py-2 md:py-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-zenith-primary/20 placeholder:text-emerald-zenith-text-muted/40 transition-all"
          />
        </div>
      </div>

      <div className="flex w-full md:w-auto md:flex-none items-center justify-end gap-2 md:gap-6 lg:gap-8">
        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={onAddIncomeClick}
            className="bg-emerald-zenith-surface-high/50 text-emerald-zenith-primary px-2.5 md:px-4.5 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-semibold hover:bg-emerald-zenith-surface-high transition-colors active:scale-95 whitespace-nowrap"
          >
            <span className="md:hidden">Income</span>
            <span className="hidden md:inline">Add Income</span>
          </button>
          <button
            onClick={onAddExpenseClick}
            className="bg-emerald-zenith-primary text-emerald-zenith-accent px-2.5 md:px-4.5 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-semibold hover:brightness-110 transition-all active:scale-95 shadow-md shadow-emerald-zenith-primary/10 whitespace-nowrap"
          >
            <span className="md:hidden">Expense</span>
            <span className="hidden md:inline">Add Expense</span>
          </button>
        </div>

        <div className="hidden lg:block h-7 w-px bg-emerald-900/30" />

        <div className="flex items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={onNotificationsClick}
            className="p-1.5 text-emerald-zenith-text-muted hover:text-emerald-zenith-primary transition-colors relative"
            aria-label="Open notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-zenith-primary rounded-full border-2 border-emerald-zenith-bg" />
          </button>
          <button
            type="button"
            onClick={onHelpClick}
            className="p-1.5 text-emerald-zenith-text-muted hover:text-emerald-zenith-primary transition-colors"
            aria-label="Open help"
          >
            <HelpCircle className="w-4.5 h-4.5" />
          </button>
          <button
            type="button"
            onClick={() => setIsProfileOpen(true)}
            className="w-9 h-9 rounded-full border border-emerald-zenith-primary/50 overflow-hidden cursor-pointer hover:border-emerald-zenith-primary transition-colors bg-emerald-zenith-surface-high"
            aria-label="Open profile details"
          >
            <img 
              src={avatarForName(profile.firstName, profile.lastName)} 
              alt={getProfileDisplayName(profile)} 
              className="w-full h-full rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          </button>
        </div>
      </div>
      </header>

      <AnimatePresence>
        {isProfileOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProfileOpen(false)}
              className="absolute inset-0 bg-emerald-zenith-bg/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl rounded-3xl border border-emerald-zenith-text-muted/15 bg-emerald-zenith-surface shadow-2xl shadow-emerald-950/30 overflow-hidden pointer-events-none"
            >
              <div className="absolute top-0 left-0 h-1.5 w-full bg-linear-to-r from-emerald-zenith-secondary to-emerald-zenith-primary" />

              <div className="pointer-events-auto p-6 md:p-8">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-zenith-text-muted">Profile</p>
                    <h2 className="mt-2 text-3xl font-black tracking-tight text-emerald-zenith-text">Account details</h2>
                    <p className="mt-2 text-sm text-emerald-zenith-text-muted">Quick view of your signed-in account information.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsProfileOpen(false)}
                    className="rounded-full border border-emerald-zenith-text-muted/15 p-2 text-emerald-zenith-text-muted transition-colors hover:text-emerald-zenith-text hover:bg-emerald-zenith-surface-high/50"
                    aria-label="Close profile details"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid gap-6 md:grid-cols-[auto,1fr] md:items-center">
                  <div className="flex justify-center md:justify-start">
                    <div className="rounded-full border-4 border-emerald-zenith-primary/20 bg-emerald-zenith-surface-high p-1.5 shadow-xl shadow-emerald-950/20">
                      <img
                        src={avatarForName(profile.firstName, profile.lastName)}
                        alt={getProfileDisplayName(profile)}
                        className="h-24 w-24 rounded-full object-cover md:h-28 md:w-28"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl border border-emerald-zenith-text-muted/15 bg-emerald-zenith-surface-high/35 p-4">
                      <div className="flex items-start gap-3">
                        <UserRound className="mt-0.5 h-5 w-5 text-emerald-zenith-primary" />
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-zenith-text-muted">Name</p>
                          <p className="mt-1 text-lg font-bold text-emerald-zenith-text">{getProfileDisplayName(profile)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-emerald-zenith-text-muted/15 bg-emerald-zenith-surface-high/35 p-4">
                        <div className="flex items-start gap-3">
                          <BadgeInfo className="mt-0.5 h-5 w-5 text-emerald-zenith-primary" />
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-zenith-text-muted">Email</p>
                            <p className="mt-1 break-all text-sm font-semibold text-emerald-zenith-text">{profile.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-emerald-zenith-text-muted/15 bg-emerald-zenith-surface-high/35 p-4">
                        <div className="flex items-start gap-3">
                          <CalendarDays className="mt-0.5 h-5 w-5 text-emerald-zenith-primary" />
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-zenith-text-muted">Member Since</p>
                            <p className="mt-1 text-sm font-semibold text-emerald-zenith-text">{formatMemberSince(profile.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
