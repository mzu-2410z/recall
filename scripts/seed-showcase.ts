import fs from 'fs'
import path from 'path'
import { createClient as createServiceClient } from '@supabase/supabase-js'

// Load .env manually
try {
  const envContent = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf-8')
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim()
      let val = trimmed.slice(eqIdx + 1).trim()
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1)
      }
      process.env[key] = val
    }
  }
} catch (e) {}

import { runShowcaseSeed } from '../lib/services/seed'

async function main() {
  console.log('--- SEEDING SHOWCASE MEETING WITH REAL GROQ AI ANALYSIS ---')

  const adminSupabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )

  const { data: profiles, error: profileErr } = await adminSupabase
    .from('profiles')
    .select('id, email')
    .limit(1)

  if (profileErr || !profiles || profiles.length === 0) {
    console.error('Error: No profile found in Supabase database to attach showcase meeting.', profileErr)
    process.exit(1)
  }

  const userId = profiles[0].id
  console.log(`Using user profile: ${profiles[0].email} (${userId})`)

  const result = await runShowcaseSeed(userId)

  console.log('\n--- SEED COMPLETE ---')
  console.log(`Meeting ID: ${result.meetingId}`)
  console.log(`Title: ${result.title}`)
  console.log(`Summary: ${result.summary.summary}`)
  console.log(`Takeaways Count: ${result.summary.key_takeaways.length}`)
  console.log(`Action Items Count: ${result.summary.action_items.length}`)
  console.log(`Decisions Count: ${result.summary.decisions.length}`)
  console.log(`Topics Count: ${result.summary.topics.length}`)
}

main().catch((err) => {
  console.error('Seed script error:', err)
  process.exit(1)
})
