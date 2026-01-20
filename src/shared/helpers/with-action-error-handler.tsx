'use server'

import { ZodError, ZodIssue } from 'zod'

export type ActionResponse<T = void> =
  | { success: true; data: T }
  | {
      success: false
      error: string
      issues?: Array<ZodIssue>
    }

export async function withActionErrorHandler<T>(fn: () => Promise<T>) {
  try {
    return await fn()
  } catch (error) {
    console.error('[Server Action Error]:', error)

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      const issues = error.issues.map((issue) => issue)

      return {
        success: false,
        error: 'Validation failed',
        issues,
      }
    }

    // Handle Error instances
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }

    // Handle string errors
    if (typeof error === 'string') {
      return { success: false, error }
    }

    // Default error
    return { success: false, error: 'An unexpected error occurred' }
  }
}
