(async () => {
  try {
    const { createClient } = await import('@supabase/supabase-js')

    const SUPABASE_URL = process.env.SUPABASE_URL
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

    console.log('SUPABASE_URL set?', !!SUPABASE_URL)
    console.log('SUPABASE_SERVICE_ROLE_KEY set?', !!SUPABASE_SERVICE_ROLE_KEY)

    // Node.js < 22 doesn't provide a global WebSocket — supabase-js needs one.
    // Try to load the `ws` package and set globalThis.WebSocket if available.
    try {
      const ws = await import('ws')
      if (!globalThis.WebSocket && ws && ws.WebSocket) {
        globalThis.WebSocket = ws.WebSocket
        console.log('Using ws polyfill for WebSocket')
      }
    } catch (err) {
      console.log('ws not installed; if you run into WebSocket errors, run `npm install ws`')
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('\nPlease set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables before running this script.')
      process.exit(1)
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Try a simple select to verify connectivity and permissions
    console.log('\nQuerying `contact_messages` (limit 1) to verify access...')
    const { data, error } = await supabase.from('contact_messages').select('*').limit(1)

    if (error) {
      console.error('Supabase query error:', error)
      process.exit(2)
    }

    console.log('Query succeeded. Rows returned:', data.length)
    console.log(JSON.stringify(data, null, 2))
    process.exit(0)
  } catch (err) {
    console.error('Unexpected error:', err)
    process.exit(3)
  }
})()
