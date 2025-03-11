import { supabase } from '../config/supabase'

export const authService = {
  // Sign up
  async signUp(email, password, fullName, phoneNumber) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) throw authError

      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email,
            full_name: fullName,
            phone_number: phoneNumber,
          },
        ])

      if (profileError) throw profileError

      return { data: authData, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Sign in
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Sign out
  async signOut() {
    return await supabase.auth.signOut()
  },
} 