import { http, HttpResponse } from 'msw'
import { describe, expect, test } from 'vitest'
import {
  AUTH_REFRESH_TOKEN_STORAGE_KEY,
  AUTH_TOKEN_STORAGE_KEY,
  getAuthApiBaseUrl,
  refreshSession,
} from '../../src/api/auth'
import { server } from '../msw/server'

const API_BASE_URL = getAuthApiBaseUrl()

describe('refreshSession', () => {
  test('reuses in-flight refresh request for concurrent calls', async () => {
    let refreshRequestCount = 0

    server.use(
      http.post(`${API_BASE_URL}/api/v1/auth/refresh`, async () => {
        refreshRequestCount += 1

        return HttpResponse.json({
          success: true,
          data: {
            accessToken: 'new-access-token',
            refreshToken: 'new-refresh-token',
          },
        })
      }),
    )

    window.localStorage.setItem(AUTH_REFRESH_TOKEN_STORAGE_KEY, 'seed-refresh-token')

    const [first, second, third] = await Promise.all([
      refreshSession(),
      refreshSession(),
      refreshSession(),
    ])

    expect(refreshRequestCount).toBe(1)
    expect(first.accessToken).toBe('new-access-token')
    expect(second.accessToken).toBe('new-access-token')
    expect(third.accessToken).toBe('new-access-token')
    expect(window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)).toBe('new-access-token')
  })
})
