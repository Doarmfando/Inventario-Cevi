// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan las variables de entorno de Supabase')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: window.localStorage,
    storageKey: 'supabase.auth.token',
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    // DESACTIVAR DEBUG EN PRODUCCIÓN
    debug: false // Cambiado a false para eliminar los logs repetitivos
  },
  
  global: {
    headers: {
      'X-Client-Info': 'restaurant-inventory@1.0.0',
    },
  },
  
  db: {
    schema: 'public',
  },
  
  realtime: {
    params: {
      eventsPerSecond: 2,
    },
  },
})

// Solo mostrar un listener simple para desarrollo
if (process.env.NODE_ENV === 'development') {
  supabase.auth.onAuthStateChange((event, session) => {
    // Solo mostrar eventos importantes
    if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
      console.log(`🔐 Auth: ${event} - ${session?.user?.email || 'Sin usuario'}`);
    }
  });
}