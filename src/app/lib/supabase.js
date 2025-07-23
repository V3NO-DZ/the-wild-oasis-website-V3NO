// supabase.js (for general client-side usage — keep your anon key)
export const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );
  
  // supabaseAdmin.js (for server-only trusted actions)
  import { createClient } from "@supabase/supabase-js";
  
  export const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  