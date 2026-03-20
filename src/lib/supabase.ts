import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Public client — use in server components and public API routes
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client — use only in protected API routes (never expose to browser)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)