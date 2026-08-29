type SupabaseErrorLike = {
  message?: string
  details?: string
  hint?: string
  code?: string
}

export function formatSupabaseError(error: unknown): string {
  if (error && typeof error === 'object') {
    const e = error as SupabaseErrorLike
    if (e.message) {
      return [e.message, e.details, e.hint].filter(Boolean).join(' · ')
    }
  }

  if (error instanceof Error) return error.message
  return 'Error desconocido al consultar Supabase'
}
