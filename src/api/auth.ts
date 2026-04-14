export const AUTH_STORAGE_KEY = 'fintrack.auth';
export const AUTH_TOKEN_STORAGE_KEY = 'fintrack.token';
export const AUTH_REFRESH_TOKEN_STORAGE_KEY = 'fintrack.refreshToken';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

export type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthSession = AuthTokens & {
  user: AuthUser;
};

export type ApiSuccessResponse<TData> = {
  success: true;
  data: TData;
};

type AuthErrorResponse = {
  success?: false;
  message?: string;
  error?: string;
};

type AuthResponse = AuthSession | ApiSuccessResponse<AuthTokens> | AuthErrorResponse;

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

const isBrowser = typeof window !== 'undefined';

const getLocalStorage = () => (isBrowser ? window.localStorage : null);

const safeReadStorage = (key: string): string | null => {
  const storage = getLocalStorage();
  if (!storage) {
    return null;
  }

  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
};

const safeWriteStorage = (key: string, value: string) => {
  const storage = getLocalStorage();
  if (!storage) {
    return;
  }

  try {
    storage.setItem(key, value);
  } catch {
    // Ignore storage write failures.
  }
};

const safeRemoveStorage = (key: string) => {
  const storage = getLocalStorage();
  if (!storage) {
    return;
  }

  try {
    storage.removeItem(key);
  } catch {
    // Ignore storage cleanup failures.
  }
};

type AuthErrorFallbacks = {
  generic: string;
  server: string;
  network: string;
};

const getAuthErrorFallbacks = (path: string): AuthErrorFallbacks => {
  const normalizedPath = path.toLowerCase();

  if (normalizedPath.includes('/login')) {
    return {
      generic: "Can't log in right now. Please try again later.",
      server: "Can't log in right now. Please try again later.",
      network: "Can't log in right now. Check your internet and try again.",
    };
  }

  if (normalizedPath.includes('/register')) {
    return {
      generic: "Can't register right now. Please try again later.",
      server: "Can't register right now. Please try again later.",
      network: "Can't register right now. Check your internet and try again.",
    };
  }

  return {
    generic: 'Unable to continue right now. Please try again later.',
    server: 'Something went wrong on our side. Please try again later.',
    network: 'Unable to connect right now. Check your internet and try again.',
  };
};

const simplifyAuthErrorMessage = (message: string, fallback: string): string => {
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes('cannot post') || normalizedMessage.includes('cannot get')) {
    return fallback;
  }

  if (
    normalizedMessage.includes('invalid credentials')
    || normalizedMessage.includes('invalid email or password')
    || normalizedMessage.includes('email or password is incorrect')
    || normalizedMessage.includes('invalid token')
    || normalizedMessage.includes('expired token')
    || normalizedMessage.includes('unauthorized')
  ) {
    return 'Your session is invalid. Please log in again.';
  }

  if (
    normalizedMessage.includes('already exists')
    || normalizedMessage.includes('email exists')
    || normalizedMessage.includes('email is already in use')
    || normalizedMessage.includes('duplicate')
  ) {
    return 'An account with this email already exists.';
  }

  if (
    normalizedMessage.includes('password')
    && (
      normalizedMessage.includes('weak')
      || normalizedMessage.includes('short')
      || normalizedMessage.includes('at least')
      || normalizedMessage.includes('must contain')
    )
  ) {
    return 'Please use a stronger password.';
  }

  if (normalizedMessage.includes('too many requests') || normalizedMessage.includes('rate limit')) {
    return 'Too many attempts. Please try again in a moment.';
  }

  if (
    normalizedMessage.includes('networkerror')
    || normalizedMessage.includes('failed to fetch')
    || normalizedMessage.includes('network request failed')
  ) {
    return 'Unable to connect right now. Check your internet and try again.';
  }

  if (
    normalizedMessage.includes('internal server error')
    || normalizedMessage.includes('server error')
    || normalizedMessage.includes('bad gateway')
    || normalizedMessage.includes('service unavailable')
  ) {
    return 'Something went wrong on our side. Please try again.';
  }

  if (normalizedMessage.includes('not found')) {
    return 'Service is temporarily unavailable. Please try again.';
  }

  return message || fallback;
};

export const sanitizeErrorMessage = (value: unknown, fallback: string): string => {
  if (typeof value !== 'string') {
    return fallback;
  }

  const rawMessage = value.trim();
  if (!rawMessage) {
    return fallback;
  }

  if (!rawMessage.includes('<') || !rawMessage.includes('>')) {
    return rawMessage;
  }

  const doc = new DOMParser().parseFromString(rawMessage, 'text/html');
  const cleanText = doc.body.textContent?.replace(/\s+/g, ' ').trim() ?? '';

  return cleanText || fallback;
};

export const toUserFriendlyAuthError = (value: unknown, fallback: string): string => {
  const sanitizedMessage = sanitizeErrorMessage(value, fallback);
  return simplifyAuthErrorMessage(sanitizedMessage, fallback);
};

const isObject = (value: unknown): value is Record<string, unknown> => (
  typeof value === 'object' && value !== null
);

const isAuthSession = (payload: unknown): payload is AuthSession => {
  if (!isObject(payload) || !isObject(payload.user)) {
    return false;
  }

  return typeof payload.accessToken === 'string' && typeof payload.refreshToken === 'string';
};

const parseResponseBody = async (response: Response): Promise<AuthResponse> => {
  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    return (await response.json()) as AuthResponse;
  }

  const text = await response.text();
  return text ? { message: text } : { message: '' };
};

const getErrorMessage = (payload: AuthResponse, fallback: string, statusCode: number) => {
  if (statusCode >= 500) {
    return fallback;
  }

  if (statusCode === 429) {
    return 'Too many attempts. Please try again in a moment.';
  }

  const payloadRecord: Record<string, unknown> | null = isObject(payload) ? payload : null;
  const payloadMessage = payloadRecord?.['message'];

  if (typeof payloadMessage === 'string' && payloadMessage.trim()) {
    return toUserFriendlyAuthError(payloadMessage, fallback);
  }

  const error = payloadRecord?.['error'];
  if (typeof error === 'string' && error.trim()) {
    return toUserFriendlyAuthError(error, fallback);
  }

  return fallback;
};

export const getStoredAuthSession = (): AuthSession | null => {
  const sessionValue = safeReadStorage(AUTH_STORAGE_KEY);
  if (!sessionValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(sessionValue) as unknown;
    if (isAuthSession(parsed)) {
      return parsed;
    }
  } catch {
    // Ignore malformed session payloads.
  }

  return null;
};

export const getStoredAccessToken = (): string | null => {
  const explicitToken = safeReadStorage(AUTH_TOKEN_STORAGE_KEY);
  if (explicitToken) {
    return explicitToken;
  }

  return getStoredAuthSession()?.accessToken ?? null;
};

export const getStoredRefreshToken = (): string | null => {
  const explicitToken = safeReadStorage(AUTH_REFRESH_TOKEN_STORAGE_KEY);
  if (explicitToken) {
    return explicitToken;
  }

  return getStoredAuthSession()?.refreshToken ?? null;
};

export const persistAuthSession = (session: AuthSession) => {
  safeWriteStorage(AUTH_STORAGE_KEY, JSON.stringify(session));
  safeWriteStorage(AUTH_TOKEN_STORAGE_KEY, session.accessToken);
  safeWriteStorage(AUTH_REFRESH_TOKEN_STORAGE_KEY, session.refreshToken);
};

export const updateStoredTokens = (tokens: AuthTokens) => {
  const existingSession = getStoredAuthSession();

  safeWriteStorage(AUTH_TOKEN_STORAGE_KEY, tokens.accessToken);
  safeWriteStorage(AUTH_REFRESH_TOKEN_STORAGE_KEY, tokens.refreshToken);

  if (existingSession) {
    safeWriteStorage(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        ...existingSession,
        ...tokens,
      }),
    );
  }
};

export const clearAuthSession = () => {
  safeRemoveStorage(AUTH_STORAGE_KEY);
  safeRemoveStorage(AUTH_TOKEN_STORAGE_KEY);
  safeRemoveStorage(AUTH_REFRESH_TOKEN_STORAGE_KEY);
};

export const getAuthApiBaseUrl = () => API_BASE_URL;

const postAuth = async <TBody extends Record<string, unknown>>(
  path: string,
  body: TBody,
): Promise<AuthResponse> => {
  const fallbacks = getAuthErrorFallbacks(path);
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        Pragma: 'no-cache',
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    throw new Error(toUserFriendlyAuthError(error instanceof Error ? error.message : error, fallbacks.network));
  }

  const payload = await parseResponseBody(response);

  if (!response.ok) {
    const fallbackForStatus = response.status >= 500 ? fallbacks.server : fallbacks.generic;
    throw new Error(getErrorMessage(payload, fallbackForStatus, response.status));
  }

  return payload;
};

const getProtectedAuth = async <TResponse>(path: string, allowRetry = true): Promise<TResponse> => {
  const token = getStoredAccessToken();
  const fallbacks = getAuthErrorFallbacks(path);
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-store',
        Pragma: 'no-cache',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  } catch (error) {
    throw new Error(toUserFriendlyAuthError(error instanceof Error ? error.message : error, fallbacks.network));
  }

  const payload = await parseResponseBody(response);

  if (response.status === 401 && allowRetry) {
    try {
      await refreshSession();
      return getProtectedAuth<TResponse>(path, false);
    } catch {
      clearAuthSession();
    }
  }

  if (!response.ok) {
    const fallbackForStatus = response.status >= 500 ? fallbacks.server : fallbacks.generic;
    throw new Error(getErrorMessage(payload, fallbackForStatus, response.status));
  }

  return payload as TResponse;
};

const normalizeAuthSession = (payload: AuthResponse): AuthSession => {
  if (!isAuthSession(payload)) {
    throw new Error('Unexpected authentication response. Please try again.');
  }

  return payload;
};

const unwrapTokenResponse = (payload: AuthResponse): AuthTokens => {
  const payloadRecord: Record<string, unknown> | null = isObject(payload) ? payload : null;

  if (payloadRecord?.success === true && isObject(payloadRecord.data)) {
    const maybeData = payloadRecord.data;
    if (typeof maybeData.accessToken === 'string' && typeof maybeData.refreshToken === 'string') {
      return {
        accessToken: maybeData.accessToken,
        refreshToken: maybeData.refreshToken,
      };
    }
  }

  throw new Error('Unexpected token response. Please log in again.');
};

export const healthCheck = async (): Promise<unknown> => {
  const response = await fetch(`${API_BASE_URL}/`, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-store',
      Pragma: 'no-cache',
    },
  });
  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
};

export const login = async (payload: LoginPayload): Promise<AuthSession> => {
  const response = await postAuth('/api/v1/auth/login', payload);
  const session = normalizeAuthSession(response);
  persistAuthSession(session);
  return session;
};

export const register = async (payload: RegisterPayload): Promise<AuthSession> => {
  const response = await postAuth('/api/v1/auth/register', payload);
  const session = normalizeAuthSession(response);
  persistAuthSession(session);
  return session;
};

export const refreshSession = async (refreshToken?: string): Promise<AuthTokens> => {
  const resolvedToken = refreshToken ?? getStoredRefreshToken();

  if (!resolvedToken) {
    throw new Error('Session refresh token is missing.');
  }

  const response = await postAuth('/api/v1/auth/refresh', { refreshToken: resolvedToken });
  const tokens = unwrapTokenResponse(response);
  updateStoredTokens(tokens);
  return tokens;
};

export const getMe = () => getProtectedAuth<AuthUser>('/api/v1/auth/me');

export const logout = async () => {
  const refreshToken = getStoredRefreshToken();

  if (!refreshToken) {
    clearAuthSession();
    return;
  }

  try {
    await postAuth('/api/v1/auth/logout', { refreshToken });
  } finally {
    clearAuthSession();
  }
};