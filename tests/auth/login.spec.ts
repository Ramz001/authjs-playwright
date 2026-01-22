import { test, expect } from '@playwright/test'
import { loginAsTestUser } from '../utils/login.util'

test.describe('Login functionality', () => {
  test('should login successfully using environment variables', async ({
    page,
  }) => {
    // Use the blackbox login utility
    await loginAsTestUser(page)

    // Verify we're on the settings page
    await expect(page).toHaveURL('/settings')

    // Verify user is authenticated (check for logout button or user info)
    await expect(page.getByText('Settings')).toBeVisible()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    // Navigate to sign in page
    await page.goto('/auth/sign-in')

    // Fill in invalid credentials
    await page.getByLabel('Email').fill('invalid@example.com')
    await page.getByLabel('Password').fill('wrongpassword')

    // Submit the form
    await page.getByRole('button', { name: 'Login', exact: true }).click()

    // Verify error message appears (adjust selector based on your error display)
    await expect(page.getByText(/error|invalid|failed/i)).toBeVisible({
      timeout: 5000,
    })
  })

  test('should validate email format', async ({ page }) => {
    await page.goto('/auth/sign-in')

    // Fill in invalid email format
    await page.getByLabel('Email').fill('notanemail')
    await page.getByLabel('Password').fill('password123')

    // Blur the email field to trigger validation
    await page.getByLabel('Email').blur()

    // Check for validation error
    const emailField = page.getByLabel('Email')
    const isInvalid = await emailField.getAttribute('aria-invalid')
    expect(isInvalid).toBe('true')
  })

  test('should toggle password visibility', async ({ page }) => {
    await page.goto('/auth/sign-in')

    const passwordInput = page.getByLabel('Password')

    // Initially password should be hidden
    await expect(passwordInput).toHaveAttribute('type', 'password')

    // Click the eye icon to show password
    await page.locator('[data-slot="addon"]').last().click()

    // Password should now be visible
    await expect(passwordInput).toHaveAttribute('type', 'text')

    // Click again to hide
    await page.locator('[data-slot="addon"]').last().click()

    // Password should be hidden again
    await expect(passwordInput).toHaveAttribute('type', 'password')
  })
})
