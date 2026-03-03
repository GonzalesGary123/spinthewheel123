import type { User } from '@supabase/supabase-js'

const user = ref<User | null>(null)
let initialized = false

export const useSupabaseUser = () => {
  if (!initialized) {
    initialized = true
    const { $supabase } = useNuxtApp() as any

    // Get initial session
    $supabase.auth.getUser().then(({ data }: any) => {
      user.value = data?.user ?? null
    })

    // Listen for auth state changes
    $supabase.auth.onAuthStateChange((_event: string, session: any) => {
      user.value = session?.user ?? null
    })
  }

  return user
}
