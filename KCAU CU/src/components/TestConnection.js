import { useEffect, useState } from 'react'
import { supabase } from '../config/supabase'

export default function TestConnection() {
  const [status, setStatus] = useState('Testing connection...')

  useEffect(() => {
    async function testConnection() {
      try {
        // Try to fetch something simple from the database
        const { data, error } = await supabase
          .from('users')
          .select('count')
          .limit(1)

        if (error) {
          throw error
        }

        setStatus('Connection successful! Database is connected.')
      } catch (error) {
        setStatus(`Connection failed: ${error.message}`)
      }
    }

    testConnection()
  }, [])

  return (
    <div>
      <h2>Database Connection Status</h2>
      <p>{status}</p>
    </div>
  )
} 