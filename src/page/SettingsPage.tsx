import { useMemo, useState } from 'react';
import {
  BellRing,
  CircleAlert,
  LogOut,
  Lock,
  PiggyBank,
  Save,
  ShieldAlert,
  Trash2,
  UserRound,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { clearAuthSession, getStoredAuthSession, logout } from '../api/auth';

type ActionStatus = {
  type: 'success' | 'error';
  message: string;
} | null;

type FieldErrors = Record<string, string>;

type ProfileForm = {
  name: string;
  email: string;
};

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type PreferenceForm = {
  monthlyBudget: string;
  currency: string;
};

type NotificationForm = {
  budgetWarnings: boolean;
  overspendingAlerts: boolean;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CURRENCIES = ['USD', 'EUR', 'GBP', 'NGN', 'KES', 'INR'];

const sectionClassName = 'rounded-2xl border border-emerald-900/20 bg-emerald-zenith-surface/60 p-5 shadow-lg shadow-emerald-950/10 backdrop-blur-sm md:p-6';
const inputClassName = 'w-full rounded-xl border border-emerald-900/20 bg-emerald-zenith-surface-high/40 px-4 py-2.5 text-sm text-emerald-zenith-text placeholder:text-emerald-zenith-text-muted/45 outline-none transition-all focus:border-emerald-zenith-primary/45 focus:ring-2 focus:ring-emerald-zenith-primary/20';

const validateProfile = (values: ProfileForm): FieldErrors => {
  const errors: FieldErrors = {};

  if (!values.name.trim()) {
    errors.name = 'Name is required.';
  } else if (values.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  return errors;
};

const validatePassword = (values: PasswordForm): FieldErrors => {
  const errors: FieldErrors = {};

  if (!values.currentPassword) {
    errors.currentPassword = 'Current password is required.';
  }

  if (!values.newPassword) {
    errors.newPassword = 'New password is required.';
  } else if (values.newPassword.length < 8) {
    errors.newPassword = 'New password must be at least 8 characters.';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Please confirm your new password.';
  } else if (values.confirmPassword !== values.newPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
};

const validateBudget = (values: PreferenceForm): FieldErrors => {
  const errors: FieldErrors = {};

  if (values.monthlyBudget.trim()) {
    const parsed = Number(values.monthlyBudget);
    if (!Number.isFinite(parsed) || parsed < 0) {
      errors.monthlyBudget = 'Monthly budget must be 0 or more.';
    }
  }

  if (!values.currency) {
    errors.currency = 'Please choose a preferred currency.';
  }

  return errors;
};

const FieldError = ({ message }: { message?: string }) => (
  message
    ? <p className="mt-1 text-xs text-emerald-zenith-error">{message}</p>
    : null
);

const SectionHeader = ({
  title,
  subtitle,
  icon: Icon,
}: {
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}) => (
  <div className="mb-4 flex items-start gap-3">
    <div className="rounded-xl border border-emerald-zenith-primary/25 bg-emerald-zenith-primary/10 p-2.5 text-emerald-zenith-primary">
      <Icon className="h-4.5 w-4.5" />
    </div>
    <div>
      <h2 className="text-base font-black tracking-tight text-emerald-zenith-text">{title}</h2>
      <p className="text-sm text-emerald-zenith-text-muted">{subtitle}</p>
    </div>
  </div>
);

const ToggleSwitch = ({
  enabled,
  onToggle,
  disabled,
}: {
  enabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={enabled}
    onClick={onToggle}
    disabled={disabled}
    className={`relative h-7 w-12 rounded-full border transition-all ${enabled
      ? 'border-emerald-zenith-primary/60 bg-emerald-zenith-primary/35'
      : 'border-emerald-900/30 bg-emerald-zenith-surface-high/50'
    } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
  >
    <span
      className={`absolute top-0.5 h-5.5 w-5.5 rounded-full bg-emerald-zenith-text shadow transition-transform ${enabled ? 'translate-x-6' : 'translate-x-0.5'
      }`}
    />
  </button>
);

export default function SettingsPage() {
  const navigate = useNavigate();
  const storedSession = getStoredAuthSession();

  const initialProfile = useMemo<ProfileForm>(() => ({
    name: storedSession ? `${storedSession.user.firstName} ${storedSession.user.lastName}`.trim() : '',
    email: storedSession?.user.email ?? '',
  }), [storedSession]);

  const [profile, setProfile] = useState<ProfileForm>(initialProfile);
  const [password, setPassword] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [preferences, setPreferences] = useState<PreferenceForm>({
    monthlyBudget: '',
    currency: 'USD',
  });
  const [initialPreferences, setInitialPreferences] = useState<PreferenceForm>({
    monthlyBudget: '',
    currency: 'USD',
  });
  const [notifications, setNotifications] = useState<NotificationForm>({
    budgetWarnings: true,
    overspendingAlerts: true,
  });
  const [initialNotifications, setInitialNotifications] = useState<NotificationForm>({
    budgetWarnings: true,
    overspendingAlerts: true,
  });

  const [profileErrors, setProfileErrors] = useState<FieldErrors>({});
  const [passwordErrors, setPasswordErrors] = useState<FieldErrors>({});
  const [preferenceErrors, setPreferenceErrors] = useState<FieldErrors>({});

  const [profileStatus, setProfileStatus] = useState<ActionStatus>(null);
  const [passwordStatus, setPasswordStatus] = useState<ActionStatus>(null);
  const [preferenceStatus, setPreferenceStatus] = useState<ActionStatus>(null);
  const [dangerStatus, setDangerStatus] = useState<ActionStatus>(null);

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const isProfileDirty = profile.name.trim() !== initialProfile.name.trim()
    || profile.email.trim() !== initialProfile.email.trim();

  const isPasswordDirty = !!(
    password.currentPassword
    || password.newPassword
    || password.confirmPassword
  );

  const isPreferenceDirty = preferences.monthlyBudget.trim() !== initialPreferences.monthlyBudget.trim()
    || preferences.currency !== initialPreferences.currency;

  const isNotificationDirty = notifications.budgetWarnings !== initialNotifications.budgetWarnings
    || notifications.overspendingAlerts !== initialNotifications.overspendingAlerts;

  const handleProfileSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProfileStatus(null);

    const validationErrors = validateProfile(profile);
    setProfileErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setProfileStatus({ type: 'error', message: 'Please fix profile errors before saving.' });
      return;
    }

    if (!isProfileDirty) {
      return;
    }

    setIsSavingProfile(true);

    try {
      setProfileStatus({ type: 'success', message: 'Profile settings saved. Ready for backend integration.' });
    } catch {
      setProfileStatus({ type: 'error', message: 'Unable to save profile right now.' });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordStatus(null);

    const validationErrors = validatePassword(password);
    setPasswordErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setPasswordStatus({ type: 'error', message: 'Please fix password errors before saving.' });
      return;
    }

    if (!isPasswordDirty) {
      return;
    }

    setIsSavingPassword(true);

    try {
      setPassword({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordStatus({ type: 'success', message: 'Password updated. Ready for backend integration.' });
    } catch {
      setPasswordStatus({ type: 'error', message: 'Unable to update password right now.' });
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handlePreferencesSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPreferenceStatus(null);

    const validationErrors = validateBudget(preferences);
    setPreferenceErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setPreferenceStatus({ type: 'error', message: 'Please fix preference errors before saving.' });
      return;
    }

    if (!isPreferenceDirty) {
      return;
    }

    setIsSavingPreferences(true);

    try {
      setInitialPreferences(preferences);
      setPreferenceStatus({ type: 'success', message: 'Budget preferences saved locally.' });
    } catch {
      setPreferenceStatus({ type: 'error', message: 'Unable to save preferences right now.' });
    } finally {
      setIsSavingPreferences(false);
    }
  };

  const handleNotificationsSave = async () => {
    setPreferenceStatus(null);

    if (!isNotificationDirty) {
      return;
    }

    setIsSavingNotifications(true);

    try {
      setInitialNotifications(notifications);
      setPreferenceStatus({ type: 'success', message: 'Notification preferences saved locally.' });
    } catch {
      setPreferenceStatus({ type: 'error', message: 'Unable to save notification settings right now.' });
    } finally {
      setIsSavingNotifications(false);
    }
  };

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setDangerStatus(null);
    setIsLoggingOut(true);

    try {
      await logout();
    } catch {
      clearAuthSession();
    } finally {
      navigate('/login', { replace: true, state: { notice: 'You have been logged out.' } });
      setIsLoggingOut(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText.trim().toUpperCase() !== 'DELETE') {
      return;
    }

    setIsDeletingAccount(true);
    setDangerStatus(null);

    try {
      clearAuthSession();
      navigate('/login', {
        replace: true,
        state: { notice: 'Account deletion flow will be connected to backend next.' },
      });
    } catch {
      setDangerStatus({ type: 'error', message: 'Unable to process account deletion right now.' });
    } finally {
      setIsDeletingAccount(false);
      setIsDeleteModalOpen(false);
      setDeleteConfirmText('');
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-5 md:px-6 lg:px-8 lg:py-7">
      <section className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-emerald-zenith-text md:text-4xl">Settings</h1>
        <p className="text-sm text-emerald-zenith-text-muted md:text-base">
          Manage your account details and essential preferences.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <section className={sectionClassName}>
          <SectionHeader
            title="Profile Settings"
            subtitle="Update your name and email used in your account."
            icon={UserRound}
          />

          <form className="space-y-4" onSubmit={handleProfileSave}>
            <div>
              <label className="text-sm font-semibold text-emerald-zenith-text" htmlFor="settings-name">Name</label>
              <input
                id="settings-name"
                value={profile.name}
                onChange={(event) => {
                  setProfile((current) => ({ ...current, name: event.target.value }));
                  setProfileErrors((current) => ({ ...current, name: '' }));
                }}
                className={`${inputClassName} mt-1.5`}
                placeholder="Your full name"
              />
              <FieldError message={profileErrors.name} />
            </div>

            <div>
              <label className="text-sm font-semibold text-emerald-zenith-text" htmlFor="settings-email">Email</label>
              <input
                id="settings-email"
                type="email"
                value={profile.email}
                onChange={(event) => {
                  setProfile((current) => ({ ...current, email: event.target.value }));
                  setProfileErrors((current) => ({ ...current, email: '' }));
                }}
                className={`${inputClassName} mt-1.5`}
                placeholder="name@company.com"
              />
              <FieldError message={profileErrors.email} />
            </div>

            {profileStatus && (
              <p className={`rounded-xl border px-3 py-2 text-sm ${profileStatus.type === 'success'
                ? 'border-emerald-zenith-primary/35 bg-emerald-zenith-primary/10 text-emerald-zenith-primary'
                : 'border-emerald-zenith-error/35 bg-emerald-zenith-error/10 text-emerald-zenith-error'
              }`}>
                {profileStatus.message}
              </p>
            )}

            <button
              type="submit"
              disabled={!isProfileDirty || isSavingProfile}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-zenith-primary px-4 py-2.5 text-sm font-black text-emerald-zenith-accent shadow-md shadow-emerald-950/10 transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Save className="h-4 w-4" />
              {isSavingProfile ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </section>

        <section className={sectionClassName}>
          <SectionHeader
            title="Password & Security"
            subtitle="Keep your account secure by using a strong password."
            icon={Lock}
          />

          <form className="space-y-4" onSubmit={handlePasswordSave}>
            <div>
              <label className="text-sm font-semibold text-emerald-zenith-text" htmlFor="current-password">Current Password</label>
              <input
                id="current-password"
                type="password"
                value={password.currentPassword}
                onChange={(event) => {
                  setPassword((current) => ({ ...current, currentPassword: event.target.value }));
                  setPasswordErrors((current) => ({ ...current, currentPassword: '' }));
                }}
                className={`${inputClassName} mt-1.5`}
                placeholder="Enter current password"
              />
              <FieldError message={passwordErrors.currentPassword} />
            </div>

            <div>
              <label className="text-sm font-semibold text-emerald-zenith-text" htmlFor="new-password">New Password</label>
              <input
                id="new-password"
                type="password"
                value={password.newPassword}
                onChange={(event) => {
                  setPassword((current) => ({ ...current, newPassword: event.target.value }));
                  setPasswordErrors((current) => ({ ...current, newPassword: '' }));
                }}
                className={`${inputClassName} mt-1.5`}
                placeholder="At least 8 characters"
              />
              <FieldError message={passwordErrors.newPassword} />
            </div>

            <div>
              <label className="text-sm font-semibold text-emerald-zenith-text" htmlFor="confirm-password">Confirm New Password</label>
              <input
                id="confirm-password"
                type="password"
                value={password.confirmPassword}
                onChange={(event) => {
                  setPassword((current) => ({ ...current, confirmPassword: event.target.value }));
                  setPasswordErrors((current) => ({ ...current, confirmPassword: '' }));
                }}
                className={`${inputClassName} mt-1.5`}
                placeholder="Re-enter new password"
              />
              <FieldError message={passwordErrors.confirmPassword} />
            </div>

            {passwordStatus && (
              <p className={`rounded-xl border px-3 py-2 text-sm ${passwordStatus.type === 'success'
                ? 'border-emerald-zenith-primary/35 bg-emerald-zenith-primary/10 text-emerald-zenith-primary'
                : 'border-emerald-zenith-error/35 bg-emerald-zenith-error/10 text-emerald-zenith-error'
              }`}>
                {passwordStatus.message}
              </p>
            )}

            <button
              type="submit"
              disabled={!isPasswordDirty || isSavingPassword}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-zenith-primary px-4 py-2.5 text-sm font-black text-emerald-zenith-accent shadow-md shadow-emerald-950/10 transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
            >
              <ShieldAlert className="h-4 w-4" />
              {isSavingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </section>

        <section className={sectionClassName}>
          <SectionHeader
            title="Budget Preferences"
            subtitle="Set a default monthly budget and your preferred currency."
            icon={PiggyBank}
          />

          <form className="space-y-4" onSubmit={handlePreferencesSave}>
            <div>
              <label className="text-sm font-semibold text-emerald-zenith-text" htmlFor="default-budget">Default Monthly Budget (optional)</label>
              <input
                id="default-budget"
                value={preferences.monthlyBudget}
                onChange={(event) => {
                  setPreferences((current) => ({ ...current, monthlyBudget: event.target.value }));
                  setPreferenceErrors((current) => ({ ...current, monthlyBudget: '' }));
                }}
                className={`${inputClassName} mt-1.5`}
                placeholder="e.g. 2000"
                inputMode="decimal"
              />
              <FieldError message={preferenceErrors.monthlyBudget} />
            </div>

            <div>
              <label className="text-sm font-semibold text-emerald-zenith-text" htmlFor="currency">Preferred Currency</label>
              <select
                id="currency"
                value={preferences.currency}
                onChange={(event) => {
                  setPreferences((current) => ({ ...current, currency: event.target.value }));
                  setPreferenceErrors((current) => ({ ...current, currency: '' }));
                }}
                className={`${inputClassName} mt-1.5`}
              >
                {CURRENCIES.map((currency) => (
                  <option key={currency} value={currency} className="bg-emerald-zenith-surface text-emerald-zenith-text">
                    {currency}
                  </option>
                ))}
              </select>
              <FieldError message={preferenceErrors.currency} />
            </div>

            {preferenceStatus && (
              <p className={`rounded-xl border px-3 py-2 text-sm ${preferenceStatus.type === 'success'
                ? 'border-emerald-zenith-primary/35 bg-emerald-zenith-primary/10 text-emerald-zenith-primary'
                : 'border-emerald-zenith-error/35 bg-emerald-zenith-error/10 text-emerald-zenith-error'
              }`}>
                {preferenceStatus.message}
              </p>
            )}

            <button
              type="submit"
              disabled={!isPreferenceDirty || isSavingPreferences}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-zenith-primary px-4 py-2.5 text-sm font-black text-emerald-zenith-accent shadow-md shadow-emerald-950/10 transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Save className="h-4 w-4" />
              {isSavingPreferences ? 'Saving...' : 'Save Budget Preferences'}
            </button>
          </form>
        </section>

        <section className={sectionClassName}>
          <SectionHeader
            title="Notification Preferences"
            subtitle="Decide how FinTrack alerts you about spending activity."
            icon={BellRing}
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-emerald-900/20 bg-emerald-zenith-surface-high/35 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-emerald-zenith-text">Budget Warning Alerts</p>
                <p className="text-xs text-emerald-zenith-text-muted">Notify when spending reaches 80% of budget.</p>
              </div>
              <ToggleSwitch
                enabled={notifications.budgetWarnings}
                onToggle={() => setNotifications((current) => ({ ...current, budgetWarnings: !current.budgetWarnings }))}
              />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-emerald-900/20 bg-emerald-zenith-surface-high/35 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-emerald-zenith-text">Overspending Alerts</p>
                <p className="text-xs text-emerald-zenith-text-muted">Notify when spending exceeds your monthly budget.</p>
              </div>
              <ToggleSwitch
                enabled={notifications.overspendingAlerts}
                onToggle={() => setNotifications((current) => ({ ...current, overspendingAlerts: !current.overspendingAlerts }))}
              />
            </div>

            <button
              type="button"
              onClick={handleNotificationsSave}
              disabled={!isNotificationDirty || isSavingNotifications}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-zenith-primary px-4 py-2.5 text-sm font-black text-emerald-zenith-accent shadow-md shadow-emerald-950/10 transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Save className="h-4 w-4" />
              {isSavingNotifications ? 'Saving...' : 'Save Notification Preferences'}
            </button>
          </div>
        </section>
      </div>

      <section className={`${sectionClassName} border-emerald-zenith-error/30`}>
        <SectionHeader
          title="Danger Zone"
          subtitle="Sensitive account actions. Proceed carefully."
          icon={CircleAlert}
        />

        {dangerStatus && (
          <p className={`mb-4 rounded-xl border px-3 py-2 text-sm ${dangerStatus.type === 'success'
            ? 'border-emerald-zenith-primary/35 bg-emerald-zenith-primary/10 text-emerald-zenith-primary'
            : 'border-emerald-zenith-error/35 bg-emerald-zenith-error/10 text-emerald-zenith-error'
          }`}>
            {dangerStatus.message}
          </p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-900/25 bg-emerald-zenith-surface-high/35 px-4 py-2.5 text-sm font-semibold text-emerald-zenith-text transition-colors hover:border-emerald-zenith-primary/35 hover:text-emerald-zenith-primary disabled:cursor-not-allowed disabled:opacity-45"
          >
            <LogOut className="h-4 w-4" />
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>

          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-zenith-error/40 bg-emerald-zenith-error/10 px-4 py-2.5 text-sm font-semibold text-emerald-zenith-error transition-colors hover:bg-emerald-zenith-error/18"
          >
            <Trash2 className="h-4 w-4" />
            Delete Account
          </button>
        </div>
      </section>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-emerald-zenith-error/35 bg-emerald-zenith-surface p-5 shadow-2xl shadow-black/35">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-emerald-zenith-text">Delete account</h3>
                <p className="mt-1 text-sm text-emerald-zenith-text-muted">
                  This action is irreversible after backend integration.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteConfirmText('');
                }}
                className="rounded-lg border border-emerald-900/25 p-1.5 text-emerald-zenith-text-muted hover:text-emerald-zenith-text"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-sm text-emerald-zenith-text-muted">
              Type <span className="font-bold text-emerald-zenith-text">DELETE</span> to confirm.
            </p>

            <input
              value={deleteConfirmText}
              onChange={(event) => setDeleteConfirmText(event.target.value)}
              className={`${inputClassName} mt-2`}
              placeholder="DELETE"
            />

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteConfirmText('');
                }}
                className="rounded-xl border border-emerald-900/25 bg-emerald-zenith-surface-high/35 px-4 py-2 text-sm font-semibold text-emerald-zenith-text"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText.trim().toUpperCase() !== 'DELETE' || isDeletingAccount}
                className="rounded-xl border border-emerald-zenith-error/45 bg-emerald-zenith-error/10 px-4 py-2 text-sm font-semibold text-emerald-zenith-error disabled:cursor-not-allowed disabled:opacity-45"
              >
                {isDeletingAccount ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
