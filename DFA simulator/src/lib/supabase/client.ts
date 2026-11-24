import { createClient } from '@supabase/supabase-js';

// These will be loaded from environment variables for security
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Supabase environment variables are missing. Cloud features will be disabled.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

