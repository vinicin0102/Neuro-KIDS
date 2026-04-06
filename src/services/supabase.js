import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// URL extraída da JWT informada
const SUPABASE_URL = 'https://qwfqrvqjacunhgqtajrq.supabase.co';

// Chave fornecida pelo usuário
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3ZnFydnFqYWN1bmhncXRhanJxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTUwOTkxNCwiZXhwIjoyMDkxMDg1OTE0fQ.mOYigKnw4_yjSFboowFfarbxRfEJnJzgZUI28_EQVpQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
