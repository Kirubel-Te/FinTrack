export type NotificationPreferences = {
  budgetWarnings: boolean;
  overspendingAlerts: boolean;
};

export const NOTIFICATION_PREFERENCES_STORAGE_KEY = 'fintrack.notificationPreferences';
export const NOTIFICATION_PREFERENCES_EVENT = 'fintrack:notification-preferences-updated';

const DEFAULT_PREFERENCES: NotificationPreferences = {
  budgetWarnings: true,
  overspendingAlerts: true,
};

const isBrowser = typeof window !== 'undefined';

const getLocalStorage = () => (isBrowser ? window.localStorage : null);

export const getNotificationPreferences = (): NotificationPreferences => {
  const storage = getLocalStorage();
  if (!storage) {
    return DEFAULT_PREFERENCES;
  }

  try {
    const raw = storage.getItem(NOTIFICATION_PREFERENCES_STORAGE_KEY);
    if (!raw) {
      return DEFAULT_PREFERENCES;
    }

    const parsed = JSON.parse(raw) as Partial<NotificationPreferences>;
    return {
      budgetWarnings: parsed.budgetWarnings ?? DEFAULT_PREFERENCES.budgetWarnings,
      overspendingAlerts: parsed.overspendingAlerts ?? DEFAULT_PREFERENCES.overspendingAlerts,
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
};

export const saveNotificationPreferences = (value: NotificationPreferences) => {
  const storage = getLocalStorage();
  if (!storage) {
    return;
  }

  try {
    storage.setItem(NOTIFICATION_PREFERENCES_STORAGE_KEY, JSON.stringify(value));
    window.dispatchEvent(new Event(NOTIFICATION_PREFERENCES_EVENT));
  } catch {
    // Ignore storage write failures.
  }
};
