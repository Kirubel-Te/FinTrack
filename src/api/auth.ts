export const AUTH_STORAGE_KEY = 'fintrack.auth';
export const AUTH_TOKEN_STORAGE_KEY = 'fintrack.token';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export type AuthResponse = {
  message?: string;
  token?: string;
  user?: unknown;
  [key: string]: unknown;
};

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
    || normalizedMessage.includes('unauthorized')
  ) {
    return 'Incorrect email or password.';
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

const parseResponseBody = async (response: Response): Promise<AuthResponse> => {
  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    return (await response.json()) as AuthResponse;
  }

  const text = await response.text();
  return text ? { message: text } : {};
};

const getErrorMessage = (payload: AuthResponse, fallback: string, statusCode: number) => {
  if (statusCode >= 500) {
    return fallback;
  }

  if (statusCode === 429) {
    return 'Too many attempts. Please try again in a moment.';
  }

  if (typeof payload.message === 'string' && payload.message.trim()) {
    return toUserFriendlyAuthError(payload.message, fallback);
  }

  const error = payload.error;
  if (typeof error === 'string' && error.trim()) {
    return toUserFriendlyAuthError(error, fallback);
  }

  return fallback;
};

const postAuth = async <TBody extends Record<string, unknown>>(
  path: string,
  body: TBody,
): Promise<AuthResponse> => {
  const fallbacks = getAuthErrorFallbacks(path);
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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

export const login = (payload: LoginPayload) => postAuth('/api/auth/login', payload);

export const register = (payload: RegisterPayload) => postAuth('/api/v1/auth/register', payload);