import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://lqxvzmpvqoeprxbzygmd.supabase.co';
// the key in the .env is the anon user's key 
if (!process.env.REACT_APP_SUPABASE_KEY) throw new Error("key must be defined!");

const supabase = createClient(supabaseUrl, process.env.REACT_APP_SUPABASE_KEY);

export default supabase; 