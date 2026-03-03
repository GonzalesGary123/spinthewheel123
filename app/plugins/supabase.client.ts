import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types'

let supabaseClient: SupabaseClient<Database> | null = null

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const url = config.public.supabaseUrl as string
  const key = config.public.supabaseAnonKey as string

  if (!supabaseClient) {
    supabaseClient = createClient<Database>(url, key)
  }

  return {
    provide: {
      supabase: supabaseClient,
    },
  }
})
