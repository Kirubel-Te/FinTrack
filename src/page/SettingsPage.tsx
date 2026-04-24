import { useMemo, useState } from 'react';
import {
  BellRing,
  CircleAlert,
  LogOut,
  Lock,
  Save,
  ShieldAlert,
  Trash2,
  UserRound,
  X,
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router';
import {
  clearAuthSession,
  deleteAccount,
  getStoredAuthSession,
  logout,
  updatePassword,
  updateProfile,
} from '../api/auth';
import { Reveal } from '../components/Reveal';
import {
  getNotificationPreferences,
  saveNotificationPreferences,
  type NotificationPreferences,
} from '../lib/notificationPreferences';

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

type NotificationForm = NotificationPreferences;

type SettingsSection = 'profile' | 'security' | 'notifications' | 'danger';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SETTINGS_SECTIONS: Array<{
  key: SettingsSection;
  label: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    key: 'profile',
    label: 'Profile',
    hint: 'Name and email details',
    icon: UserRound,
  },
  {
    key: 'security',
    label: 'Security',
    hint: 'Password and account safety',
    icon: Lock,
  },
  {
    key: 'notifications',
    label: 'Notifications',
    hint: 'Alert preferences',
    icon: BellRing,
  },
  {
    key: 'danger',
    label: 'Danger Zone',
    hint: 'Logout and delete account',
    icon: CircleAlert,
  },
];

const sectionClassName = 'rounded-2xl border border-emerald-900/20 bg-emerald-zenith-surface/60 p-6 shadow-lg shadow-emerald-950/10 backdrop-blur-sm';
const inputClassName = 'w-full rounded-xl border border-emerald-900/20 bg-emerald-zenith-surface-high/40 px-4 py-2.5 text-sm text-emerald-zenith-text placeholder:text-emerald-zenith-text-muted/45 outline-none transition-all focus:border-emerald-zenith-primary/45 focus:ring-2 focus:ring-emerald-zenith-primary/20';

const isSettingsSection = (value: string | null): value is SettingsSection => (
  value === 'profile'
  || value === 'security'
  || value === 'notifications'
  || value === 'danger'
);

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

const splitFullName = (value: string): { firstName: string; lastName: string } => {
  const normalized = value.trim().replace(/\s+/g, ' ');
  const [firstName = '', ...rest] = normalized.split(' ');

  return {
    firstName,
    lastName: rest.join(' '),
  };
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
    className={`relative h-7 w-12 overflow-hidden rounded-full border transition-all ${enabled
      ? 'border-emerald-zenith-primary/60 bg-emerald-zenith-primary/35'
      : 'border-emerald-900/30 bg-emerald-zenith-surface-high/50'
    } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
  >
    <span
      className={`absolute left-0.5 top-0.5 h-5.5 w-5.5 rounded-full bg-emerald-zenith-text shadow transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
);

export default function SettingsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const storedSession = getStoredAuthSession();

  const initialProfile = useMemo<ProfileForm>(() => ({
    name: storedSession ? `${storedSession.user.firstName} ${storedSession.user.lastName}`.trim() : '',
    email: storedSession?.user.email ?? '',
  }), [storedSession]);

  const [profile, setProfile] = useState<ProfileForm>(initialProfile);
  const [savedProfile, setSavedProfile] = useState<ProfileForm>(initialProfile);
  const [password, setPassword] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const initialNotificationPreferences = useMemo<NotificationForm>(
    () => getNotificationPreferences(),
    [],
  );

  const [notifications, setNotifications] = useState<NotificationForm>(initialNotificationPreferences);
  const [initialNotifications, setInitialNotifications] = useState<NotificationForm>(initialNotificationPreferences);

  const [profileErrors, setProfileErrors] = useState<FieldErrors>({});
  const [passwordErrors, setPasswordErrors] = useState<FieldErrors>({});

  const [profileStatus, setProfileStatus] = useState<ActionStatus>(null);
  const [passwordStatus, setPasswordStatus] = useState<ActionStatus>(null);
  const [preferenceStatus, setPreferenceStatus] = useState<ActionStatus>(null);
  const [dangerStatus, setDangerStatus] = useState<ActionStatus>(null);

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const sectionParam = searchParams.get('section');
  const activeSection: SettingsSection = isSettingsSection(sectionParam)
    ? sectionParam
    : 'profile';

  const isProfileDirty = profile.name.trim() !== savedProfile.name.trim()
    || profile.email.trim() !== savedProfile.email.trim();

  const isPasswordDirty = !!(
    password.currentPassword
    || password.newPassword
    || password.confirmPassword
  );

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
      const { firstName, lastName } = splitFullName(profile.name);
      const updatedUser = await updateProfile({
        firstName,
        lastName,
        email: profile.email.trim(),
      });

      const updatedProfile: ProfileForm = {
        name: `${updatedUser.firstName} ${updatedUser.lastName}`.trim(),
        email: updatedUser.email,
      };

      setProfile(updatedProfile);
      setSavedProfile(updatedProfile);
      setProfileStatus({ type: 'success', message: 'Profile settings saved successfully.' });
    } catch (error) {
      setProfileStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Unable to save profile right now.',
      });
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
      await updatePassword({
        currentPassword: password.currentPassword,
        newPassword: password.newPassword,
      });
      setPassword({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordStatus({ type: 'success', message: 'Password updated successfully.' });
    } catch (error) {
      setPasswordStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Unable to update password right now.',
      });
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleNotificationsSave = async () => {
    setPreferenceStatus(null);

    if (!isNotificationDirty) {
      return;
    }

    setIsSavingNotifications(true);

    try {
      saveNotificationPreferences(notifications);
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
      const successMessage = await deleteAccount();
      setIsDeleteModalOpen(false);
      setDeleteConfirmText('');
      navigate('/login', {
        replace: true,
        state: { notice: successMessage },
      });
    } catch (error) {
      setDangerStatus({
        type: 'error',
        message: error instanceof Error
          ? error.message
          : 'Unable to process account deletion right now.',
      });
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const handleSectionChange = (section: SettingsSection) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set('section', section);
    setSearchParams(nextSearchParams, { replace: true });
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'profile':
        return (
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
        );
      case 'security':
        return (
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
        );
      case 'notifications':
        return (
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

              {preferenceStatus && (
                <p className={`rounded-xl border px-3 py-2 text-sm ${preferenceStatus.type === 'success'
                  ? 'border-emerald-zenith-primary/35 bg-emerald-zenith-primary/10 text-emerald-zenith-primary'
                  : 'border-emerald-zenith-error/35 bg-emerald-zenith-error/10 text-emerald-zenith-error'
                }`}>
                  {preferenceStatus.message}
                </p>
              )}

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
        );
      case 'danger':
        return (
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
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-5 lg:p-6 space-y-7 lg:space-y-8 max-w-7xl mx-auto w-full">
      <Reveal delay={0.04}>
        <section className="dashboard-page-header">
          <h1 className="dashboard-page-title">Settings</h1>
          <p className="dashboard-page-subtitle">
            Choose a settings category to manage each form separately.
          </p>
        </section>
      </Reveal>

      <div className="grid grid-cols-1 gap-4 xl:gap-5 lg:grid-cols-[270px_minmax(0,1fr)]">
        <Reveal delay={0.1}>
          <aside className={`${sectionClassName} h-fit lg:sticky lg:top-6`}>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-emerald-zenith-text-muted">
              Settings Navigation
            </p>
            <div className="space-y-2">
              {SETTINGS_SECTIONS.map((section) => {
                const Icon = section.icon;
                const isActive = section.key === activeSection;
                return (
                  <button
                    key={section.key}
                    type="button"
                    onClick={() => handleSectionChange(section.key)}
                    className={`w-full rounded-xl border px-4 py-3 text-left transition-all ${isActive
                      ? 'border-emerald-zenith-primary/45 bg-emerald-zenith-primary/12 text-emerald-zenith-primary shadow-sm shadow-emerald-950/10'
                      : 'border-emerald-900/20 bg-emerald-zenith-surface-high/25 text-emerald-zenith-text hover:border-emerald-zenith-primary/35 hover:text-emerald-zenith-primary'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-semibold">{section.label}</span>
                    </div>
                    <p className="mt-1 text-xs text-emerald-zenith-text-muted">{section.hint}</p>
                  </button>
                );
              })}
            </div>
          </aside>
        </Reveal>

        <Reveal key={activeSection} delay={0.14}>
          <div>{renderActiveSection()}</div>
        </Reveal>
      </div>

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
