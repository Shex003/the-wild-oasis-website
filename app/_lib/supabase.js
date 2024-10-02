import { createClient } from "@supabase/supabase-js";

export const supabas = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
