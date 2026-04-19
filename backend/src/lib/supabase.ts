import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key-1234567890abcdefghijklmnopqrst';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-role-key-1234567890abcdefghijklmnopqrstu';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export default supabase;
