import { http, HttpResponse } from 'msw'
import { describe, expect, test } from 'vitest'
import { apiRequest, ApiError } from '../../src/api/client'
import {
  AUTH_STORAGE_KEY,
  AUTH_REFRESH_TOKEN_STORAGE_KEY as REFRESH_STORAGE_KEY,
  AUTH_TOKEN_STORAGE_KEY as ACCESS_STORAGE_KEY,
  getAuthApiBaseUrl,
} from '../../src/api/auth'
import { server } from '../msw/server'

const API_BASE_URL = getAuthApiBaseUrl()

describe('apiRequest auth retry flow', () => {
  test('retries once after 401 when refresh succeeds', async () => {
    let refreshCallCount = 0

    server.use(
      http.get(`${API_BASE_URL}/api/v1/protected-resource`, ({ request }) => {
        const authHeader = request.headers.get('authorization')

        if (authHeader === 'Bearer new-access-token') {
          return HttpResponse.json({
            success: true,
            data: { ok: true },
          })
        }

        return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
      }),
      http.post(`${API_BASE_URL}/api/v1/auth/refresh`, () => {
        refreshCallCount += 1

        return HttpResponse.json({
          success: true,
          data: {
            accessToken: 'new-access-token',
            refreshToken: 'new-refresh-token',
          },
        })
      }),
    )

    window.localStorage.setItem(ACCESS_STORAGE_KEY, 'expired-access-token')
    window.localStorage.setItem(REFRESH_STORAGE_KEY, 'valid-refresh-token')

    const result = await apiRequest<{ ok: boolean }>({
      path: '/api/v1/protected-resource',
    })

    expect(result.ok).toBe(true)
    expect(refreshCallCount).toBe(1)
    expect(window.localStorage.getItem(ACCESS_STORAGE_KEY)).toBe('new-access-token')
  })

  test('clears auth session when retry refresh fails', async () => {
    server.use(
      http.get(`${API_BASE_URL}/api/v1/protected-resource`, () => (
        HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
      )),
      http.post(`${API_BASE_URL}/api/v1/auth/refresh`, () => (
        HttpResponse.json({ message: 'Invalid refresh token' }, { status: 401 })
      )),
    )

    window.localStorage.setItem(ACCESS_STORAGE_KEY, 'expired-access-token')
    window.localStorage.setItem(REFRESH_STORAGE_KEY, 'expired-refresh-token')
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
      accessToken: 'expired-access-token',
      refreshToken: 'expired-refresh-token',
      user: {
        id: 'u1',
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@example.com',
        createdAt: new Date().toISOString(),
      },
    }))

    await expect(apiRequest({ path: '/api/v1/protected-resource' })).rejects.toBeInstanceOf(ApiError)

    expect(window.localStorage.getItem(ACCESS_STORAGE_KEY)).toBeNull()
    expect(window.localStorage.getItem(REFRESH_STORAGE_KEY)).toBeNull()
    expect(window.localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull()
  })
})
