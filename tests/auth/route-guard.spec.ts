import { test, expect } from '@playwright/test'

test.describe('unauthenticated user', () => {
  test('can access the home page', async ({ page }) => {
    await page.goto('/')
    await expect(
      page.getByRole('heading', { name: /Welcome to our Auth Demo/ })
    ).toBeVisible()
  })

  test('can access the settings page', async ({ page }) => {
    await page.goto(`/settings`)
    await expect(page).toHaveURL('/auth/sign-in')
  })
})
