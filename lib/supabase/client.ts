import { createClient } from '@supabase/supabase-js'

const PLACEHOLDER_MARKERS = ['tu-proyecto', 'tu-anon-key', 'tu-service-role-key']

function readSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const key = (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  )?.trim()

  if (!url || !key) {
    throw new Error(
      'Faltan variables de Supabase. Configurá NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local',
    )
  }

  const looksLikePlaceholder = PLACEHOLDER_MARKERS.some(
    (marker) => url.includes(marker) || key.includes(marker),
  )

  if (looksLikePlaceholder) {
    throw new Error(
      'Las credenciales de Supabase en .env.local siguen siendo placeholders. Copiá la URL y la anon key desde Supabase → Project Settings → API.',
    )
  }

  return { url, key }
}

export function createSupabaseClient() {
  const { url, key } = readSupabaseEnv()
  return createClient(url, key)
}
