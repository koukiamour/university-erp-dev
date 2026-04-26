import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wsrzvcznyjleueyiefmq.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indzcnp2Y3pueWpsZXVleWllZm1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NTgwMzgsImV4cCI6MjA5MjQzNDAzOH0.AIEv2Pzc71f0rr3v_uZaiWhTVUp7WS1UWG0cGMc54ac";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

