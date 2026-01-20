'use server'

import { ZodError, ZodIssue } from 'zod'

export type ActionResponse<T = void> =
  | { success: true; data: T }
  | {
      success: false
      error: string
      issues?: Array<ZodIssue>
    }

export function withActionErrorHandler<TInput, TOutput>(
  action: (input: TInput) => Promise<TOutput>
) {
  return async (input: TInput): Promise<ActionResponse<TOutput>> => {
    try {
      const result = await action(input)
      return { success: true, data: result }
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
}
