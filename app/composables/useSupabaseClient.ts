import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types'

export const useSupabaseClient = (): SupabaseClient<Database> => {
  const { $supabase } = useNuxtApp()
  return $supabase as SupabaseClient<Database>
}
