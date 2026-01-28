import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// This endpoint keeps Supabase project alive by making a simple query
// It runs on a schedule defined in vercel.json
export async function GET(request: Request) {
    // Verify this is a cron request (optional security)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        // Allow the request anyway for now, but log it
        console.log('Keep-alive ping received (without auth)')
    }

    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        // Simple query to keep the database active
        const { data, error } = await supabase
            .from('profile')
            .select('id')
            .limit(1)

        if (error) {
            console.error('Keep-alive query failed:', error)
            return NextResponse.json({
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            }, { status: 500 })
        }

        console.log('Keep-alive successful at:', new Date().toISOString())

        return NextResponse.json({
            success: true,
            message: 'Supabase is alive!',
            timestamp: new Date().toISOString()
        })
    } catch (err) {
        console.error('Keep-alive error:', err)
        return NextResponse.json({
            success: false,
            error: 'Unknown error',
            timestamp: new Date().toISOString()
        }, { status: 500 })
    }
}
