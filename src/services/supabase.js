import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yrqtkfrzlipdhkuwbnwu.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_8W13DnEikIj6womLoILOQ_Q4NMq4u';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);