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

const parseResponseBody = async (response: Response): Promise<AuthResponse> => {
  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    return (await response.json()) as AuthResponse;
  }

  const text = await response.text();
  return text ? { message: text } : {};
};

const getErrorMessage = (payload: AuthResponse, fallback: string) => {
  if (typeof payload.message === 'string' && payload.message.trim()) {
    return payload.message;
  }

  const error = payload.error;
  if (typeof error === 'string' && error.trim()) {
    return error;
  }

  return fallback;
};

const postAuth = async <TBody extends Record<string, unknown>>(
  path: string,
  body: TBody,
): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const payload = await parseResponseBody(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, 'Authentication request failed.'));
  }

  return payload;
};

export const login = (payload: LoginPayload) => postAuth('/api/auth/login', payload);

export const register = (payload: RegisterPayload) => postAuth('/api/auth/register', payload);