// Debug API to check database schema and permissions
import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db'

const supabase = getDatabase

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    // 1. Test basic connection
    const { data: testQuery, error: testError } = await supabase
      .from('users')
      .select('count')
      .limit(1)

    console.log('Basic connection test:', { testQuery, testError })

    // 2. If userId provided, check specific user
    if (userId) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('clerk_user_id', userId)
        .single()

      console.log('User lookup:', { userData, userError })

      // 3. Try to update the user to test permissions
      if (userData) {
        const { error: updateError } = await supabase
          .from('users')
          .update({ updated_at: new Date().toISOString() })
          .eq('clerk_user_id', userId)

        console.log('Update test:', { updateError })

        return NextResponse.json({
          success: !updateError,
          connection: !testError,
          userFound: !!userData,
          canUpdate: !updateError,
          userData: userData,
          errors: {
            connection: testError?.message,
            userLookup: userError?.message,
            update: updateError?.message,
            updateDetails: updateError?.details,
            updateHint: updateError?.hint,
          }
        })
      }
    }

    return NextResponse.json({
      success: !testError,
      connection: !testError,
      message: 'Provide userId query param to test specific user',
      testError: testError?.message
    })

  } catch (error: any) {
    console.error('Debug API error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error',
      stack: error.stack
    }, { status: 500 })
  }
}
