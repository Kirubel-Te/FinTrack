import { http, HttpResponse } from 'msw'
import { describe, expect, test } from 'vitest'
import { apiRequest, ApiError } from '../../src/api/client'
import {
  AUTH_STORAGE_KEY,
  AUTH_TOKEN_STORAGE_KEY as ACCESS_STORAGE_KEY,
  getAuthApiBaseUrl,
} from '../../src/api/auth'
import { server } from '../msw/server'

const API_BASE_URL = getAuthApiBaseUrl()

describe('apiRequest auth expiry flow', () => {
  test('clears auth and does not retry after 401', async () => {
    let requestCount = 0

    server.use(
      http.get(`${API_BASE_URL}/api/v1/protected-resource`, ({ request }) => {
        requestCount += 1
        const authHeader = request.headers.get('authorization')

        return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
      }),
    )

    window.localStorage.setItem(ACCESS_STORAGE_KEY, 'expired-access-token')
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
      accessToken: 'expired-access-token',
      user: {
        id: 'u1',
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@example.com',
        createdAt: new Date().toISOString(),
      },
    }))

    await expect(apiRequest<{ ok: boolean }>({
      path: '/api/v1/protected-resource',
    })).rejects.toBeInstanceOf(ApiError)

    expect(requestCount).toBe(1)
    expect(window.localStorage.getItem(ACCESS_STORAGE_KEY)).toBeNull()
    expect(window.localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull()
  })
})
