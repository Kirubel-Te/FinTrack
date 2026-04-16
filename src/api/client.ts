import {
  clearAuthSession,
  getAuthApiBaseUrl,
  getStoredAccessToken,
  refreshSession,
  sanitizeErrorMessage,
} from './auth';

const API_BASE_URL = getAuthApiBaseUrl();

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

type RequestOptions = {
  path: string;
  method?: HttpMethod;
  body?: unknown;
  query?: Record<string, string | number | boolean | null | undefined>;
  auth?: boolean;
  retryOn401?: boolean;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

type ApiEnvelope<TData> = {
  success: boolean;
  data?: TData;
  message?: string;
  meta?: unknown;
};

const isObject = (value: unknown): value is Record<string, unknown> => (
  typeof value === 'object' && value !== null
);

const buildUrl = (path: string, query?: RequestOptions['query']) => {
  const url = new URL(`${API_BASE_URL}${path}`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === '') {
        continue;
      }

      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
};

const parseResponse = async (response: Response): Promise<unknown> => {
  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    return response.json();
  }

  const text = await response.text();
  return text ? { message: text } : {};
};

const toApiErrorMessage = (payload: unknown, fallback: string): string => {
  if (isObject(payload) && typeof payload.message === 'string') {
    return sanitizeErrorMessage(payload.message, fallback);
  }

  return fallback;
};

const refreshTokensRaw = async (): Promise<boolean> => {
  try {
    await refreshSession();
    return true;
  } catch {
    return false;
  }
};

const extractPayloadData = <TData>(payload: unknown): TData => {
  if (isObject(payload) && typeof payload.success === 'boolean') {
    const envelope = payload as ApiEnvelope<TData>;

    if (!envelope.success) {
      throw new ApiError(sanitizeErrorMessage(envelope.message, 'Request failed.'), 400);
    }

    return envelope.data as TData;
  }

  return payload as TData;
};

export const apiRequest = async <TData>(options: RequestOptions): Promise<TData> => {
  const {
    path,
    method = 'GET',
    body,
    query,
    auth = true,
    retryOn401 = true,
  } = options;

  const headers: Record<string, string> = {};

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = getStoredAccessToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(buildUrl(path, query), {
    method,
    cache: 'no-store',
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const payload = await parseResponse(response);

  if (response.status === 401 && auth && retryOn401) {
    const refreshed = await refreshTokensRaw();

    if (refreshed) {
      return apiRequest<TData>({
        ...options,
        retryOn401: false,
      });
    }

    clearAuthSession();
  }

  if (!response.ok) {
    throw new ApiError(
      toApiErrorMessage(payload, `Request failed with status ${response.status}.`),
      response.status,
    );
  }

  return extractPayloadData<TData>(payload);
};
