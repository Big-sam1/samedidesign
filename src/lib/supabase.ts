export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isPlaceholder = (value: string | undefined) => !value || value.includes('your-project') || value.includes('your_supabase');
export const isSupabaseConfigured = !isPlaceholder(supabaseUrl) && !isPlaceholder(supabaseAnonKey);

import { createClient } from "@supabase/supabase-js";

export const supabase = (function() {
  if (!isSupabaseConfigured) {
    return {
      // Minimal mock supporting .from().select().
      from: () => ({
        select: async () => ({ data: [], error: null })
      })
    } as any;
  }
  return createClient(supabaseUrl, supabaseAnonKey);
})();

export default supabase;
