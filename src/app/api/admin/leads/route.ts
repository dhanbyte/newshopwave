import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    console.log('API Debug: Checking Env Vars')
    console.log('URL Exists:', !!supabaseUrl)
    console.log('Key Exists:', !!supabaseKey)

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase Environment Variables')
    }

    // Create a fresh client with NO persistence
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false
      }
    })
    
    console.log('API: Connected to', supabaseUrl.substring(0, 20) + '...')

    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      
    // Sort manually in JS just in case
    const sortedLeads = leads ? leads.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ) : []

    if (error) {
      console.error('Error fetching leads:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch leads: ' + error.message, leads: [] },
        { status: 500 }
      )
    }

    console.log(`API: Fetched ${sortedLeads.length} leads directly`)
    return NextResponse.json({ success: true, leads: sortedLeads })
  } catch (error) {
    console.error('Error in admin leads API:', error)
    return NextResponse.json(
      { success: false, error: 'Internal Server Error: ' + String(error), leads: [] },
      { status: 500 }
    )
  }
}
