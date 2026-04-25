import { expect, test } from '@playwright/test'

test('landing page loads and shows primary actions', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('button', { name: 'Get Started' }).first()).toBeVisible()
  await expect(page.getByRole('button', { name: 'Login' }).first()).toBeVisible()
  await expect(page.getByText('FinTrack').first()).toBeVisible()
})
