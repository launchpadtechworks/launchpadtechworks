import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "https://moedlakptpikzqjallmp.supabase.co";
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_axoZkz0oXxXa1PV-ZkgDww_-U97ewcf";

export const supabase = createClient(supabaseUrl, supabasePublishableKey);
