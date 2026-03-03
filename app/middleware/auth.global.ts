export default defineNuxtRouteMiddleware(async (to) => {
  // Only protect dashboard routes
  if (!to.path.startsWith('/dashboard')) return

  const { $supabase } = useNuxtApp() as any
  const { data } = await $supabase.auth.getSession()

  if (!data.session) {
    return navigateTo('/login')
  }
})
