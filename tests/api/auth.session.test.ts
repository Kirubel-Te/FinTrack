import { http, HttpResponse } from 'msw'
import { describe, expect, test } from 'vitest'
import {
  AUTH_STORAGE_KEY,
  AUTH_TOKEN_STORAGE_KEY,
  getAuthApiBaseUrl,
  login,
  logout,
  register,
} from '../../src/api/auth'
import { server } from '../msw/server'

const API_BASE_URL = getAuthApiBaseUrl()

const user = {
  id: 'u1',
  firstName: 'Demo',
  lastName: 'User',
  email: 'demo@example.com',
  createdAt: new Date().toISOString(),
}

describe('auth session storage', () => {
  test('login stores only the access token', async () => {
    server.use(
      http.post(`${API_BASE_URL}/api/v1/auth/login`, async ({ request }) => {
        const body = await request.json() as Record<string, unknown>

        expect(body.email).toBe('demo@example.com')
        expect(body.password).toBe('password123')

        return HttpResponse.json({
          user,
          accessToken: 'login-access-token',
        })
      }),
    )

    const session = await login({
      email: 'demo@example.com',
      password: 'password123',
    })

    expect(session.accessToken).toBe('login-access-token')
    expect(window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)).toBe('login-access-token')
    expect(window.localStorage.getItem(AUTH_STORAGE_KEY)).toBeTruthy()
    expect(window.localStorage.getItem('fintrack.refreshToken')).toBeNull()
  })

  test('register stores only the access token', async () => {
    server.use(
      http.post(`${API_BASE_URL}/api/v1/auth/register`, async ({ request }) => {
        const body = await request.json() as Record<string, unknown>

        expect(body.firstName).toBe('Demo')
        expect(body.lastName).toBe('User')
        expect(body.email).toBe('demo@example.com')
        expect(body.password).toBe('password123')

        return HttpResponse.json({
          user,
          accessToken: 'register-access-token',
        })
      }),
    )

    const session = await register({
      firstName: 'Demo',
      lastName: 'User',
      email: 'demo@example.com',
      password: 'password123',
    })

    expect(session.accessToken).toBe('register-access-token')
    expect(window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)).toBe('register-access-token')
    expect(window.localStorage.getItem(AUTH_STORAGE_KEY)).toBeTruthy()
    expect(window.localStorage.getItem('fintrack.refreshToken')).toBeNull()
  })

  test('logout clears stored auth state without sending a refresh token', async () => {
    let logoutRequestBody: Record<string, unknown> | null = null

    server.use(
      http.post(`${API_BASE_URL}/api/v1/auth/logout`, async ({ request }) => {
        logoutRequestBody = await request.json() as Record<string, unknown>

        return HttpResponse.json({ success: true })
      }),
    )

    window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, 'stored-access-token')
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
      user,
      accessToken: 'stored-access-token',
    }))

    await logout()

    expect(logoutRequestBody).toEqual({})
    expect(window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)).toBeNull()
    expect(window.localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull()
  })
})