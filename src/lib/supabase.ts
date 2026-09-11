export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

import { createClient } from "@supabase/supabase-js";

export const supabase = (function() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL or ANON KEY not set; using mock client');
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
