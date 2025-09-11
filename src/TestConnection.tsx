import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase.ts'

export function TestConnection() {
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const testConnection = async () => {
      try {
        const { data, error } = await supabase.from('categorias').select('*')
        
        if (error) {
          setError(error.message)
        } else {
          setIsConnected(true)
          console.log('✅ Conexión exitosa. Categorías:', data)
        }
      } catch (err) {
        setError('Error de conexión')
        console.error('❌ Error:', err)
      } finally {
        setLoading(false)
      }
    }
    
    testConnection()
  }, [])

  return (
    <div style={{ 
      padding: '10px', 
      backgroundColor: loading ? '#f3f4f6' : isConnected ? '#dcfce7' : '#fef2f2',
      border: '1px solid #ccc', 
      margin: '10px',
      borderRadius: '6px'
    }}>
      <h4 style={{ margin: '0 0 5px 0' }}>🔗 Test Supabase</h4>
      {loading && <div>Conectando...</div>}
      {isConnected && <div style={{ color: 'green' }}>✅ Conectado</div>}
      {error && <div style={{ color: 'red' }}>❌ {error}</div>}
    </div>
  )
}