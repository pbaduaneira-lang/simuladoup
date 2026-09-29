import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://sosqfvynxtdhbrhgnhce.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_ylktM43AK48uAORdAiAs6Q_T7gxEDae';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
