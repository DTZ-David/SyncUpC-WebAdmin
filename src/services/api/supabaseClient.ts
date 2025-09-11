import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://osavzgjbmuazpsyeqjfv.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zYXZ6Z2pibXVhenBzeWVxamZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMDU5MTYsImV4cCI6MjA2ODg4MTkxNn0.64PbEO6H4IOuITkI01Ccm_0zIt6l4yscrDsuR8_JGGQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
